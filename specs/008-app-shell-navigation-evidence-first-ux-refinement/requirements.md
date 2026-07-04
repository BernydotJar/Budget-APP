# 008 App Shell Navigation UX Requirements

Feature: 008-app-shell-navigation-evidence-first-ux-refinement
Codename: North Star Shell
Mode: SHIP
Status: spec_ready

## Goal

Refine the authenticated app shell and navigation so every main budget area is easier to identify, navigate, and understand from the global layout.

## Current evidence

- `src/app/layout.tsx` owns the global providers, sidebar shell, sidebar header, sidebar content, sidebar footer, mobile trigger header, and main content inset.
- `src/components/main-nav.tsx` owns authenticated navigation items, active state matching, and logout behavior.
- The current shell works, but the sidebar header is minimal, the top header has no contextual framing, the sidebar footer is empty, and the navigation labels lack supporting intent copy.
- Active state logic exists and should be preserved.
- Logout behavior exists and should be preserved.

## Runtime scope after approval

- `src/app/layout.tsx`
- `src/components/main-nav.tsx`

## Constraints

- No package changes.
- No route changes.
- No auth provider changes.
- No Firebase config changes.
- No logout semantic changes.
- No navigation destination changes unless strictly required for clearer grouping.
- Preserve dashboard, transactions, new transaction, reports, and categories navigation.
- Preserve sign-out toast and redirect to `/login`.

## Acceptance criteria

- App shell has clearer product identity and authenticated workspace framing.
- Sidebar navigation has clearer grouping and route intent.
- Active state behavior remains correct for nested transaction routes.
- Mobile sidebar trigger remains available.
- Shell skeleton remains aligned with the final navigation structure.
- Logout remains available and behavior is unchanged.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 008-app-shell-navigation-evidence-first-ux-refinement for implementation in SHIP mode.
```
