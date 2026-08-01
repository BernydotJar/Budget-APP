# 015 Environment Contract Verification Design

Feature: 015-env-contract-verification-evidence-first-refinement
Codename: Config Beacon
Mode: SHIP
Status: spec_ready

## Approach

Add a committed `.env.example` containing public Firebase placeholder keys and a verifier that compares the required env keys used by `src/firebase.ts` against `.env.example`.

## Verification

- `node scripts/verify-015-env-contract.js`
- Existing feature verifiers.
- TypeScript check.
- Production build.

## Non-goals

- No secrets.
- No runtime Firebase behavior changes.
- No environment variable renames.
