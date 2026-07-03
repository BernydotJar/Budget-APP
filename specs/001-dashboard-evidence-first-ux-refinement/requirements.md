# 001-dashboard-evidence-first-ux-refinement Requirements

Feature: Dashboard Evidence-First UX Refinement
Codename: Silver Ledger
Mode: SHIP
Status: spec_ready

## Problem

The current dashboard is functional but still reads like a scaffolded application screen. It shows monthly metrics and an expense chart, but it does not yet provide strong financial hierarchy, clear evidence boundaries, or polished empty/error states. The fourth metric card is a placeholder, recent transactions are commented out, and the chart empty state is minimal.

## Goal

Refine the dashboard so a signed-in user can quickly understand current-month financial position from available transaction evidence, without fabricated insights or decorative-only UI.

## User questions the dashboard should answer

For the current month:

1. What is my income?
2. What are my expenses?
3. What is my net position?
4. Do I have enough expense evidence to show a breakdown?
5. What should I do next if there is no data?

## Evidence principle

No evidence = no answer.
Evidence = grounded UI.

The dashboard must not invent trends, projections, recommendations, scores, or insights unless the supporting data is already loaded from the existing application sources.

## Scope

Allowed for the implementation gate:

- Dashboard page layout and copy.
- Dashboard metric presentation.
- Expense chart empty/error states.
- Dashboard skeleton alignment with the final layout.
- Optional recent-transaction preview only if existing data access supports it without new backend/schema work.
- Tests for visible dashboard intent if a test setup already exists.

## Hard boundaries

Do not touch:

- AI or Genkit runtime.
- Firebase configuration.
- Environment files or secrets.
- Package files or dependency versions.
- Migrations or database schema.
- Auth behavior.
- Runtime code outside the approved dashboard scope.

Do not introduce:

- LLM features.
- Fake financial metrics.
- Fake production claims.
- New external services.
- New navigation flows that are not wired.

## Files likely in scope for implementation

- src/app/dashboard/page.tsx
- src/components/dashboard/dashboard-metrics.tsx
- src/components/dashboard/expense-chart.tsx
- src/components/dashboard/dashboard-skeleton.tsx

Optional only if justified by existing data and approved implementation design:

- src/components/dashboard/recent-transactions.tsx

## Acceptance criteria

1. Dashboard has a clear page header explaining the current-month scope.
2. Metric cards no longer include placeholder content.
3. Every displayed financial value is directly grounded in existing transaction query results.
4. Expense chart empty state clearly explains that no current-month expense evidence is available.
5. Error states do not display fabricated values.
6. Skeleton/loading state matches the implemented layout closely enough to avoid layout jumps.
7. The UI remains responsive and accessible.
8. No package, env, migration, AI, auth, or unrelated runtime files are changed.

## Verification required during implementation

Run locally before moving to review:

```bash
npm run typecheck
npm run build
```

If either command cannot run, report the exact blocker and do not mark done.
