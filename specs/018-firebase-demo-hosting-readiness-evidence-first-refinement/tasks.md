# 018 Firebase Demo Hosting Readiness Tasks

Feature: 018-firebase-demo-hosting-readiness-evidence-first-refinement
Codename: Launch Pad
Mode: SHIP
Status: done

## Ready Node

- [x] Confirm main is synchronized after 017.
- [x] Inspect Firebase env contract.
- [x] Inspect Next config.
- [x] Inspect dynamic edit route risk.
- [x] Select Firebase Hosting framework-aware path instead of unsafe static export.

## Producer

- [x] Add `firebase.json`.
- [x] Add Firebase Hosting deployment docs.
- [x] Add Firebase Hosting readiness verifier.
- [x] Add verifier to CI.
- [x] Link deployment docs from README.

## Critic / Red Team

- [x] Avoid broad demo labels in product UI.
- [x] Avoid committing Firebase project IDs.
- [x] Avoid committing private credentials.
- [x] Avoid forcing `output: 'export'` while dynamic authenticated route exists.

## Independent Verifier

- [x] `node scripts/verify-018-firebase-hosting-readiness.js`
- [x] CI runs existing Graph Harness gates.
- [x] CI runs `rm -rf .next && npm run typecheck && npm run build`.

## Release Gate

- [x] Open PR with Firebase Hosting readiness scope.
- [ ] Merge after CI passes.
- [ ] Synchronize local main after merge.
