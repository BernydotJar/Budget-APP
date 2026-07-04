# 009 Page Frame Consistency UX Requirements

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: spec_ready

## Goal

Normalize authenticated page framing across the main app pages so dashboard, transactions, reports, and categories present consistent hierarchy, scope copy, and evidence-first structure.

## Current evidence

- `src/app/dashboard/page.tsx` uses a custom bordered section header with BudgetFlow copy and dashboard scope.
- `src/app/transactions/page.tsx` uses a `Card` header with BudgetFlow copy, CTA, and three evidence cards.
- `src/app/reports/page.tsx` uses a `Card` header with BudgetFlow copy and three evidence cards.
- `src/app/categories/page.tsx` uses a custom bordered section header with category-management copy and an add-category CTA.
- The pages have individually improved UX, but the page frame patterns are not fully consistent.

## Runtime scope after approval

- `src/app/dashboard/page.tsx`
- `src/app/transactions/page.tsx`
- `src/app/reports/page.tsx`
- `src/app/categories/page.tsx`

## Constraints

- No package changes.
- No route changes.
- No data-fetching changes.
- No Firestore schema changes.
- No auth changes.
- No mutation behavior changes.
- Preserve all existing page-level child components and suspense boundaries.
- Preserve existing CTAs and destinations.
- Do not introduce a new shared component unless the change clearly reduces duplication without increasing runtime risk.

## Acceptance criteria

- Dashboard, Transactions, Reports, and Categories use a consistent authenticated page frame pattern.
- Each page communicates product area, page title, short purpose, and evidence/scope signals.
- Existing child components remain wired exactly as before.
- Existing loading skeletons remain in place and still match the page structure.
- Existing CTA behavior remains unchanged.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 009-page-frame-consistency-evidence-first-ux-refinement for implementation in SHIP mode.
```
