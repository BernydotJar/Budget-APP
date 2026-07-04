# 009 Home Redirect Entrypoint Design

Feature: 009-home-redirect-entrypoint-evidence-first-refinement
Codename: Front Door Redirect
Mode: SHIP
Status: spec_ready

## Proposed behavior

1. Keep `/` as a server-side redirect to `/dashboard`.
2. Make the redirect intent explicit in the implementation.
3. Avoid adding a public landing page in this feature.
4. Avoid introducing client-side auth checks or loading states.
5. Keep the feature narrowly scoped so it does not alter dashboard, login, or app shell behavior.

## Runtime scope after approval

- src/app/page.tsx

## Behavior preservation

The route must continue to call `redirect('/dashboard')` from `next/navigation`.

## Validation

- rm -rf .next && npm run typecheck && npm run build
