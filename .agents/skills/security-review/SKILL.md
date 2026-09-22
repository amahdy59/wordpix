---
name: security-review
description: DevSecOps and application security review for WordPix — OWASP ASVS L2, secret hygiene, Supabase RLS, PII rules.
metadata:
  category: security
  upstream: global security-review
---

# Security Review (WordPix)

Use before publishing code, touching auth/persistence/sync, or reviewing sensitive modules.

## 1. Secret Hygiene (zero-leak tolerance)

- Never hardcode keys, tokens, passwords, or private keys. `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`, `credentials.json` are git-ignored and OpenCode-deny-listed (`opencode.jsonc` permissions).
- Secrets reach MCP/processes only via `{env:NAME}` substitution — never pasted into config or prompts.
- Run a secret scan (e.g. Gitleaks) before any commit that touches config, scripts, or CI.

## 2. OWASP Checks (ASVS Level 2 baseline)

- Injection: parameterized queries only; sanitize shell args; Zod-validate every network/persistence payload.
- XSS: no `dangerouslySetInnerHTML` without DOMPurify; validate external HTML.
- Access control: verify auth + role checks on every Supabase endpoint; confirm RLS policies deny-by-default.
- Crypto: HTTPS only; `crypto.randomUUID()` for IDs; bcrypt/argon2id server-side for passwords.
- Dependencies: `pnpm audit` regularly; triage high/critical CVEs before merge.

## 3. WordPix Privacy Rules

- No raw learner text, emails, or voice data in logs, analytics events, or error reports (`docs/11_ANALYTICS_OBSERVABILITY_AND_ERROR_HANDLING.md`).
- Offline stores (IndexedDB) hold learner progress — guest migration must not leak one profile into another.
- Arabic/English copy via i18n only; never log full locale payloads.

## References

- `docs/09_SECURITY_PRIVACY_AUTHENTICATION_AND_AUTHORIZATION.md`
- `docs/11_ANALYTICS_OBSERVABILITY_AND_ERROR_HANDLING.md`
- `.agents/skills/verify/SKILL.md`
