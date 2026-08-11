# 018 Firebase Demo Hosting Readiness Requirements

Feature: 018-firebase-demo-hosting-readiness-evidence-first-refinement
Codename: Launch Pad
Mode: SHIP
Status: done

## Goal

Prepare BudgetFlow for same-day Firebase Hosting review links backed by Firebase Auth and Firestore, without adding broad "demo" labeling across the product UI.

## Current evidence

- The app already consumes Firebase public web config through `src/firebase.ts`.
- `.env.example` and environment contract verification exist from 015.
- CI quality gates exist from 016.
- The app still contains a dynamic authenticated edit route at `/transactions/edit/[id]`, so forcing a static export would be unsafe for today's review path.

## Requirements

- Add Firebase Hosting configuration.
- Preserve the current Next.js runtime behavior.
- Do not enable `output: 'export'` in `next.config.ts` for this hot path.
- Do not add broad "demo" labels or banners throughout `src/app` or `src/components`.
- Document a same-day deploy path using Firebase CLI and a Firebase project ID supplied at deploy time.
- Document a preview-channel path for short-lived marketing/stakeholder review links.
- Avoid committing Firebase project IDs, private keys, service accounts, or `.env.local` values.
- Add static verification for hosting readiness and no broad UI demo labeling.
- Add the new verifier to CI.

## Acceptance criteria

- `firebase.json` exists and uses framework-aware hosting source configuration.
- `docs/firebase-hosting.md` documents Auth, Firestore, Hosting, env config, preview channel, and deploy commands.
- `scripts/verify-018-firebase-hosting-readiness.js` passes.
- CI runs the 018 verifier.
- Existing app behavior remains unchanged.
- `rm -rf .next && npm run typecheck && npm run build` passes in CI.
