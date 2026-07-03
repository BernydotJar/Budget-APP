# 003-transactions-evidence-first-ux-refinement Design

Feature: Transactions Evidence-First UX Refinement
Codename: Clear Ledger
Mode: SHIP
Status: spec_ready

## Current UI Evidence

Current page composition:

- `src/app/transactions/page.tsx`
  - `AuthGuard`
  - page heading `Transactions`
  - `Add Transaction` button
  - placeholder comment for filters
  - `Suspense` wrapping `TransactionList`

Current list composition:

- `src/components/transactions/transaction-list.tsx`
  - Firestore query for all user transactions ordered by `date desc`
  - category lookup by user
  - table columns: Date, Category, Description, Type, Amount, Actions
  - empty state: one table row with `No transactions found.`
  - error state: destructive alert with generic copy
  - edit action routes to `/transactions/edit/${transactionId}`
  - delete action uses existing confirmation dialog and query invalidation

Current skeleton:

- `src/components/transactions/transaction-list-skeleton.tsx`
  - table skeleton only

## UX Direction

The Transactions screen should follow the same pattern established in the dashboard refinement:

- page-level card/header with product context,
- explicit evidence framing,
- consistent spacing and hierarchy,
- clear empty/error states,
- readable data presentation,
- action placement that makes the primary user path obvious.

## Proposed Layout

### Page Header

Use a compact header section that includes:

- `BudgetFlow`
- `Transactions`
- short description: recorded income and expenses, ordered by newest first
- primary action: `Add Transaction`

The button should stay visible in the page header and remain the dominant action.

### Filter Affordance

Add a non-invasive filter/status area only if it can be implemented safely without changing Firestore query semantics. Preferred SHIP-safe approach:

- visual summary row showing current scope: `All transactions`, `Newest first`, `Income and expenses`.
- optional client-side type chips if implemented only against already-fetched transactions.

No new Firestore indexes or server query changes in this feature.

### Transaction List

Improve table readability by:

- keeping existing columns,
- improving table caption/copy,
- making type labels clearer,
- making positive/negative amount treatment visually obvious,
- keeping actions grouped and accessible,
- preserving edit/delete behavior exactly.

### Empty State

Replace the bare table row copy with an explicit empty state:

- title: `No transactions recorded yet`
- description: explain that the ledger has no income or expense evidence to show
- action: link to add a transaction

### Error State

Use user-facing evidence-first language:

- title: `Transaction evidence unavailable`
- description: explain the app could not verify transaction data and therefore will not show stale or guessed ledger data

### Skeleton

Align skeleton with the final list presentation:

- table/card shell remains stable,
- loading caption should match the updated language,
- row skeletons remain acceptable.

## Runtime Scope After Approval

Expected runtime files:

- `src/app/transactions/page.tsx`
- `src/components/transactions/transaction-list.tsx`
- `src/components/transactions/transaction-list-skeleton.tsx`

## Constraints

Do not touch:

- package files
- env/secrets
- Firebase configuration
- auth behavior
- Firestore schema or migrations
- AI/Genkit runtime
- transaction form behavior

## Validation

Run locally after implementation:

```bash
npm run typecheck
npm run build
```

Expected result: both pass.
