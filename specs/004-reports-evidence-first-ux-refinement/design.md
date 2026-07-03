# 004 Reports UX Design

Feature: 004-reports-evidence-first-ux-refinement
Codename: Signal Report
Mode: SHIP
Status: spec_ready

## Current layout

The reports page currently has:

- a page title
- a filter card
- a date range picker
- an account selector
- an expense breakdown card
- a pie chart
- a simple empty state

## Proposed layout

### Page header

Add a page-level card consistent with Dashboard and Transactions:

- BudgetFlow
- Reports
- short description for expense reporting
- summary chips for scope, default period, and report type

### Filter card

Keep current controls and improve text around them:

- report period
- account scope
- expense-only scope

### Report card

Keep the existing expense-by-category chart and data source.

Improve surrounding copy:

- explain chart grouping by category
- show selected range and account in plain language
- improve empty state when no matching records exist

### Loading state

Update ReportSkeleton so loading layout matches the final screen.

## Runtime scope after approval

- src/app/reports/page.tsx
- src/components/reports/report-generator.tsx
- src/components/reports/report-skeleton.tsx
- src/components/reports/report-pie-chart.tsx only if needed

## Validation

- npm run typecheck
- npm run build
