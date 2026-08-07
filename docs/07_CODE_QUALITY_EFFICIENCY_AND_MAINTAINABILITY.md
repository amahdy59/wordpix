---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Code Quality, Efficiency, and Maintainability

## Quality policy

Code is complete when it is understandable, testable, observable, secure, accessible, and appropriately efficient—not merely when it renders the expected screenshot.

## TypeScript baseline

Enable strict checking and progressively adopt:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "isolatedModules": true
  }
}
```

Adjust only for repository compatibility. Do not weaken global strictness to solve a local issue.

Rules:

- Avoid `any`; use `unknown` and narrow.
- Avoid broad type assertions.
- Use discriminated unions for state and result types.
- Make illegal states difficult to represent.
- Validate runtime data.
- Exhaustively handle domain enums and unions.
- Do not use non-null assertions to hide lifecycle uncertainty.

## Linting and formatting

- Use ESLint with type-aware rules for TypeScript where practical.
- Keep formatting automated.
- Run lint and type-check separately.
- Treat unused suppressions as failures.
- Require a reason and narrow scope for every suppression.
- Do not encode subjective style rules that fight the formatter.
- Keep CI and editor configuration aligned.

## Naming

Names should reveal purpose and domain meaning.

Prefer:

- `pendingSyncCount`
- `getNextReviewRecommendation`
- `LessonCompletionSummary`
- `isNarrationEnabled`

Avoid:

- `data`
- `handleThing`
- `temp`
- `utils2`
- `CardNew`
- `isFlag`

Booleans should read as questions. Functions should use verbs. Components and types should use nouns.

## Functions and modules

- Keep functions focused on one level of abstraction.
- Separate pure calculation from I/O.
- Prefer explicit inputs and outputs over hidden global state.
- Return typed result objects for expected failures.
- Throw only for exceptional or boundary-level failures.
- Avoid long parameter lists; use a typed parameter object when the arguments form a concept.
- Keep side effects near system boundaries.

## React-specific quality rules

- Do not store values that can be derived during render.
- Use effects only to synchronize with external systems.
- Keep event logic in event handlers.
- Use stable keys based on identity.
- Never mutate state directly.
- Avoid premature memoization.
- Measure before adding `memo`, `useMemo`, or `useCallback`.
- Do not create global state for convenience.
- Avoid “god hooks” that combine unrelated concerns.

## Complexity

Review or split code when:

- branching obscures the main path;
- one function coordinates several external systems;
- nested conditionals are difficult to test;
- a component has many interacting booleans;
- adding a state requires editing many unrelated locations.

Prefer:

- early returns;
- typed state machines or reducers;
- tables/maps for stable rule sets;
- pure helpers;
- domain-specific functions.

Do not chase a numeric complexity score at the expense of clarity.

## Duplication

Remove duplication when it represents the same concept and is likely to change together. Keep similar code separate when the behavior only looks alike but belongs to different domains.

Before creating an abstraction, identify:

- stable shared behavior;
- variation points;
- accessibility differences;
- domain ownership;
- test contract.

Avoid speculative generic components with dozens of props.

## Comments and documentation

Write comments for:

- why a non-obvious decision exists;
- constraints from accessibility, browsers, or bidi behavior;
- risk around data migration or sync;
- invariants;
- external-system quirks;
- deliberate trade-offs.

Do not comment obvious syntax. Keep decision records for cross-cutting choices.

## Dependency policy

Before adding a package:

- Confirm existing platform or framework capability is insufficient.
- Check maintenance, security, bundle impact, accessibility, and license.
- Prefer focused packages over broad frameworks.
- Avoid two packages solving the same problem.
- Pin through the lockfile.
- Add a removal or ownership note for critical dependencies.
- Do not add a package only to avoid writing a small, well-tested function.

## Efficiency

Optimize in this order:

1. Correct architecture and data flow.
2. Remove unnecessary work and requests.
3. Reduce shipped code and assets.
4. Use caching with explicit invalidation.
5. Measure real-user behavior.
6. Optimize confirmed bottlenecks.

Do not trade readability or correctness for micro-optimizations without measurement.

## Pull-request checklist

- [ ] Scope matches the task.
- [ ] No unrelated refactor.
- [ ] Types are strict.
- [ ] Runtime boundaries are validated.
- [ ] No new duplicate abstraction.
- [ ] State ownership is clear.
- [ ] Accessibility and RTL behavior are preserved.
- [ ] Tests cover behavior and failure.
- [ ] No secret or personal data in code or logs.
- [ ] Performance impact is understood.
- [ ] Documentation and changelog are updated.
- [ ] Build, lint, type-check, and tests pass.

## References

- [TypeScript TSConfig reference](https://www.typescriptlang.org/tsconfig/)
- [TypeScript 5.9 recommended stricter options](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [typescript-eslint typed linting](https://typescript-eslint.io/getting-started/typed-linting/)
- [typescript-eslint shared configurations](https://typescript-eslint.io/users/configs/)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Semantic Versioning](https://semver.org/)
