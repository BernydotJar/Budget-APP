# 016 CI Quality Gates Requirements

Feature: 016-ci-quality-gates-evidence-first-refinement
Codename: Gatehouse
Mode: SHIP
Status: spec_ready

## Goal

Move the deterministic local/Cloud Sandbox quality gates into GitHub Actions so pull requests and main pushes verify the same production-readiness checks automatically.

## Current evidence

No `.github/workflows` files are currently present. Existing gates are manual or Cloud Sandbox executed.

## Runtime scope

- .github/workflows/ci.yml
- scripts/verify-016-ci-quality-gates.js

## Constraints

- No application source behavior changes.
- No package changes.
- No secrets in workflow.
- Use `.env.example` to create `.env.local` for build-time Firebase public config placeholders.
- Preserve existing scripts and verifiers.

## Acceptance criteria

- CI runs on pull requests and pushes to main.
- CI installs dependencies with `npm ci`.
- CI copies `.env.example` to `.env.local`.
- CI runs all existing verifier scripts.
- CI runs `rm -rf .next`, `npm run typecheck`, and `npm run build`.
- Static CI workflow verifier passes.
- Full local gate passes.
