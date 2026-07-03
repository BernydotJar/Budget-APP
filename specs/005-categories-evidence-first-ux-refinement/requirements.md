# 005 Categories UX Requirements

Feature: 005-categories-evidence-first-ux-refinement
Codename: Category Compass
Mode: SHIP
Status: spec_ready

## Goal

Refine the Categories screen so it matches the evidence-first UX now used by Dashboard, Transactions, and Reports.

## Current evidence

- `src/app/categories/page.tsx` has a simple page title and Add Category action.
- `src/components/categories/category-list.tsx` renders the category list, empty state, edit, and delete actions.
- `src/components/categories/category-list-skeleton.tsx` matches the older list layout.
- Delete copy warns that transactions might become uncategorized, but the runtime behavior currently deletes only the category document.

## Runtime scope after approval

- `src/app/categories/page.tsx`
- `src/components/categories/category-list.tsx`
- `src/components/categories/category-list-skeleton.tsx`

## Constraints

- No package changes.
- No environment or secret changes.
- No Firebase config changes.
- No schema changes.
- No Firestore query semantic changes.
- No category mutation behavior changes.
- No auth changes.
- No AI or Genkit changes.

## Acceptance criteria

- Categories page has clearer hierarchy and explanatory copy.
- Add Category primary action placement remains obvious.
- Category list explains what categories affect.
- Empty state is more useful and consistent with the rest of the app.
- Error state uses user-facing evidence-first language.
- Delete confirmation copy accurately describes current behavior.
- Loading skeleton matches the final layout.
- Existing edit/delete behavior is preserved.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 005-categories-evidence-first-ux-refinement for implementation in SHIP mode.
```
