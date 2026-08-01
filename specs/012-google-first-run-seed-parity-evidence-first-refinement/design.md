# 012 Google First-Run Seed Parity Design

Feature: 012-google-first-run-seed-parity-evidence-first-refinement
Codename: Orbit Seed
Mode: SHIP
Status: spec_ready

## Proposed approach

Use Firebase's Google sign-in result metadata to detect whether the Google-authenticated user is new. Only new Google users should receive starter data.

## Design targets

1. Google first-run detection
   - Inspect the Google sign-in result after `signInWithPopup`.
   - Use Firebase-auth metadata intended for new-user detection.
   - Avoid custom Firestore checks unless implementation evidence shows they are necessary.

2. Seed parity
   - Reuse the existing `addDummyData(user.uid)` function from 011.
   - New Google users get starter categories and transactions.
   - Existing Google users are not seeded again.

3. Behavior preservation
   - Preserve email/password login behavior.
   - Preserve email/password sign-up behavior.
   - Preserve Google popup behavior.
   - Preserve redirect to `/dashboard`.
   - Preserve the general toast pattern.

4. Static verification
   - Add a small static verifier that checks the Google handler uses new-user detection and calls `addDummyData` only through the first-run path.

## Runtime scope after approval

- src/components/auth/login-form.tsx

## Static coverage after approval

- scripts/verify-012-google-seed-parity.js

## Validation

- node scripts/verify-012-google-seed-parity.js
- rm -rf .next && npm run typecheck && npm run build

## Non-goals

- No UI redesign.
- No new onboarding screen.
- No Firestore schema migration.
- No package changes.
- No changes to email/password auth behavior.
