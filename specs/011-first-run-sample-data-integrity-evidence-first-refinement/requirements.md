# 011 First-Run Sample Data Integrity Requirements

Feature: 011-first-run-sample-data-integrity-evidence-first-refinement
Codename: Seed Vault
Mode: SHIP
Status: spec_ready

## Goal

Harden the first-run sign-up path so a new BudgetFlow user receives valid starter categories and starter transactions without silent seed failures.

## Current evidence

`src/components/auth/login-form.tsx` contains the sample data creation path used after email/password sign-up.

Observed risk:

- `dummyCategories` includes `Food Delivery`.
- `descriptions` uses `FoodDelivery` without the space.
- The transaction generator indexes `descriptions[cat.name]` for every non-salary category.
- That creates a likely runtime failure when the loop reaches `Food Delivery`.
- `addDummyData` catches and logs the error, so the user may still see authentication success but receive incomplete or missing starter data.

## Runtime scope after approval

- `src/components/auth/login-form.tsx`

Optional static coverage scope after approval:

- `scripts/verify-011-sample-data-integrity.js`

## Constraints

- No package changes.
- No route changes.
- No Firebase config changes.
- No Firestore schema changes.
- No auth provider changes.
- Preserve email/password login.
- Preserve email/password sign-up.
- Preserve Google sign-in behavior.
- Preserve sign-up redirect to `/dashboard`.
- Preserve existing toast pattern unless the implementation explicitly improves sample-data failure visibility.
- Do not create backend APIs.
- Do not change Firestore collection names.

## Acceptance criteria

- Every category used by the starter transaction generator has a matching description list.
- Starter transaction generation cannot index an undefined description list.
- Missing sample-data description mappings are caught by static verification.
- Sign-up sample data path remains deterministic enough to reason about and safe enough to maintain.
- Auth behavior is preserved.
- Firestore collection targets remain `categories` and `transactions`.
- `node scripts/verify-011-sample-data-integrity.js` passes if added.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 011-first-run-sample-data-integrity-evidence-first-refinement for implementation in SHIP mode.
```
