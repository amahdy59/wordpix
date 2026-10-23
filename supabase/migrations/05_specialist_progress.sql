-- Expand-only specialist storage. Apply before enabling specialist cloud persistence.
begin;
create table if not exists public.specialist_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track text not null check (track in ('pronunciation','hadith','conversation','business')),
  lesson_id text not null,
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id,track,lesson_id)
);
-- Keep every accepted action so concurrent edits to reflection text remain recoverable.
create table if not exists public.specialist_progress_versions (
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id text not null,
  track text not null,
  lesson_id text not null,
  state jsonb not null,
  received_at timestamptz not null default now(),
  primary key (user_id,operation_id)
);
alter table public.specialist_progress enable row level security;
alter table public.specialist_progress_versions enable row level security;
create policy "Own specialist progress" on public.specialist_progress for all to authenticated
  using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Own specialist versions" on public.specialist_progress_versions for all to authenticated
  using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update,delete on public.specialist_progress,public.specialist_progress_versions to authenticated;

create or replace function public.merge_specialist_state(a jsonb,b jsonb)
returns jsonb language plpgsql immutable set search_path='' as $$
declare result jsonb; field text; evidence jsonb;
begin
  result:=case when (a->>'updatedAt')::timestamptz > (b->>'updatedAt')::timestamptz then b||a else a||b end;
  -- Reviews may honestly lower status. Earned stage/score evidence is retained separately.
  foreach field in array array['bestScorePercent','quizBestScore','sessions'] loop
    if a ? field or b ? field then result:=jsonb_set(result,array[field],to_jsonb(greatest(coalesce((a->>field)::numeric,0),coalesce((b->>field)::numeric,0)))); end if;
  end loop;
  foreach field in array array['completedStages','checklistCompleted'] loop
    if a ? field or b ? field then
      select coalesce(jsonb_agg(value order by value),'[]'::jsonb) into evidence from (
        select distinct value from jsonb_array_elements(coalesce(a->field,'[]'::jsonb)||coalesce(b->field,'[]'::jsonb))
      ) entries;
      result:=jsonb_set(result,array[field],evidence);
    end if;
  end loop;
  if a ? 'targetEvidence' or b ? 'targetEvidence' then
    select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into evidence from (
      select distinct on (key) key,value from (
        select key,value from jsonb_each(coalesce(a->'targetEvidence','{}'::jsonb))
        union all select key,value from jsonb_each(coalesce(b->'targetEvidence','{}'::jsonb))
      ) all_evidence order by key,(value->>'updatedAt')::timestamptz desc
    ) latest;
    result:=jsonb_set(result,'{targetEvidence}',evidence);
  end if;
  return result;
end;
$$;

create or replace function public.save_specialist_progress(operation_id text,expected_user uuid,track_name text,lesson_id text,progress_state jsonb,previous_sessions integer default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare uid uuid:=auth.uid(); inserted_count integer; result jsonb;
begin
  if uid is null or uid<>expected_user then raise exception 'Authentication required' using errcode='42501'; end if;
  if length(operation_id)>500 or operation_id='' or track_name not in ('pronunciation','hadith','conversation','business')
    or jsonb_typeof(progress_state) is distinct from 'object' or coalesce(progress_state->>'status','') not in ('in-progress','needs-practice','mastered')
    or progress_state->>'updatedAt' is null
    or not ((track_name='pronunciation' and lesson_id ~ '^lesson-(0[1-9]|[1-5][0-9]|6[0-8])$')
      or (track_name='hadith' and lesson_id ~ '^hadith-(0[1-9]|[1-3][0-9]|4[0-2])$')
      or (track_name in ('conversation','business') and lesson_id ~ '^unit-(0[1-9]|[1-3][0-9]|40)$')) then
    raise exception 'Invalid specialist progress' using errcode='23514';
  end if;
  -- Force timestamp parsing at the trusted boundary before persisting a receipt.
  perform (progress_state->>'updatedAt')::timestamptz;
  if previous_sessions<0 then raise exception 'Invalid session baseline' using errcode='23514'; end if;
  if octet_length(progress_state::text)>262144
    or jsonb_typeof(progress_state->'currentStage') is distinct from 'number'
    or (progress_state->>'currentStage')::numeric<>trunc((progress_state->>'currentStage')::numeric)
    or (progress_state->>'currentStage')::integer<0
    or (progress_state->>'currentStage')::integer>(case track_name when 'pronunciation' then 4 when 'hadith' then 3 when 'conversation' then 6 else 8 end)
    or (track_name in ('hadith','business','conversation') and jsonb_typeof(progress_state->'completedStages') is distinct from 'array') then
    raise exception 'Invalid specialist record' using errcode='23514';
  end if;
  insert into public.specialist_progress_versions(user_id,operation_id,track,lesson_id,state)
    values(uid,save_specialist_progress.operation_id,track_name,save_specialist_progress.lesson_id,progress_state)
    on conflict on constraint specialist_progress_versions_pkey do nothing;
  get diagnostics inserted_count=row_count;
  if inserted_count>0 then
    insert into public.specialist_progress(user_id,track,lesson_id,state)
      values(uid,track_name,save_specialist_progress.lesson_id,progress_state)
      on conflict on constraint specialist_progress_pkey do update set
        state=case when previous_sessions is not null and progress_state ? 'sessions' then
          jsonb_set(public.merge_specialist_state(public.specialist_progress.state,excluded.state),'{sessions}',
            to_jsonb(greatest(coalesce((public.specialist_progress.state->>'sessions')::integer,0)+greatest(0,(progress_state->>'sessions')::integer-previous_sessions),(progress_state->>'sessions')::integer)))
          else public.merge_specialist_state(public.specialist_progress.state,excluded.state) end,updated_at=now();
  end if;
  select p.state into result from public.specialist_progress p where p.user_id=uid and p.track=track_name and p.lesson_id=save_specialist_progress.lesson_id;
  return result;
end;
$$;

create or replace function public.get_specialist_progress(expected_user uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare uid uuid:=auth.uid(); result jsonb:='{}'::jsonb; track_name text; entries jsonb;
begin
  if uid is null or uid<>expected_user then raise exception 'Authentication required' using errcode='42501'; end if;
  foreach track_name in array array['pronunciation','hadith','conversation','business'] loop
    select coalesce(jsonb_object_agg(lesson_id,state),'{}'::jsonb) into entries
      from public.specialist_progress where user_id=uid and track=track_name;
    result:=jsonb_set(result,array[track_name||'Progress'],entries);
  end loop;
  return result;
end;
$$;

create or replace function public.reset_specialist_progress(expected_user uuid)
returns void language plpgsql security invoker set search_path='' as $$
begin
  if auth.uid() is null or auth.uid()<>expected_user then raise exception 'Authentication required' using errcode='42501'; end if;
  delete from public.specialist_progress where user_id=expected_user;
  delete from public.specialist_progress_versions where user_id=expected_user;
end;
$$;

-- Retain the original vocabulary transaction; extend its receipt with specialist records.
do $$
begin
  execute replace(replace(pg_get_functiondef('public.merge_guest_progress(uuid,uuid,jsonb)'::regprocedure),
    'FUNCTION public.merge_guest_progress(', 'FUNCTION public.merge_guest_progress_v1('),
    'merge_guest_progress.', 'merge_guest_progress_v1.');
end;
$$;
create or replace function public.merge_guest_progress(migration_id uuid,expected_user uuid,guest_state jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb; track_name text; entry record;
begin
  if auth.uid() is null or auth.uid()<>expected_user then raise exception 'Authentication required' using errcode='42501'; end if;
  result:=public.merge_guest_progress_v1(migration_id,expected_user,guest_state);
  foreach track_name in array array['pronunciation','hadith','conversation','business'] loop
    for entry in select key,value from jsonb_each(coalesce(guest_state->(track_name||'Progress'),'{}'::jsonb)) loop
      perform public.save_specialist_progress('migration:'||migration_id::text||':'||track_name||':'||entry.key,expected_user,track_name,entry.key,entry.value);
    end loop;
  end loop;
  result:=result||public.get_specialist_progress(expected_user);
  return result;
end;
$$;
revoke all on function public.save_specialist_progress(text,uuid,text,text,jsonb,integer), public.get_specialist_progress(uuid),public.reset_specialist_progress(uuid),public.merge_guest_progress(uuid,uuid,jsonb) from public,anon;
revoke all on function public.merge_guest_progress_v1(uuid,uuid,jsonb) from public,anon;
grant execute on function public.merge_guest_progress_v1(uuid,uuid,jsonb) to authenticated;
grant execute on function public.save_specialist_progress(text,uuid,text,text,jsonb,integer), public.get_specialist_progress(uuid),public.reset_specialist_progress(uuid),public.merge_guest_progress(uuid,uuid,jsonb) to authenticated;
commit;
