# 011 First-Run Sample Data Integrity Tasks

Feature: 011-first-run-sample-data-integrity-evidence-first-refinement
Codename: Seed Vault
Mode: SHIP
Status: spec_ready

## Spec gate

- [x] Verify main contains 010 merge.
- [x] Inspect current feature registry.
- [x] Inspect current progress state.
- [x] Inspect sign-up sample data path.
- [x] Identify category-description mapping risk.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Approval gate

Required approval:

Approved: 011-first-run-sample-data-integrity-evidence-first-refinement for implementation in SHIP mode.

## Implementation tasks after approval

- [ ] Fix starter category-description mapping consistency.
- [ ] Preserve category writes to Firestore.
- [ ] Preserve transaction writes to Firestore.
- [ ] Preserve email/password auth behavior.
- [ ] Preserve Google sign-in behavior.
- [ ] Preserve sign-up redirect behavior.
- [ ] Add static verification for sample-data mapping integrity.

## Review tasks

- [ ] Run node scripts/verify-011-sample-data-integrity.js if added.
- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
