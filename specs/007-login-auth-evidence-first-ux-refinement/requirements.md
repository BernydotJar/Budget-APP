# 007 Login Auth UX Requirements

Feature: 007-login-auth-evidence-first-ux-refinement
Codename: Front Gate
Mode: SHIP
Status: spec_ready

## Goal

Refine the login and sign-up experience so the app entry point matches the evidence-first UX used across the authenticated budget flows.

## Current evidence

- `src/app/login/page.tsx` renders `LoginForm` directly.
- `src/components/auth/login-form.tsx` owns email/password login, email/password sign-up, Google sign-in, toast behavior, redirect behavior, and sample data creation for new email/password users.
- The current card works, but visual hierarchy and user-facing copy are basic.
- Error display is a plain centered paragraph.
- Sign-up sample data behavior exists and should be explained more clearly without changing behavior.

## Runtime scope after approval

- `src/app/login/page.tsx`
- `src/components/auth/login-form.tsx`

## Constraints

- No package changes.
- No environment or secret changes.
- No Firebase config changes.
- No auth provider changes.
- No Firestore schema changes.
- No sample data behavior changes.
- Preserve email/password login behavior.
- Preserve email/password sign-up behavior.
- Preserve Google sign-in behavior.
- Preserve redirect to `/dashboard` after successful auth.

## Acceptance criteria

- Login page has clearer entry-point hierarchy.
- Login/sign-up card explains what the app does after authentication.
- Sign-up mode clearly states sample data will be added.
- Google sign-in remains available and obvious.
- Error state uses a consistent alert pattern.
- Loading states remain clear for email/password and Google flows.
- Existing auth, dummy data, toast, and redirect behavior is preserved.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 007-login-auth-evidence-first-ux-refinement for implementation in SHIP mode.
```
