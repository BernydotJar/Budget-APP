# 003-transactions-evidence-first-ux-refinement Requirements

Feature: Transactions Evidence-First UX Refinement
Codename: Clear Ledger
Mode: SHIP
Status: spec_ready

## Problem

The Transactions screen currently has a minimal page header, a primary action, a placeholder comment for future filters, and a basic table. The current implementation makes the transaction data usable, but it does not yet provide strong visual hierarchy, explicit empty-state guidance, clear filtering affordances, or the same evidence-first presentation style established in the refined dashboard.

Evidence from current repo:

- `src/app/transactions/page.tsx` renders a simple `Transactions` heading and `Add Transaction` action.
- The page contains a placeholder comment: `Add filtering options here later`.
- `src/components/transactions/transaction-list.tsx` renders a table with Date, Category, Description, Type, Amount, and Actions.
- Empty state is currently a single table row: `No transactions found.`
- Error state exists, but uses generic developer-style language.
- Skeleton mirrors the table, but does not include page-level hierarchy or filter affordances.

## Goal

Improve the Transactions screen so it is clearer, more modern, and more useful while preserving current transaction behavior.

The screen should make it easier for a user to understand:

- what data is being shown,
- whether there are no transactions yet,
- what actions are available,
- how transaction type and amount should be interpreted,
- and how the screen relates visually to the refined Dashboard.

## Scope

Allowed after approval:

- Refine `src/app/transactions/page.tsx` page hierarchy.
- Refine `src/components/transactions/transaction-list.tsx` presentation, empty state, error state, table readability, and action placement.
- Refine `src/components/transactions/transaction-list-skeleton.tsx` so loading state matches the updated layout.
- Add client-side visual affordances for filters only if implemented without changing Firestore query semantics.
- Use existing UI components and existing dependencies only.

## Non-goals

- Do not change Firestore schema.
- Do not change transaction creation/edit/delete business logic.
- Do not add package dependencies.
- Do not change auth behavior.
- Do not change Firebase configuration.
- Do not introduce AI, Genkit, or LLM behavior.
- Do not implement server-side search or new indexed Firestore queries in this feature.
- Do not change the transaction form.

## Acceptance Criteria

1. Transactions page has a clearer header, short explanatory copy, and primary action placement consistent with the dashboard refinement.
2. Empty state is explicit and useful, not just `No transactions found.`
3. Error state is user-facing and evidence-first: if data cannot be verified, the UI says that clearly.
4. Table/list presentation is more legible, with clearer type and amount treatment.
5. Filters or filter affordances are visibly clearer if added, but must not alter backend query semantics without explicit approval.
6. Skeleton/loading state remains consistent with the final rendered layout.
7. Existing edit/delete behavior is preserved.
8. No package/env/Firebase/auth/schema/AI files are changed.
9. Local validation passes:

```bash
npm run typecheck
npm run build
```

## Approval Gate

Implementation may start only after this explicit approval:

```txt
Approved: 003-transactions-evidence-first-ux-refinement for implementation in SHIP mode.
```
