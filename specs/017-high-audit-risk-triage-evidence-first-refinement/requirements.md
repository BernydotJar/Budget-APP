# 017 High Audit Risk Triage Requirements

Feature: 017-high-audit-risk-triage-evidence-first-refinement
Codename: Risk Ledger
Mode: SHIP
Status: spec_ready

## Goal

Persist a machine-readable triage of remaining npm audit findings after all critical vulnerabilities were remediated in 014.

## Current evidence

`npm audit` now reports zero critical vulnerabilities but still reports high/moderate/low findings.

Some suggested fixes are unsafe or misleading for direct application, including major/downgrade recommendations for Next or Genkit-related packages.

## Runtime scope

- scripts/verify-017-audit-risk-triage.js
- progress/audit-017-risk-triage.json

## Constraints

- No package changes.
- No app source changes.
- Do not run `npm audit fix`.
- Do not downgrade Next.
- Do not perform Genkit package migration in this node.

## Acceptance criteria

- Triage script runs `npm audit --json`.
- Triage output records vulnerability counts.
- Triage output records high-severity package names and fix safety hints.
- Triage output asserts critical count remains zero.
- Existing verifiers, typecheck, and build pass.
