# 009 Page Frame Consistency UX Design

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: spec_ready

## Proposed approach

Normalize the top-level frame of the primary authenticated pages without changing their data behavior.

## Target pages

- Dashboard
- Transactions
- Reports
- Categories

## Frame pattern

Each page should expose:

1. A consistent page container with the existing `flex flex-col gap-6` rhythm.
2. A consistent top page card/section surface.
3. A small product-area label.
4. A primary page title.
5. A concise purpose statement.
6. Evidence/scope cards where useful.
7. Existing CTA placement where applicable.

## Page-specific intent

- Dashboard: emphasize current month financial overview and transaction-backed totals.
- Transactions: emphasize saved ledger records and newest-first ordering.
- Reports: emphasize category reporting, current default period, and saved expense transaction scope.
- Categories: emphasize classification setup and impact on dashboard, transactions, and reports.

## Runtime scope after approval

- src/app/dashboard/page.tsx
- src/app/transactions/page.tsx
- src/app/reports/page.tsx
- src/app/categories/page.tsx

## Behavior preservation

Do not change imported child components, suspense boundaries, data queries, mutations, route destinations, or authentication guards.

## Validation

- rm -rf .next && npm run typecheck && npm run build
