-- Request counters only: no recordings, reference text or transcripts.
create table if not exists public.pronunciation_assessment_quota (
  user_id uuid primary key references auth.users(id) on delete cascade,
  day_start date not null,
  day_count integer not null default 0,
  minute_start timestamptz not null,
  minute_count integer not null default 0
);
alter table public.pronunciation_assessment_quota enable row level security;
revoke all on public.pronunciation_assessment_quota from anon, authenticated;

create or replace function public.consume_pronunciation_assessment_quota(learner_id uuid)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare current_time_utc timestamptz := now(); quota public.pronunciation_assessment_quota;
begin
  insert into public.pronunciation_assessment_quota(user_id, day_start, minute_start)
    values (learner_id, (current_time_utc at time zone 'UTC')::date, current_time_utc)
    on conflict (user_id) do nothing;
  select * into quota from public.pronunciation_assessment_quota where user_id = learner_id for update;
  if quota.day_start <> (current_time_utc at time zone 'UTC')::date then quota.day_count := 0; end if;
  if quota.minute_start <= current_time_utc - interval '1 minute' then quota.minute_count := 0; quota.minute_start := current_time_utc; end if;
  if quota.day_count >= 200 or quota.minute_count >= 12 then return false; end if;
  update public.pronunciation_assessment_quota set day_start = (current_time_utc at time zone 'UTC')::date,
    day_count = quota.day_count + 1, minute_start = quota.minute_start, minute_count = quota.minute_count + 1 where user_id = learner_id;
  return true;
end;
$$;
revoke all on function public.consume_pronunciation_assessment_quota(uuid) from public, anon, authenticated;
grant execute on function public.consume_pronunciation_assessment_quota(uuid) to service_role;
