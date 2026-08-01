# 017 High Audit Risk Triage Design

Feature: 017-high-audit-risk-triage-evidence-first-refinement
Codename: Risk Ledger
Mode: SHIP
Status: spec_ready

## Approach

Add a verifier that captures npm audit output into a stable JSON artifact and classifies remaining findings by severity and fix availability.

## Non-goals

- No dependency upgrades.
- No package migrations.
- No forced audit remediation.
