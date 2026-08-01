# 012 Google First-Run Seed Parity Tasks

Feature: 012-google-first-run-seed-parity-evidence-first-refinement
Codename: Orbit Seed
Mode: SHIP
Status: done

## Spec gate

- [x] Verify main contains 011 merge.
- [x] Inspect current feature registry.
- [x] Inspect current progress state.
- [x] Inspect email/password starter data path.
- [x] Inspect Google Sign-In path.
- [x] Identify Google first-run seed parity gap.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Approval gate

- [x] Implementation approved in SHIP mode through Graph Harness SDLC continuous execution instruction.

## Implementation tasks after approval

- [x] Detect new Google Sign-In users.
- [x] Seed starter data for new Google Sign-In users.
- [x] Avoid seeding existing Google users again.
- [x] Preserve email/password login behavior.
- [x] Preserve email/password sign-up seed behavior.
- [x] Preserve Google popup sign-in behavior.
- [x] Preserve redirect to `/dashboard`.
- [x] Preserve Firestore collection targets.
- [x] Add static verification for Google first-run seed parity.

## Review tasks

- [x] Run node scripts/verify-012-google-seed-parity.js.
- [x] Run node scripts/verify-011-sample-data-integrity.js.
- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.
