# 006 Transaction Form UX Tasks

Feature: 006-transaction-form-evidence-first-ux-refinement
Codename: Entry Ledger
Mode: SHIP
Status: done

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

- [x] Update new/edit transaction page wrappers if needed.
- [x] Improve transaction form hierarchy.
- [x] Add evidence framing for downstream impact.
- [x] Improve loading state.
- [x] Improve error state.
- [x] Improve helper copy for form fields.
- [x] Preserve existing fetch, save, redirect, toast, and invalidation behavior.

## Review tasks

- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.
