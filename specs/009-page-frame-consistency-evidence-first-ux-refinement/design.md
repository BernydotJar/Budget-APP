# 009 Page Frame Consistency UX Design

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: spec_ready

## Proposed approach

Shift 009 from basic page-frame normalization into a premium BudgetFlow visual-system refresh.

Normalize the top-level frame of the primary pages without changing data or auth behavior, while adding a cinematic savings-app layer with visual-first composition, financial cockpit previews, glass surfaces, depth, and motion-site storytelling cues.

## Target pages

- Dashboard
- Transactions
- Reports
- Categories
- Login

## Design risk to correct

The current direction is clean and readable, but too documentary:

```txt
admin dashboard + blog-style hero + documentation cards
```

The target direction is:

```txt
premium savings product / animated financial experience / visual-first app landing
```

Auth pages should not feel like an internal admin dashboard shell.

## Frame pattern

Each page should expose:

1. A consistent page container with the existing `flex flex-col gap-6` rhythm.
2. A consistent top page card/section surface or premium glass panel.
3. A small product-area label.
4. A primary page title.
5. A concise purpose statement.
6. Evidence/scope cards, chips, or floating proof surfaces where useful.
7. Existing CTA placement where applicable.

## Motion-site adaptation

Use the reference as direction, not as a literal copy.

BudgetFlow should get:

- A cleaner savings-app style background system.
- A main financial command-console visual built from existing app concepts: budget totals, income/expense bars, transaction evidence, reports, and categories.
- Supporting cards or chips around the main visual instead of heavy overlays.
- Soft depth, rounded surfaces, and subtle gradients.
- Scroll-friendly storytelling sections that remain readable on mobile.
- A stronger final CTA/footer-style orientation area when the page naturally supports it.
- A shorter, more aspirational auth entry composition on `/login`.
- A login form integrated as a focused glass panel or equivalent premium auth surface.

Avoid:

- Imported video backgrounds.
- Excessive overlays.
- Decorative visuals that obscure the actual budget app purpose.
- Generic SaaS hero language detached from the current app.
- Auth pages that look like the user is already inside an internal admin dashboard.
- Blog-style hero pages dominated by long explanatory copy.

## Page-specific intent

- Dashboard: emphasize current month financial overview and transaction-backed totals.
- Transactions: emphasize saved ledger records and newest-first ordering.
- Reports: emphasize category reporting, current default period, and saved expense transaction scope.
- Categories: emphasize classification setup and impact on dashboard, transactions, and reports.
- Login: emphasize a premium BudgetFlow entry point with a dominant app-preview/financial cockpit visual, short benefit copy, and an auth panel that preserves all existing behavior.

## Runtime scope after approval

- src/app/dashboard/page.tsx
- src/app/transactions/page.tsx
- src/app/reports/page.tsx
- src/app/categories/page.tsx
- src/app/login/page.tsx
- src/components/auth/login-form.tsx

## Static test direction after approval

Add lightweight static coverage that checks the refreshed source for durable markers such as:

- motion background or visual system class names.
- scroll story or page frame story markers.
- focus visual labels.
- auth premium entry markers.
- financial cockpit or app-preview markers.
- CTA/footer language.
- BudgetFlow-specific concepts rather than generic imported template copy.

## Behavior preservation

Do not change imported child components, suspense boundaries, data queries, mutations, route destinations, authentication guards, Firebase auth calls, sample-data creation, toasts, or redirects.

## Validation

- rm -rf .next && npm run typecheck && npm run build
