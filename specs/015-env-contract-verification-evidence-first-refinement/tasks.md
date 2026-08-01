# 015 Environment Contract Verification Tasks

Feature: 015-env-contract-verification-evidence-first-refinement
Codename: Config Beacon
Mode: SHIP
Status: done

## Spec gate

- [x] Verify main contains 014 merge.
- [x] Inspect Firebase env usage.
- [x] Identify missing committed env contract.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Implementation tasks

- [x] Add .env.example with placeholder Firebase public keys.
- [x] Document `.env.local` setup in README.md.
- [x] Add static verifier for env contract.
- [x] Preserve app behavior and package dependencies.

## Review tasks

- [x] Run node scripts/verify-015-env-contract.js.
- [x] Run existing static verifiers.
- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.
