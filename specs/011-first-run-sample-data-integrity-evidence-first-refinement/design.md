# 011 First-Run Sample Data Integrity Design

Feature: 011-first-run-sample-data-integrity-evidence-first-refinement
Codename: Seed Vault
Mode: SHIP
Status: spec_ready

## Proposed approach

Keep the auth flow unchanged and harden only the starter data path.

## Design targets

1. Category-description consistency
   - Ensure every starter category has a matching description key.
   - Prefer one source of truth or a typed mapping that prevents drift.

2. Safer transaction generation
   - Avoid indexing an undefined description list.
   - Preserve current Firestore writes to `categories` and `transactions`.
   - Preserve the current starter data shape: category docs plus transaction docs.

3. Static verification
   - Add a small Node verification script that checks sample data mapping consistency.
   - The script should fail if a category lacks descriptions.
   - The script should be cheap and deterministic.

4. User experience
   - Preserve sign-up success and redirect flow.
   - Preserve current toasts unless implementation adds clearer seed failure wording without changing auth behavior.

## Runtime scope after approval

- src/components/auth/login-form.tsx

## Static coverage after approval

- scripts/verify-011-sample-data-integrity.js

## Validation

- node scripts/verify-011-sample-data-integrity.js
- rm -rf .next && npm run typecheck && npm run build

## Non-goals

- No visual redesign.
- No Firebase configuration change.
- No Firestore schema migration.
- No Google sign-in starter-data expansion unless explicitly approved later.
- No new dependencies.
