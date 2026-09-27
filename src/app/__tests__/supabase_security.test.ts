import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = (name: string) =>
  readFileSync(resolve(process.cwd(), "supabase", "migrations", name), "utf8").toLowerCase();

const schemaSql = migration("01_schema.sql");
const guestMigrationSql = migration("02_guest_migration.sql");
const hardeningSql = migration("03_rls_hardening.sql");
const allSql = `${schemaSql}\n${guestMigrationSql}\n${hardeningSql}`;

describe("Supabase authorization contract", () => {
  it.each(["profiles", "word_memory", "session_history", "guest_migrations"])(
    "enables RLS for %s",
    (table) => {
      expect(allSql).toMatch(
        new RegExp(`alter table (?:public\\.)?${table} enable row level security`)
      );
    }
  );

  it("checks ownership on both sides of mutable-row updates", () => {
    expect(hardeningSql).toMatch(
      /on public\.profiles for update to authenticated\s+using \(\(select auth\.uid\(\)\) = id\)\s+with check \(\(select auth\.uid\(\)\) = id\)/
    );
    expect(hardeningSql).toMatch(
      /on public\.word_memory for update to authenticated\s+using \(\(select auth\.uid\(\)\) = user_id\)\s+with check \(\(select auth\.uid\(\)\) = user_id\)/
    );
  });

  it("keeps migration receipts append-only for authenticated clients", () => {
    expect(hardeningSql).toContain("on public.guest_migrations for select to authenticated");
    expect(hardeningSql).toContain("on public.guest_migrations for insert to authenticated");
    expect(hardeningSql).not.toMatch(/guest_migrations for (all|update|delete)/);
  });

  it("pins the security-definer trigger search path and removes client execution", () => {
    expect(hardeningSql).toContain("alter function public.handle_new_user() set search_path = ''");
    expect(hardeningSql).toContain(
      "revoke all on function public.handle_new_user() from public, anon, authenticated"
    );
  });

  it("keeps guest migration RPC execution restricted to authenticated users", () => {
    expect(guestMigrationSql).toContain(
      "revoke all on function public.merge_guest_progress(uuid, uuid, jsonb) from public, anon"
    );
    expect(guestMigrationSql).toContain(
      "grant execute on function public.merge_guest_progress(uuid, uuid, jsonb) to authenticated"
    );
  });
});
