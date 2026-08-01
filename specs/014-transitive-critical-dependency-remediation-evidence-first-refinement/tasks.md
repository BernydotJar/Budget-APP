# 014 Transitive Critical Dependency Remediation Tasks

Feature: 014-transitive-critical-dependency-remediation-evidence-first-refinement
Codename: Dependency Quarantine
Mode: SHIP
Status: done

## Spec gate

- [x] Verify main contains 013 merge.
- [x] Inspect residual critical audit findings.
- [x] Identify non-major candidate dependency updates.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Implementation tasks

- [x] Update candidate Genkit/Firebase dependency chains without major upgrades.
- [x] Preserve application source behavior.
- [x] Preserve package scripts.
- [x] Run existing static verifiers.
- [x] Run typecheck and build.
- [x] Re-run critical audit and record result.

## Review tasks

- [x] Run node scripts/verify-013-next-security-patch.js.
- [x] Run node scripts/verify-011-sample-data-integrity.js.
- [x] Run node scripts/verify-012-google-seed-parity.js.
- [x] Run node scripts/verify-014-no-critical-audit.js.
- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Run npm audit --audit-level=critical through verifier.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.

## Audit result

- Critical vulnerabilities: 0
- High vulnerabilities remain and should be considered by a later non-critical hardening node.
