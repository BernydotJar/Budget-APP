# 013 Next Security Patch Tasks

Feature: 013-next-security-patch-evidence-first-refinement
Codename: Patch Harbor
Mode: SHIP
Status: done

## Spec gate

- [x] Verify main contains 012 merge.
- [x] Inspect npm audit critical findings.
- [x] Identify localized Next.js security patch path.
- [x] Avoid broad audit fix due unrelated dependency churn.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Implementation tasks

- [x] Update Next.js to the npm-audit recommended non-major security version.
- [x] Preserve application source behavior.
- [x] Preserve package scripts.
- [x] Update package-lock.json consistently.
- [x] Run existing static verifiers.
- [x] Run typecheck and build.
- [x] Re-run critical audit and record remaining risk.

## Review tasks

- [x] Run node scripts/verify-013-next-security-patch.js.
- [x] Run node scripts/verify-011-sample-data-integrity.js.
- [x] Run node scripts/verify-012-google-seed-parity.js.
- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Run npm audit --audit-level=critical and record residual non-Next criticals.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.

## Residual risk

`npm audit --audit-level=critical` still reports four non-Next critical packages:

- form-data
- handlebars
- protobufjs
- websocket-driver

These remain outside 013 scope because they come through Genkit/Firebase transitive chains and require a separate dependency remediation node.
