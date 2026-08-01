# 014 Transitive Critical Dependency Remediation Requirements

Feature: 014-transitive-critical-dependency-remediation-evidence-first-refinement
Codename: Dependency Quarantine
Mode: SHIP
Status: spec_ready

## Goal

Remediate the residual non-Next critical npm audit findings left after 013 by updating the Genkit/Firebase-related dependency chains using non-major package versions where possible.

## Current evidence

After 013, `npm audit --audit-level=critical` no longer reports `next`, but still reports critical packages:

- form-data
- handlebars
- protobufjs
- websocket-driver

`npm outdated` shows non-major updates available for the likely source packages:

- firebase: 11.4.0 -> 11.10.0 wanted
- @tanstack-query-firebase/react: 1.0.6 -> 1.0.7 wanted
- genkit: 1.6.2 -> 1.40.1 wanted
- genkit-cli: 1.6.1 -> 1.40.1 wanted
- @genkit-ai/googleai: 1.6.2 -> 1.28.0 wanted
- @genkit-ai/next: 1.6.2 -> 1.40.1 wanted

## Runtime scope

- package.json
- package-lock.json

## Constraints

- No app route changes.
- No UI changes.
- No Firebase config changes.
- No Firestore schema changes.
- No auth behavior changes.
- No source behavior changes unless required by typecheck after dependency updates.
- Do not use `npm audit fix --force`.
- Prefer non-major dependency updates.

## Acceptance criteria

- Residual critical findings are removed or reduced.
- Existing static verifiers pass.
- TypeScript check passes.
- Production build passes.
- Any remaining audit risk is documented precisely.
