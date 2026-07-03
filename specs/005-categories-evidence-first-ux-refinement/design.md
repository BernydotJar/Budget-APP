# 005 Categories UX Design

Feature: 005-categories-evidence-first-ux-refinement
Codename: Category Compass
Mode: SHIP
Status: spec_ready

## Proposed layout

1. Page header card with product label, title, explanation, and Add Category action.
2. Evidence summary row explaining category count, usage scope, and mutation safety.
3. Category list card with clearer title and helper copy.
4. Empty state with suggested default categories and a clearer next action.
5. Delete confirmation copy that describes the current runtime behavior without overstating cascade handling.
6. Skeleton aligned to the final header, summary, and list layout.

## Runtime scope after approval

- src/app/categories/page.tsx
- src/components/categories/category-list.tsx
- src/components/categories/category-list-skeleton.tsx

## Data behavior

Do not change category fetching, editing, creation, or deletion semantics in this feature.

## Validation

- rm -rf .next && npm run typecheck && npm run build
