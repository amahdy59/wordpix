# WordPix staging and device validation runbook

**Prepared:** 2026-09-27  
**Purpose:** Collect the live-account and physical-device evidence that local automation cannot establish.  
**Safety:** Use a dedicated staging Supabase project and synthetic adult learner accounts only. Never use production credentials or learner data.

## 1. Apply and review the RLS hardening migration

Apply `supabase/migrations/03_rls_hardening.sql` to staging after migrations 01 and 02. Confirm that:

- every exposed learner table has RLS enabled;
- profile and word-memory updates use both `USING` and `WITH CHECK` ownership rules;
- migration receipts allow authenticated `SELECT` and `INSERT` only;
- `handle_new_user()` has an empty search path and cannot be called directly by client roles;
- `merge_guest_progress` remains executable only by authenticated users.

Do not apply this migration to production until it has passed the staging checks below and received database/security review.

## 2. Configure the protected staging workflow

Create a protected GitHub environment named `staging`. Add these environment secrets:

- `WORDPIX_STAGING_SUPABASE_URL`
- `WORDPIX_STAGING_SUPABASE_ANON_KEY`
- `WORDPIX_STAGING_USER_A_EMAIL`
- `WORDPIX_STAGING_USER_A_PASSWORD`
- `WORDPIX_STAGING_USER_B_EMAIL`
- `WORDPIX_STAGING_USER_B_PASSWORD`

The two users must be distinct synthetic accounts with auto-created profile rows. Do not use a service-role key. Run the manually triggered **Staging authentication and RLS verification** workflow. It validates session refresh, each account's access to its own profile, denial of cross-account profile reads, and rejection of a guest-migration request whose expected user does not match the authenticated user.

Record the workflow URL, staging schema version, browser/app build commit, and result in the release ticket. Never paste credentials or tokens into the ticket.

## 3. Authenticated synchronization scenarios

Run with synthetic data in both English and Arabic:

| Scenario                                            | Expected result                                                                        | Evidence                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------ |
| Complete a lesson offline, close, reopen, reconnect | Local completion remains visible; one queued operation is replayed exactly once        | Before/after queue count and server row ID |
| Expire the session before replay                    | Local work remains; sync pauses; reauthentication allows retry                         | Screen recording plus queue state          |
| Interrupt guest migration after request dispatch    | Migration receipt is reused; no duplicate XP/session rows                              | Receipt ID and database row counts         |
| Reject one queued payload at the server boundary    | The operation remains locally preserved and is classified; newer safe work is not lost | Sanitized error category and queue state   |
| Edit a preference on two devices                    | The documented preference conflict policy is applied consistently                      | Both timestamps/device IDs and final value |
| Attempt User A access to User B rows                | Zero rows are returned and writes are denied by RLS                                    | Sanitized test output                      |

No scenario passes if it relies only on a hidden button, client-side user ID, or UI message. Authorization evidence must come from the staging database boundary.

## 4. Assistive-technology and device matrix

For every row, test Home → Learn → one lesson → Practice → Settings → Profile/authentication → offline notice → sync recovery. Repeat a representative flow in Arabic RTL.

| Platform | Browser / AT                    | Required checks                                                               | Result      |
| -------- | ------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| Windows  | Current Chrome + NVDA           | landmarks, headings, names, status announcements, dialog focus, reading order | Not yet run |
| Windows  | Current Firefox + NVDA          | same critical flow; virtual cursor and forms mode                             | Not yet run |
| macOS    | Safari + VoiceOver              | rotor landmarks/headings, dialogs, route/status announcements                 | Not yet run |
| iOS      | Safari + VoiceOver              | swipe order, touch targets, bottom navigation, orientation                    | Not yet run |
| Android  | Chrome + TalkBack               | swipe order, actions, live regions, text scaling                              | Not yet run |
| Windows  | Chrome/Firefox at 200% and 400% | reflow, focus visibility, no obscured action, no two-dimensional scroll       | Not yet run |
| Windows  | High Contrast Mode              | text, controls, selected states, focus, errors                                | Not yet run |

For each run, record OS, browser and AT versions, locale/theme, input method, pass/fail, issue link, and evidence. Automated axe, viewport emulation, and forced-colors emulation are supporting evidence only and must not be recorded as physical-device passes.

## Exit criteria

- Staging workflow passes with two distinct users.
- All high-risk sync scenarios preserve local progress and prevent duplicate/cross-user writes.
- No critical AT blocker remains in the representative English/Arabic flows.
- Native 200%/400% zoom and Windows High Contrast Mode pass on target devices.
- The WCAG criterion table and release decision are updated from recorded evidence.
