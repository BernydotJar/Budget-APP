# Current Progress

Active feature: 012-google-first-run-seed-parity-evidence-first-refinement

Mode: SHIP
Status: spec_ready
Codename: Orbit Seed

Runtime code has not been changed for 012.

## Source of truth

- specs/012-google-first-run-seed-parity-evidence-first-refinement/requirements.md
- specs/012-google-first-run-seed-parity-evidence-first-refinement/design.md
- specs/012-google-first-run-seed-parity-evidence-first-refinement/tasks.md

## Runtime evidence inspected

- src/components/auth/login-form.tsx

## Design intent

012 extends first-run starter data parity to new Google Sign-In users. After 011, the starter data generator is safe for email/password sign-up, but the Google Sign-In path still skips starter data and sends new Google users directly to `/dashboard`.

## Validation rule

No feature moves to done unless this passes:

```bash
rm -rf .next && npm run typecheck && npm run build
```

If static Google seed parity coverage is added, it must also pass before done.

## Next gate

Approved: 012-google-first-run-seed-parity-evidence-first-refinement for implementation in SHIP mode.
