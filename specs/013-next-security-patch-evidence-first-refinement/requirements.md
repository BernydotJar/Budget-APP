# 013 Next Security Patch Requirements

Feature: 013-next-security-patch-evidence-first-refinement
Codename: Patch Harbor
Mode: SHIP
Status: spec_ready

## Goal

Reduce production security risk by applying the npm-audit recommended non-major Next.js security patch.

## Current evidence

`npm audit` reports critical advisories for `next` on the current pinned version `15.2.3`.

The audit reports a semver-compatible fix:

```txt
next -> 15.5.22
isSemVerMajor: false
```

## Runtime scope after approval

- package.json
- package-lock.json

## Constraints

- No app route changes.
- No UI changes.
- No Firebase config changes.
- No Firestore schema changes.
- No auth behavior changes.
- No feature logic changes.
- Do not run broad `npm audit fix` if it introduces large unrelated dependency churn.
- Prefer localized patching of `next` only.

## Acceptance criteria

- `next` is patched to `15.5.22` or a later safe non-major patch selected by npm.
- `package-lock.json` is updated consistently.
- Existing static verification still passes.
- `rm -rf .next && npm run typecheck && npm run build` passes.
- `npm audit --audit-level=critical` shows the Next.js critical finding is removed or reduced.

## Approval gate

Approved through Graph Harness SDLC continuous execution instruction.
