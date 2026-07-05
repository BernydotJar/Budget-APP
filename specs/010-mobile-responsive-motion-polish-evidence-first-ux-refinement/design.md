# 010 Mobile Responsive Motion Polish UX Design

Feature: 010-mobile-responsive-motion-polish-evidence-first-ux-refinement
Codename: Pocket Cinema
Mode: SHIP
Status: spec_ready

## Proposed approach

Keep the premium visual system from 009, but refine the shell and page frames so they behave more like a polished product experience across screen sizes.

## Design targets

1. Top dock
   - Reduce crowding on smaller widths.
   - Keep BudgetFlow identity visible.
   - Keep shell chips reachable without bringing back the admin sidebar.

2. Navigation chips
   - Keep horizontal chips.
   - Improve scroll affordance on mobile.
   - Preserve active route state.
   - Preserve logout behavior.

3. Motion system
   - Keep lightweight CSS-only motion.
   - Add subtle stagger or delay where it improves perceived quality.
   - Preserve `prefers-reduced-motion` behavior.
   - Avoid heavy or excessive animation.

4. Page frames
   - Ensure cinematic headings are responsive and do not clip horizontally.
   - Keep financial cockpit previews readable on tablet and mobile.
   - Keep glass cards/chips aligned and compact.

## Runtime scope after approval

- src/app/layout.tsx
- src/components/main-nav.tsx
- src/app/globals.css
- src/app/dashboard/page.tsx
- src/app/transactions/page.tsx
- src/app/reports/page.tsx
- src/app/categories/page.tsx
- src/components/auth/login-form.tsx

## Static test direction after approval

Add `scripts/verify-010-mobile-motion-markers.js` or update equivalent static coverage to protect:

- premium top dock markers.
- chip navigation markers.
- overflow-safe navigation markers.
- responsive heading markers.
- motion and reduced-motion markers.

## Behavior preservation

No data, auth, route, Firestore, mutation, toast, redirect, or suspense boundary behavior should change.

## Validation

- node scripts/verify-010-mobile-motion-markers.js
- rm -rf .next && npm run typecheck && npm run build
