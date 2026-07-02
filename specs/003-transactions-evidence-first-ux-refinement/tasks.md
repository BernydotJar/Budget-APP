# 003-transactions-evidence-first-ux-refinement Tasks

Feature: Transactions Evidence-First UX Refinement
Codename: Clear Ledger
Mode: SHIP
Status: spec_ready

## Spec gate

- [x] Inspect current `src/app/transactions/page.tsx`.
- [x] Inspect current `src/components/transactions/transaction-list.tsx`.
- [x] Inspect current `src/components/transactions/transaction-list-skeleton.tsx`.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.
- [x] Create tasks.md.
- [ ] Update progress/current.md.
- [ ] Append progress/history.md.

## Approval gate

Required approval phrase before implementation:

```txt
Approved: 003-transactions-evidence-first-ux-refinement for implementation in SHIP mode.
```

## Implementation tasks after approval

- [ ] Update `src/app/transactions/page.tsx` page header and primary action hierarchy.
- [ ] Update `src/components/transactions/transaction-list.tsx` empty state.
- [ ] Update `src/components/transactions/transaction-list.tsx` error state.
- [ ] Improve table/list readability without changing transaction query semantics.
- [ ] Preserve edit route behavior.
- [ ] Preserve delete confirmation and mutation behavior.
- [ ] Update `src/components/transactions/transaction-list-skeleton.tsx` to match final layout.

## Review tasks after implementation

- [ ] Verify changed runtime files are inside approved scope.
- [ ] Verify no package/env/Firebase/auth/schema/AI files changed.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Capture review evidence.
- [ ] Move feature to done only after validation passes.
