# 010 Mobile Responsive Motion Polish UX Requirements

Feature: 010-mobile-responsive-motion-polish-evidence-first-ux-refinement
Codename: Pocket Cinema
Mode: SHIP
Status: spec_ready

## Goal

Harden the premium BudgetFlow visual system introduced in 009 so the top dock, chip navigation, financial cockpit visuals, and lightweight motion system feel intentional across desktop, tablet, and mobile.

## Current evidence

- `src/app/layout.tsx` now uses a premium sticky top dock instead of the old admin sidebar.
- `src/components/main-nav.tsx` now uses horizontal shell chips for primary navigation.
- `src/app/globals.css` includes lightweight motion utilities, scan highlights, hover transitions, and `prefers-reduced-motion` handling.
- The visual direction is much stronger after 009, but the next risk is responsive polish: chip overflow, header density, oversized hero text, and motion that may feel too mechanical or too subtle on different breakpoints.

## Runtime scope after approval

- `src/app/layout.tsx`
- `src/components/main-nav.tsx`
- `src/app/globals.css`
- `src/app/dashboard/page.tsx`
- `src/app/transactions/page.tsx`
- `src/app/reports/page.tsx`
- `src/app/categories/page.tsx`
- `src/components/auth/login-form.tsx`

## Static protection scope after approval

Add or update lightweight static coverage that verifies:

- premium top dock remains present.
- shell chip navigation remains present.
- mobile navigation supports horizontal overflow safely.
- motion utilities remain present.
- reduced-motion fallback remains present.
- responsive typography or layout markers exist on primary cinematic frames.
- no backend, Firestore, auth, route, or mutation behavior changes.

## Constraints

- No package changes.
- No route changes.
- No Firebase config changes.
- No Firestore schema changes.
- No auth behavior changes.
- No mutation behavior changes.
- Preserve email/password login, Google sign-in, sample data creation, toasts, and redirects.
- Preserve child components and suspense boundaries.
- Preserve the premium visual system from 009.
- Do not introduce video assets yet.
- Do not add heavy animation libraries.

## Acceptance criteria

- Top dock feels premium but not crowded on mobile.
- Navigation chips are usable on narrow screens and remain visually aligned on desktop.
- Large cinematic headings avoid horizontal clipping on common viewport widths.
- Motion feels intentional and lightweight, not distracting.
- Reduced-motion users are respected.
- Core pages keep the premium BudgetFlow look from 009.
- Static coverage protects mobile/motion markers.
- `node scripts/verify-010-mobile-motion-markers.js` passes if introduced.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 010-mobile-responsive-motion-polish-evidence-first-ux-refinement for implementation in SHIP mode.
```
