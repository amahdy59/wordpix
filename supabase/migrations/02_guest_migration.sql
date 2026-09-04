-- Apply after 01_schema.sql. Guest migration is one transaction, retried by receipt ID.
begin;
create table public.guest_migrations (
  user_id uuid not null references auth.users(id) on delete cascade,
  migration_id uuid not null,
  result jsonb not null,
  primary key (user_id, migration_id)
);
alter table public.guest_migrations enable row level security;
create policy "Own migration receipts" on public.guest_migrations
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
grant select, insert on public.guest_migrations to authenticated;

create or replace function public.merge_guest_progress(migration_id uuid, expected_user uuid, guest_state jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  uid uuid := auth.uid();
  profile public.profiles%rowtype;
  result jsonb;
  overlapping_xp integer;
  overlapping_sessions integer;
begin
  if uid is null or uid <> expected_user then raise exception 'Authentication required'; end if;
  if jsonb_typeof(guest_state->'learnerProgress') <> 'object'
    or jsonb_typeof(guest_state->'wordMemory') <> 'object'
    or jsonb_typeof(guest_state->'sessionHistory') <> 'array' then
    raise exception 'Invalid guest state';
  end if;
  insert into public.profiles(id) values(uid) on conflict do nothing;
  -- Serialize all migrations for this account, including concurrent retries.
  select * into profile from public.profiles where id = uid for update;
  select r.result into result from public.guest_migrations r
    where r.user_id = uid and r.migration_id = merge_guest_progress.migration_id;
  if found then return result; end if;

  select coalesce(sum((h.xp_breakdown->>'total')::integer), 0), count(*)
    into overlapping_xp, overlapping_sessions
    from public.session_history h
    where h.user_id = uid and h.session_id in
      (select s->>'sessionId' from jsonb_array_elements(guest_state->'sessionHistory') s);

  insert into public.session_history(user_id, session_id, completed_at, score, total_words, xp_breakdown)
    select uid, s->>'sessionId', (s->>'completedAt')::timestamptz,
      (s->>'score')::integer, (s->>'totalWords')::integer, s->'xp'
    from jsonb_array_elements(guest_state->'sessionHistory') s
    on conflict (user_id, session_id) do nothing;

  insert into public.word_memory(user_id, word_id, state)
    select uid, key, value from jsonb_each(guest_state->'wordMemory')
    on conflict (user_id, word_id) do update set state = excluded.state, updated_at = now()
    where coalesce((excluded.state->>'lastSeenAt')::timestamptz, '-infinity'::timestamptz)
      > coalesce((public.word_memory.state->>'lastSeenAt')::timestamptz, '-infinity'::timestamptz);

  update public.profiles set
    xp = profile.xp + greatest(0, (guest_state#>>'{learnerProgress,xp}')::integer - overlapping_xp),
    sessions_completed = profile.sessions_completed + greatest(0, (guest_state#>>'{learnerProgress,sessionsCompleted}')::integer - overlapping_sessions),
    streak = greatest(profile.streak, (guest_state#>>'{learnerProgress,streak}')::integer),
    days_active = greatest(profile.days_active, (guest_state#>>'{learnerProgress,daysActive}')::integer),
    last_studied_date = greatest(profile.last_studied_date, guest_state#>>'{learnerProgress,lastStudiedDate}'),
    preferences = guest_state->'preferences', accessibility = guest_state->'accessibility', updated_at = now()
    where id = uid returning * into profile;

  result := guest_state || jsonb_build_object(
    'learnerProgress', jsonb_build_object('xp', profile.xp, 'streak', profile.streak,
      'daysActive', profile.days_active, 'sessionsCompleted', profile.sessions_completed,
      'lastStudiedDate', profile.last_studied_date,
      'completedSessionIds', coalesce((select jsonb_agg(session_id) from public.session_history where user_id = uid), '[]'::jsonb)),
    'wordMemory', coalesce((select jsonb_object_agg(word_id, state) from public.word_memory where user_id = uid), '{}'::jsonb),
    'sessionHistory', coalesce((select jsonb_agg(jsonb_build_object('sessionId', session_id,
      'completedAt', completed_at, 'score', score, 'totalWords', total_words, 'xp', xp_breakdown)
      order by completed_at desc) from public.session_history where user_id = uid), '[]'::jsonb));
  insert into public.guest_migrations(user_id, migration_id, result)
    values(uid, merge_guest_progress.migration_id, result);
  return result;
end;
$$;
revoke all on function public.merge_guest_progress(uuid, uuid, jsonb) from public, anon;
grant execute on function public.merge_guest_progress(uuid, uuid, jsonb) to authenticated;
commit;
