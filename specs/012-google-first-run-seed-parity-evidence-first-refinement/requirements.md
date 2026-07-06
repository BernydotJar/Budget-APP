# 012 Google First-Run Seed Parity Requirements

Feature: 012-google-first-run-seed-parity-evidence-first-refinement
Codename: Orbit Seed
Mode: SHIP
Status: spec_ready

## Goal

Extend the starter data behavior to new Google Sign-In users so first-run Google accounts receive the same BudgetFlow starter categories and transactions as email/password sign-up users.

## Current evidence

`src/components/auth/login-form.tsx` now has a hardened `addDummyData(userId)` path after 011.

The email/password sign-up path currently does this:

- create user with email/password.
- show sign-up toast.
- run `addDummyData(user.uid)`.
- show welcome toast.
- redirect to `/dashboard`.

The Google Sign-In path currently does this:

- sign in with popup.
- show Google success toast.
- skip starter data.
- redirect to `/dashboard`.

The source explicitly notes that new Google users might need starter data, but the behavior is skipped for simplicity.

## Runtime scope after approval

- `src/components/auth/login-form.tsx`

Optional static coverage scope after approval:

- `scripts/verify-012-google-seed-parity.js`

## Constraints

- No package changes.
- No route changes.
- No Firebase config changes.
- No Firestore schema changes.
- No auth provider changes outside the Google sign-in handler.
- Preserve email/password login behavior.
- Preserve email/password sign-up behavior.
- Preserve existing starter data generator from 011.
- Preserve Firestore collection names: `categories` and `transactions`.
- Do not seed starter data for existing Google users.
- Do not duplicate starter data on repeated Google sign-ins.
- Preserve redirect to `/dashboard`.
- Preserve the general toast pattern.

## Acceptance criteria

- New Google Sign-In users receive starter categories and transactions.
- Existing Google Sign-In users are not seeded again.
- Email/password sign-up still seeds starter data.
- Email/password login does not seed starter data.
- Static coverage protects the Google first-run detection and seed path.
- `node scripts/verify-012-google-seed-parity.js` passes if added.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 012-google-first-run-seed-parity-evidence-first-refinement for implementation in SHIP mode.
```
