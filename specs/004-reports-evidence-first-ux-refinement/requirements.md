# 004 Reports UX Requirements

Feature: 004-reports-evidence-first-ux-refinement
Codename: Signal Report
Mode: SHIP
Status: spec_ready

## Goal

Refine the Reports screen so it is clearer and more consistent with Dashboard and Transactions.

## Current evidence

- `src/app/reports/page.tsx` has a simple `Reports` heading.
- `src/components/reports/report-generator.tsx` has filters and an expense breakdown chart.
- Empty state copy is generic.
- Loading state uses a spinner.
- `src/components/reports/report-skeleton.tsx` matches the older layout.

## Runtime scope after approval

- `src/app/reports/page.tsx`
- `src/components/reports/report-generator.tsx`
- `src/components/reports/report-skeleton.tsx`
- `src/components/reports/report-pie-chart.tsx` only if needed for visual consistency

## Constraints

- No package changes.
- No environment or secret changes.
- No Firebase config changes.
- No data model changes.
- No report aggregation changes.
- No auth changes.
- No new report types.

## Acceptance criteria

- Reports page has clearer hierarchy and explanatory copy.
- Filters explain date range, account scope, and expense-only scope.
- Empty state explains when no matching expense records exist.
- Loading state matches the final layout.
- Chart section explains what is being visualized.
- Existing query behavior is preserved.
- `npm run typecheck` passes.
- `npm run build` passes.

## Approval gate

```txt
Approved: 004-reports-evidence-first-ux-refinement for implementation in SHIP mode.
```
