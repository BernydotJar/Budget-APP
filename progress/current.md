# Current Progress

Active feature: 018-firebase-demo-hosting-readiness-evidence-first-refinement

Mode: SHIP  
Status: done  
Codename: Launch Pad

## Validation

Expected to pass in CI on PR #18:

```bash
node scripts/verify-018-firebase-hosting-readiness.js
node scripts/verify-017-audit-risk-triage.js
node scripts/verify-016-ci-quality-gates.js
node scripts/verify-015-env-contract.js
node scripts/verify-013-next-security-patch.js
node scripts/verify-011-sample-data-integrity.js
node scripts/verify-012-google-seed-parity.js
node scripts/verify-014-no-critical-audit.js
rm -rf .next && npm run typecheck && npm run build
```

Evidence:

- Firebase Hosting configuration added through `firebase.json`.
- Hosting config uses `hosting.source = "."` to preserve Next.js runtime behavior for the current dynamic edit route.
- Firebase deployment docs added at `docs/firebase-hosting.md`.
- Broad demo-label phrases are statically rejected in `src/app` and `src/components`.
- CI runs the Firebase Hosting readiness verifier.

## Next rule

Do not merge 018 until CI passes on the pull request.
