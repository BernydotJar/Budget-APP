# 006 Transaction Form UX Design

Feature: 006-transaction-form-evidence-first-ux-refinement
Codename: Entry Ledger
Mode: SHIP
Status: spec_ready

## Proposed layout

1. Page wrapper for new/edit transaction pages with a consistent max-width and spacing.
2. Transaction form header card with mode-aware title, explanation, and return context.
3. Evidence summary row explaining record type, downstream impact, and save behavior.
4. Form card split into clear sections:
   - Core details: date, amount, type, category.
   - Optional context: account and description.
5. Loading skeleton aligned to header, evidence cards, and form sections.
6. Error state that explains what failed and that no data was changed.
7. Submit row with clear primary action and mutation feedback.

## Runtime scope after approval

- src/app/transactions/new/page.tsx
- src/app/transactions/edit/[id]/page.tsx
- src/components/transactions/transaction-form.tsx

## Data behavior

Do not change transaction fetching, creation, update, redirect, toast, or query invalidation semantics in this feature.

## Validation

- rm -rf .next && npm run typecheck && npm run build
