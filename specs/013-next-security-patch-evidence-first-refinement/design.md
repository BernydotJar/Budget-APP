# 013 Next Security Patch Design

Feature: 013-next-security-patch-evidence-first-refinement
Codename: Patch Harbor
Mode: SHIP
Status: spec_ready

## Proposed approach

Apply a localized dependency patch instead of a broad audit fix.

## Design targets

1. Minimal dependency surface
   - Update only `next` directly.
   - Let npm update only lockfile entries required by that version.

2. Behavior preservation
   - No app code changes.
   - No route changes.
   - No auth or Firestore behavior changes.

3. Verification
   - Run existing 011 and 012 seed verifiers.
   - Run TypeScript check.
   - Run production build.
   - Re-run critical audit and document remaining risk.

## Non-goals

- Do not remediate all npm audit findings in this node.
- Do not run `npm audit fix --force`.
- Do not upgrade React, Firebase, Genkit, or unrelated dependencies unless npm requires it for the Next patch.
