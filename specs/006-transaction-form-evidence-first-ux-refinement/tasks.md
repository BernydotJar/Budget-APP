# 006 Transaction Form UX Tasks

Feature: 006-transaction-form-evidence-first-ux-refinement
Codename: Entry Ledger
Mode: SHIP
Status: spec_ready

## Spec gate

- [x] Verify main contains 005 merge.
- [x] Inspect new transaction page.
- [x] Inspect edit transaction page.
- [x] Inspect transaction form.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Approval gate

Required approval:

Approved: 006-transaction-form-evidence-first-ux-refinement for implementation in SHIP mode.

## Implementation tasks after approval

- [ ] Update new/edit transaction page wrappers if needed.
- [ ] Improve transaction form hierarchy.
- [ ] Add evidence framing for downstream impact.
- [ ] Improve loading state.
- [ ] Improve error state.
- [ ] Improve helper copy for form fields.
- [ ] Preserve existing fetch, save, redirect, toast, and invalidation behavior.

## Review tasks

- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
