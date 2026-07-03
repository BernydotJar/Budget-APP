# 006 Transaction Form UX Requirements

Feature: 006-transaction-form-evidence-first-ux-refinement
Codename: Entry Ledger
Mode: SHIP
Status: spec_ready

## Goal

Refine the add/edit Transaction form so it matches the evidence-first UX now used by Dashboard, Transactions, Reports, and Categories.

## Current evidence

- `src/app/transactions/new/page.tsx` renders `TransactionForm` directly inside `AuthGuard`.
- `src/app/transactions/edit/[id]/page.tsx` renders `TransactionForm` with a transaction id and already uses Next.js 15 async params typing.
- `src/components/transactions/transaction-form.tsx` owns form state, category loading, edit transaction loading, mutation, toast, and redirect behavior.
- The current form works, but layout/copy are still basic and loading/error states are not aligned with the evidence-first app pattern.

## Runtime scope after approval

- `src/app/transactions/new/page.tsx`
- `src/app/transactions/edit/[id]/page.tsx`
- `src/components/transactions/transaction-form.tsx`

## Constraints

- No package changes.
- No environment or secret changes.
- No Firebase config changes.
- No schema changes.
- No Firestore query semantic changes.
- No transaction mutation behavior changes.
- No auth changes.
- Preserve existing add/edit redirect behavior.
- Preserve existing query invalidation behavior.

## Acceptance criteria

- New and edit transaction pages have clearer hierarchy.
- Form explains what the transaction data will affect.
- Loading state is aligned with the rendered layout.
- Error state uses user-facing evidence-first language.
- Form sections are easier to scan.
- Helper copy clarifies date, amount, type, category, account, and description.
- Existing add/edit behavior is preserved.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 006-transaction-form-evidence-first-ux-refinement for implementation in SHIP mode.
```
