# 009 Page Frame Consistency UX Requirements

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: spec_ready

## Goal

Normalize authenticated page framing across the main app pages so dashboard, transactions, reports, and categories present consistent hierarchy, scope copy, evidence-first structure, and a stronger savings-app visual language inspired by the supplied motion-site reference.

## Visual direction from reference

The supplied reference points to a mobile-first savings app style with:

- A clean, high-contrast canvas.
- A primary visual focus area instead of heavy overlays.
- Soft floating cards around the main visual.
- Smooth section transitions.
- Consistent background treatment across sections.
- A stronger CTA/footer treatment.
- Responsive composition that adapts to mobile without losing hierarchy.

This repository should adapt those ideas to BudgetFlow rather than copying the exact pink phone collage or circular chart motif.

## Current evidence

- `src/app/dashboard/page.tsx` uses a custom bordered section header with BudgetFlow copy and dashboard scope.
- `src/app/transactions/page.tsx` uses a `Card` header with BudgetFlow copy, CTA, and three evidence cards.
- `src/app/reports/page.tsx` uses a `Card` header with BudgetFlow copy and three evidence cards.
- `src/app/categories/page.tsx` uses a custom bordered section header with category-management copy and an add-category CTA.
- The pages have individually improved UX, but the page frame patterns are not fully consistent.

## Runtime scope after approval

- `src/app/dashboard/page.tsx`
- `src/app/transactions/page.tsx`
- `src/app/reports/page.tsx`
- `src/app/categories/page.tsx`

## Static protection scope after approval

Add or update lightweight static coverage that verifies the visual refresh keeps these key markers:

- scroll-story or page-frame story section semantics.
- motion-style background treatment.
- focus visual or app-preview composition.
- surrounding cards around the visual focus.
- CTA/footer presence where applicable.
- no backend, Firestore, auth, or mutation changes.

## Constraints

- No package changes.
- No route changes.
- No data-fetching changes.
- No Firestore schema changes.
- No auth changes.
- No mutation behavior changes.
- Preserve all existing page-level child components and suspense boundaries.
- Preserve existing CTAs and destinations.
- Do not introduce heavy overlays over the main visual treatment.
- Do not copy the reference literally; adapt the motion-site language to BudgetFlow.
- Do not introduce external videos/assets unless explicitly approved later.

## Acceptance criteria

- Dashboard, Transactions, Reports, and Categories use a consistent authenticated page frame pattern.
- Each page communicates product area, page title, short purpose, and evidence/scope signals.
- Pages feel more like a cohesive savings/budgeting product experience instead of isolated admin pages.
- Background treatment is coherent across the refreshed surfaces.
- Visual focus/card composition is adapted to BudgetFlow data surfaces.
- Existing child components remain wired exactly as before.
- Existing loading skeletons remain in place and still match the page structure.
- Existing CTA behavior remains unchanged.
- Static coverage protects the key visual/story markers.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 009-page-frame-consistency-evidence-first-ux-refinement for implementation in SHIP mode.
```
