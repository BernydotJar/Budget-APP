# 012 Google First-Run Seed Parity Tasks

Feature: 012-google-first-run-seed-parity-evidence-first-refinement
Codename: Orbit Seed
Mode: SHIP
Status: spec_ready

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

Required approval:

Approved: 012-google-first-run-seed-parity-evidence-first-refinement for implementation in SHIP mode.

## Implementation tasks after approval

- [ ] Detect new Google Sign-In users.
- [ ] Seed starter data for new Google Sign-In users.
- [ ] Avoid seeding existing Google users again.
- [ ] Preserve email/password login behavior.
- [ ] Preserve email/password sign-up seed behavior.
- [ ] Preserve Google popup sign-in behavior.
- [ ] Preserve redirect to `/dashboard`.
- [ ] Preserve Firestore collection targets.
- [ ] Add static verification for Google first-run seed parity.

## Review tasks

- [ ] Run node scripts/verify-012-google-seed-parity.js if added.
- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
