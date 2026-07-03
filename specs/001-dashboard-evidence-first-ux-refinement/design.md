# 001-dashboard-evidence-first-ux-refinement Design

Feature: Dashboard Evidence-First UX Refinement
Codename: Silver Ledger
Mode: SHIP
Status: spec_ready

## Design intent

BudgetFlow should feel like a calm personal finance control surface, not a generated dashboard template. The dashboard should prioritize clarity, evidence, and next action over decorative cards.

## Current observations

Based on repository inspection:

- `/` redirects to `/dashboard`.
- `src/app/dashboard/page.tsx` renders the dashboard title, metric cards, and expense chart.
- `DashboardMetrics` fetches current-month transactions and computes income, expenses, and balance.
- The fourth metric card is currently a placeholder.
- `ExpenseChart` fetches current-month expenses and categories.
- The expense chart already has loading, error, and empty states, but the empty state is minimal.
- Recent transactions are present only as commented placeholder code in the dashboard page.

## Proposed UX structure for implementation

### 1. Page header

Add a concise header above the dashboard content:

- Title: Dashboard
- Scope copy: Current month financial overview
- Evidence copy: Based on your recorded transactions

This makes the temporal scope explicit before metrics are shown.

### 2. Metric cards

Keep the existing data source and query semantics.

Recommended metric cards:

1. Net Position
   - income minus expenses for the current month
2. Monthly Income
   - current-month income total
3. Monthly Expenses
   - current-month expense total
4. Expense Coverage or Data Status
   - grounded status based on whether monthly data exists

Do not add trend deltas unless previous-period data is explicitly queried and compared.

### 3. Expense breakdown

Keep the chart, but improve the state model:

- Loading: skeleton with stable chart dimensions.
- Error: clear message, no synthetic amount.
- Empty: explain that there are no current-month expense transactions to break down.
- Data present: show chart using existing category and transaction evidence.

### 4. Recent transactions

Only implement if existing transaction data can be queried safely without schema changes.

If implemented, it must include:

- date
- merchant/description if available
- amount
- type
- empty state

If the schema is unclear, defer recent transactions to a later feature instead of guessing.

### 5. Visual and interaction principles

Use UI/UX Pro Max guidance as a review lens:

- Prioritize accessibility and clear text hierarchy.
- Keep spacing consistent.
- Avoid color-only meaning.
- Use existing shadcn/ui and lucide-react primitives.
- Keep mobile layout readable and avoid horizontal scroll.
- Use skeletons for progressive loading.

## Implementation constraints

Do not change data contracts, security rules, Firebase config, dependencies, AI/Genkit code, auth code, package files, env files, migrations, or unrelated pages.

## Review focus

Reviewer should verify:

- Does every visible financial claim come from existing query data?
- Did the implementation remove placeholders?
- Are empty/error states honest?
- Are dashboard-only boundaries respected?
- Do typecheck and build pass?
