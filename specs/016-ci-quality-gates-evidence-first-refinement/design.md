# 016 CI Quality Gates Design

Feature: 016-ci-quality-gates-evidence-first-refinement
Codename: Gatehouse
Mode: SHIP
Status: spec_ready

## Approach

Add a single GitHub Actions workflow that mirrors the Graph Harness release gates already used in Cloud Sandbox.

## Workflow shape

- Trigger on pull_request and push to main.
- Use Ubuntu runner.
- Use Node 22.
- Run npm ci.
- Copy `.env.example` to `.env.local`.
- Run verifier scripts.
- Run typecheck and production build.

## Non-goals

- No deployment.
- No secrets.
- No package updates.
- No branch protection changes.
