import { createClient } from "@supabase/supabase-js";

const requiredNames = [
  "WORDPIX_STAGING_SUPABASE_URL",
  "WORDPIX_STAGING_SUPABASE_ANON_KEY",
  "WORDPIX_STAGING_USER_A_EMAIL",
  "WORDPIX_STAGING_USER_A_PASSWORD",
  "WORDPIX_STAGING_USER_B_EMAIL",
  "WORDPIX_STAGING_USER_B_PASSWORD",
];
const missing = requiredNames.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Staging auth verification requires: ${missing.join(", ")}`);
  process.exit(1);
}

const url = process.env.WORDPIX_STAGING_SUPABASE_URL;
const anonKey = process.env.WORDPIX_STAGING_SUPABASE_ANON_KEY;
const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};
const clientA = createClient(url, anonKey, clientOptions);
const clientB = createClient(url, anonKey, clientOptions);

async function signIn(client, email, password, label) {
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) {
    throw new Error(`${label} could not authenticate with the dedicated staging account.`);
  }
  return data.user.id;
}

async function assertOwnProfileVisible(client, userId, label) {
  const { data, error } = await client.from("profiles").select("id").eq("id", userId);
  if (error || data?.length !== 1 || data[0]?.id !== userId) {
    throw new Error(`${label} could not read its own profile.`);
  }
}

async function assertOtherProfileHidden(client, otherUserId, label) {
  const { data, error } = await client.from("profiles").select("id").eq("id", otherUserId);
  if (error) throw new Error(`${label} cross-account read check returned an unexpected error.`);
  if ((data ?? []).length !== 0) throw new Error(`${label} could read another account's profile.`);
}

try {
  const userA = await signIn(
    clientA,
    process.env.WORDPIX_STAGING_USER_A_EMAIL,
    process.env.WORDPIX_STAGING_USER_A_PASSWORD,
    "User A"
  );
  const userB = await signIn(
    clientB,
    process.env.WORDPIX_STAGING_USER_B_EMAIL,
    process.env.WORDPIX_STAGING_USER_B_PASSWORD,
    "User B"
  );
  if (userA === userB) throw new Error("The staging security check requires two distinct users.");

  await assertOwnProfileVisible(clientA, userA, "User A");
  await assertOwnProfileVisible(clientB, userB, "User B");
  await assertOtherProfileHidden(clientA, userB, "User A");
  await assertOtherProfileHidden(clientB, userA, "User B");

  const refreshedA = await clientA.auth.refreshSession();
  const refreshedB = await clientB.auth.refreshSession();
  if (
    refreshedA.error ||
    !refreshedA.data.session ||
    refreshedB.error ||
    !refreshedB.data.session
  ) {
    throw new Error("A dedicated staging account could not refresh its session.");
  }

  // The RPC checks expected_user before it reads or writes learner data. A
  // mismatched identity must be rejected without creating a migration receipt.
  const mismatchedMigration = await clientA.rpc("merge_guest_progress", {
    migration_id: crypto.randomUUID(),
    expected_user: userB,
    guest_state: {},
  });
  if (!mismatchedMigration.error) {
    throw new Error("The guest migration RPC accepted a different account identity.");
  }

  console.log(
    "Staging auth verification passed: session refresh, two-user isolation, and RPC identity."
  );
} finally {
  await Promise.allSettled([clientA.auth.signOut(), clientB.auth.signOut()]);
}
