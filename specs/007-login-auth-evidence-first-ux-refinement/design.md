# 007 Login Auth UX Design

Feature: 007-login-auth-evidence-first-ux-refinement
Codename: Front Gate
Mode: SHIP
Status: spec_ready

## Proposed layout

1. Login page wrapper with centered two-column responsive layout.
2. Product/context panel explaining the budget workflow before authentication.
3. Auth card with mode-aware title and description.
4. Evidence summary points for what happens after login/sign-up:
   - secure access
   - dashboard redirect
   - sign-up sample data
5. Email/password form with clearer helper copy.
6. Google sign-in kept as a first-class alternative.
7. Error state rendered as an alert instead of plain paragraph.
8. Preserve all existing auth and data side effects.

## Runtime scope after approval

- src/app/login/page.tsx
- src/components/auth/login-form.tsx

## Data behavior

Do not change login, sign-up, Google sign-in, sample data creation, toast, or redirect semantics in this feature.

## Validation

- rm -rf .next && npm run typecheck && npm run build
