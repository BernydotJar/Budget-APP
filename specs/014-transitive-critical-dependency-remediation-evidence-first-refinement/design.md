# 014 Transitive Critical Dependency Remediation Design

Feature: 014-transitive-critical-dependency-remediation-evidence-first-refinement
Codename: Dependency Quarantine
Mode: SHIP
Status: spec_ready

## Proposed approach

Update only packages that own the residual critical dependency chains and keep changes within non-major ranges.

## Candidate updates

- firebase within 11.x
- @tanstack-query-firebase/react within 1.x
- genkit within 1.x
- genkit-cli within 1.x
- @genkit-ai/googleai within 1.x
- @genkit-ai/next within 1.x

## Verification

- Static seed verifiers from 011 and 012.
- Next patch verifier from 013.
- TypeScript check.
- Production build.
- npm audit critical report.

## Non-goals

- No major dependency upgrades.
- No forced audit fix.
- No feature changes.
