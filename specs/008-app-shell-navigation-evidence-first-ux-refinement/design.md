# 008 App Shell Navigation UX Design

Feature: 008-app-shell-navigation-evidence-first-ux-refinement
Codename: North Star Shell
Mode: SHIP
Status: spec_ready

## Proposed layout

1. Strengthen the sidebar header with product name and short workspace descriptor.
2. Add clearer sidebar navigation grouping:
   - Overview
   - Activity
   - Insights
   - Setup
3. Keep existing route destinations:
   - `/dashboard`
   - `/transactions`
   - `/transactions/new`
   - `/reports`
   - `/categories`
4. Add concise intent copy where the sidebar component supports it without introducing new dependencies.
5. Improve sidebar footer so logout is visually separated from primary navigation.
6. Improve the top app header with mobile trigger and lightweight workspace context.
7. Keep the app shell resilient and minimal so page-level content remains the primary surface.

## Runtime scope after approval

- src/app/layout.tsx
- src/components/main-nav.tsx

## Behavior preservation

Do not change route destinations, Firebase sign-out behavior, logout toast behavior, or redirect to `/login`.

## Validation

- rm -rf .next && npm run typecheck && npm run build
