---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Security, Privacy, Authentication, and Authorization

## Security baseline

Use OWASP ASVS Level 2 as the practical verification baseline for authenticated application features, adjusted to the actual risk model.

Security controls must be enforced at the trusted server or database boundary. Client-side checks are user experience, not authorization.

## Threat model

At minimum, consider:

- account takeover;
- insecure direct object reference;
- broken row-level authorization;
- token leakage;
- cross-site scripting;
- cross-site request forgery;
- malicious or malformed lesson content;
- replayed or duplicate sync operations;
- unauthorized child-data access;
- data exposure in analytics or logs;
- dependency compromise;
- offline-device loss;
- unsafe admin functions.

Record trust boundaries and sensitive data flows before implementing auth or sync.

## Data classification

Classify fields as:

- public;
- internal;
- account data;
- learner progress;
- child-related data;
- authentication secret;
- operational telemetry;
- highly sensitive or prohibited.

Collect the minimum data required. Define retention and deletion behavior. Avoid storing full birth dates when an age band is sufficient.

## Authentication

- Use a vetted provider or framework.
- Support secure email verification and password recovery if email/password exists.
- Use OAuth/OIDC with state and PKCE where applicable.
- Do not reveal whether an account exists through inconsistent messages.
- Rate-limit sensitive endpoints.
- Reauthenticate for high-impact account changes.
- Rotate and revoke sessions.
- Provide a clear sign-out path on shared devices.
- Do not implement custom cryptography or password storage.

## Session management

- Prefer secure, `HttpOnly`, `Secure`, appropriately scoped cookies when the architecture supports them.
- Apply suitable `SameSite` behavior.
- Protect against CSRF when cookies authenticate state-changing requests.
- Regenerate session identifiers after authentication or privilege change.
- Expire idle and absolute sessions according to risk.
- Do not place long-lived tokens in URLs.
- Redact tokens from logs.

## Authorization and Supabase RLS

When using Supabase:

- Enable Row Level Security on every exposed table.
- Write separate policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Restrict by authenticated user and ownership or explicit role.
- Use `WITH CHECK` for writes.
- Test policies with multiple users and anonymous sessions.
- Never expose the service-role key to a client.
- Index columns used in RLS policies.
- Apply least privilege to storage buckets and functions.
- Keep privileged operations in trusted server functions.

A hidden button is not an access-control policy.

## Input and output

- Validate all external input on the server.
- Constrain type, length, range, format, and allowed values.
- Normalize only when the domain defines equivalence.
- Encode output according to its context.
- Avoid rendering untrusted HTML.
- Sanitize rich content with a maintained allowlist-based sanitizer when rich HTML is necessary.
- Parameterize database queries.
- Validate uploaded file type, size, and content; store outside executable paths.

## Web security controls

Review:

- Content Security Policy.
- `frame-ancestors` or equivalent anti-clickjacking protection.
- `X-Content-Type-Options`.
- Referrer policy.
- Permissions policy.
- HTTPS and HSTS.
- CORS with explicit allowed origins.
- Secure cache headers for personal data.
- Subresource integrity where appropriate.

Use framework defaults when strong, but verify them.

## Secrets and environments

- Store deployment-specific configuration in environment or secret management.
- Keep `.env` files out of version control.
- Separate development, preview, staging, and production credentials.
- Use least-privilege keys.
- Rotate leaked or stale keys.
- Never paste production secrets into agent prompts.
- Prevent coding agents from discovering unrelated production credentials.
- Use separate databases or projects for local, test, staging, and production.

## Privacy

- Explain what data is collected and why.
- Default to privacy-preserving settings.
- Require consent where applicable.
- Keep analytics separate from essential learning persistence.
- Avoid advertising identifiers and cross-service profiling.
- Do not send lesson answers, free text, email, name, or child identifiers to analytics.
- Support access, correction, export, and deletion requirements according to applicable law and policy.
- Define parent/guardian and child account behavior before launch.
- Obtain legal review for child privacy obligations in target markets.

## Logging

Never log:

- passwords;
- access or refresh tokens;
- full session cookies;
- service-role keys;
- full learner answers or free text;
- unnecessary names, emails, or child identifiers;
- database connection strings.

Use pseudonymous IDs and correlation IDs. Apply retention and access controls.

## Security test checklist

- [ ] Anonymous access matrix.
- [ ] User A cannot read or change User B data.
- [ ] Child/guardian/teacher/admin role boundaries.
- [ ] RLS tests.
- [ ] CSRF behavior.
- [ ] XSS and unsafe content.
- [ ] Session fixation and logout.
- [ ] Password reset and account enumeration.
- [ ] Rate limiting.
- [ ] Duplicate and replayed sync mutation.
- [ ] File upload validation.
- [ ] Secret scanning.
- [ ] Dependency audit.
- [ ] Security headers.
- [ ] Error messages do not leak internals.
- [ ] Backup and restore exercise.

## Release blockers

- Client-exposed service-role or private secret.
- Missing RLS on exposed personal-data table.
- Cross-user data access.
- Stored or reflected XSS.
- Authentication bypass.
- Destructive operation without authorization.
- Sensitive data in analytics or logs.
- Inability to revoke sessions after compromise.
- Untested migration affecting personal data.

## References

- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP HTTP Security Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase securing your data](https://supabase.com/docs/guides/database/secure-data)
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [NIST guidance on minimizing PII](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-122.pdf)
