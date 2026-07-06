# 011 First-Run Sample Data Integrity Tasks

Feature: 011-first-run-sample-data-integrity-evidence-first-refinement
Codename: Seed Vault
Mode: SHIP
Status: done

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

- [x] Implementation approved in SHIP mode.

## Implementation tasks after approval

- [x] Fix starter category-description mapping consistency.
- [x] Preserve category writes to Firestore.
- [x] Preserve transaction writes to Firestore.
- [x] Preserve email/password auth behavior.
- [x] Preserve Google sign-in behavior.
- [x] Preserve sign-up redirect behavior.
- [x] Add static verification for sample-data mapping integrity.

## Review tasks

- [x] Run node scripts/verify-011-sample-data-integrity.js.
- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.
