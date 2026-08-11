# 018 Firebase Demo Hosting Readiness Evidence

Feature: 018-firebase-demo-hosting-readiness-evidence-first-refinement  
Codename: Launch Pad  
Mode: SHIP  
Status: done pending PR CI/merge

## Summary

Prepared BudgetFlow for same-day Firebase Hosting review links backed by Firebase Auth and Firestore without adding broad demo labels to the product UI.

## Changes

- Added `firebase.json` with framework-aware Hosting source config.
- Added `docs/firebase-hosting.md` with same-day deploy and preview-channel commands.
- Added `scripts/verify-018-firebase-hosting-readiness.js`.
- Added the 018 verifier to `.github/workflows/ci.yml`.
- Linked Firebase Hosting docs from `README.md`.
- Added Graph Harness spec files under `specs/018-firebase-demo-hosting-readiness-evidence-first-refinement/`.

## Deployment policy

- Do not add broad demo labels or banners across the app.
- Use the Firebase Hosting URL, Firebase project name, and internal notes to identify the environment.
- Do not commit `.env.local`, Firebase project IDs, service account credentials, or private keys.

## Static export decision

`output: 'export'` was intentionally not enabled. The current app has a dynamic authenticated route at `/transactions/edit/[id]`; forcing static export today could break edit route behavior. Firebase Hosting framework-aware deployment is the safer same-day path.

## Required validation

```bash
node scripts/verify-018-firebase-hosting-readiness.js
node scripts/verify-017-audit-risk-triage.js
node scripts/verify-016-ci-quality-gates.js
node scripts/verify-015-env-contract.js
node scripts/verify-013-next-security-patch.js
node scripts/verify-011-sample-data-integrity.js
node scripts/verify-012-google-seed-parity.js
node scripts/verify-014-no-critical-audit.js
rm -rf .next && npm run typecheck && npm run build
```
