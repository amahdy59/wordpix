-- Harden existing policies without changing learner data or R2 asset mappings.
-- Apply after 02_guest_migration.sql.
begin;

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update own word memory" on public.word_memory;
create policy "Users can update own word memory"
  on public.word_memory for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- The trigger function references public.profiles explicitly, so it does not
-- need a caller-controlled search path. Trigger execution is unaffected by
-- revoking direct EXECUTE privileges from client roles.
alter function public.handle_new_user() set search_path = '';
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Migration receipts are append-only from the client. Separate policies make
-- that contract explicit even if broader table grants are added later.
drop policy if exists "Own migration receipts" on public.guest_migrations;
create policy "Users can view own migration receipts"
  on public.guest_migrations for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can insert own migration receipts"
  on public.guest_migrations for insert to authenticated
  with check ((select auth.uid()) = user_id);

commit;
