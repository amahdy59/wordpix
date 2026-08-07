---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# CI/CD, Release Gates, and Definition of Done

## Principle

The default branch should remain releasable. Automation should prevent known classes of regressions rather than merely report them after release.

## Environments

Maintain separate:

- local;
- test/CI;
- preview;
- staging;
- production.

Keep staging and production structurally similar while using separate credentials, data, and access controls.

Never let preview or agent environments share production write credentials.

## Branch and review policy

- Protect the default branch.
- Require pull requests.
- Require current status checks.
- Require review for security, schema, auth, design-system, and accessibility changes.
- Prevent force-push and deletion on protected branches.
- Use CODEOWNERS or equivalent for sensitive areas.
- Keep changes small enough to review.
- Use feature flags for incomplete or risky behavior, but do not leave stale flags indefinitely.

## CI pipeline

Recommended order:

```text
install with lockfile
→ format check
→ lint
→ type check
→ unit/integration tests
→ component accessibility tests
→ build
→ E2E smoke
→ security/dependency checks
→ bundle/performance budget
→ artifact/report upload
```

Run database migration and RLS tests when relevant.

Use dependency caching carefully, but never bypass lockfile integrity.

## Required checks

At minimum:

- Formatting.
- ESLint.
- TypeScript.
- Unit/integration.
- Accessibility automation.
- Production build.
- Critical E2E.
- Secret scan.
- Dependency vulnerability check.
- Migration validation.
- Bundle budget.

A skipped required workflow must not leave the branch in an ambiguous merge state.

## Deployment

- Build once and promote the same artifact where possible.
- Separate build and runtime configuration.
- Use deployment environments with protected secrets.
- Limit deployment concurrency.
- Require approval for production until the process is mature.
- Record release version and commit.
- Run smoke tests after deployment.
- Roll back when health gates fail.
- Do not run irreversible migrations before the compatible application version is ready.

## Database release pattern

Use expand-and-contract:

1. Add backward-compatible schema.
2. Deploy code that can use old and new forms.
3. Backfill safely.
4. Verify.
5. Switch reads/writes.
6. Remove old schema in a later release.

Migrations must be reviewed, idempotent where practical, and tested on representative data.

## Feature flags

Every flag needs:

- owner;
- purpose;
- default;
- environments;
- exposure rule;
- analytics need;
- removal date;
- cleanup issue.

Do not use client-only flags to protect privileged behavior.

## Release readiness gates

### Product

- Critical flows complete.
- No unresolved critical usability issue.
- Scope matches approval.

### Accessibility

- Automated checks pass.
- Keyboard critical paths pass.
- Screen-reader representative paths pass.
- Arabic/bidi math pass.
- 200% text and reduced motion pass.

### Engineering

- Required CI checks pass.
- Migrations verified.
- Performance budget passes.
- Offline and sync recovery tested.
- Error monitoring and rollback are ready.

### Security and privacy

- Authorization tests pass.
- RLS policies reviewed.
- Secrets and headers checked.
- Analytics and logs reviewed for personal data.
- Legal/privacy review complete where required.

### Operations

- Dashboards and alerts active.
- Runbooks exist.
- Backup and restore tested.
- Support knows known limitations.
- Release notes are prepared.

## Definition of Done for a feature

- [ ] Acceptance criteria met.
- [ ] User-visible behavior implemented.
- [ ] Loading, empty, error, offline, and recovery states implemented.
- [ ] Child/adult behavior defined.
- [ ] English/Arabic behavior defined.
- [ ] Light/dark behavior defined.
- [ ] Keyboard and screen-reader behavior tested.
- [ ] Types and runtime validation added.
- [ ] Unit/integration tests added.
- [ ] E2E updated for critical flow.
- [ ] Analytics and observability added only where proportionate.
- [ ] Security and privacy reviewed.
- [ ] Performance impact checked.
- [ ] Documentation and changelog updated.
- [ ] CI passes.
- [ ] No unrelated code or generated noise.
- [ ] Known limitations explicitly recorded.

## Versioning and release notes

Use semantic versioning for public packages and design-system contracts.

Release notes should include:

- learner-visible changes;
- accessibility changes;
- localization changes;
- migration requirements;
- deprecated interfaces;
- known limitations;
- rollback considerations.

## Post-release validation

Immediately verify:

- authentication;
- core learner route;
- lesson completion;
- progress persistence;
- offline queue;
- synchronization;
- Arabic route;
- error reporting;
- Core Web Vitals sampling;
- no cross-user data exposure.

## References

- [GitHub Actions continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)
- [GitHub Actions continuous deployment](https://docs.github.com/en/actions/get-started/continuous-deployment)
- [GitHub deployment environments](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [The Twelve-Factor App](https://www.12factor.net/)
- [Semantic Versioning](https://semver.org/)
