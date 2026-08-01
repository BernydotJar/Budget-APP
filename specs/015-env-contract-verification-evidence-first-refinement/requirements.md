# 015 Environment Contract Verification Requirements

Feature: 015-env-contract-verification-evidence-first-refinement
Codename: Config Beacon
Mode: SHIP
Status: spec_ready

## Goal

Make the Firebase public environment contract explicit and verifiable so local, CI, and deployment builds do not fail with opaque Firebase `auth/invalid-api-key` errors.

## Current evidence

Cloud Sandbox build required an ignored local `.env.local` with dummy public Firebase-shaped values because the repository does not commit environment files.

`src/firebase.ts` consumes these variables:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

## Runtime scope

- .env.example
- README.md
- scripts/verify-015-env-contract.js

## Constraints

- Do not commit secrets.
- Use placeholders only.
- No Firebase config value changes.
- No source behavior changes.
- No route changes.
- No package changes.

## Acceptance criteria

- `.env.example` contains every Firebase public env key consumed by `src/firebase.ts`.
- README documents copying `.env.example` to `.env.local`.
- Static verifier passes.
- Existing static verifiers pass.
- TypeScript check and production build pass when `.env.local` is present.
