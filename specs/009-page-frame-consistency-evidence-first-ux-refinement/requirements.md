# 009 Page Frame Consistency UX Requirements

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: spec_ready

## Goal

Reorient the page-frame refresh into a premium BudgetFlow visual system so `/login` and the main app pages feel like a cinematic savings-app experience, not an admin dashboard or blog-style documentation layout.

The feature should still normalize page framing across dashboard, transactions, reports, and categories, but the higher bar is a visual-first app landing and financial cockpit language with depth, focus visuals, glass surfaces, and motion-site storytelling cues.

## Current design risk

The current frontend is clean and functional, but it reads as:

```txt
admin dashboard + blog-style hero + documentation cards
```

The target is:

```txt
premium savings product / animated financial experience / visual-first app landing
```

BudgetFlow should feel like a premium savings cockpit, not a blog page.

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

For BudgetFlow, the visual system should center on a financial command-console composition:

- balance card or savings overview as the dominant focal point.
- income and expense bars.
- category chips.
- mini transaction feed.
- report preview.
- floating supporting cards.
- soft gradient mesh, radial glow, glass panels, and depth shadows.
- concise copy with fewer explanatory cards.

## Current evidence

- `/login` currently risks feeling like an internal admin/dashboard shell instead of a premium auth entry point.
- `src/app/dashboard/page.tsx` uses a custom bordered section header with BudgetFlow copy and dashboard scope.
- `src/app/transactions/page.tsx` uses a `Card` header with BudgetFlow copy, CTA, and three evidence cards.
- `src/app/reports/page.tsx` uses a `Card` header with BudgetFlow copy and three evidence cards.
- `src/app/categories/page.tsx` uses a custom bordered section header with category-management copy and an add-category CTA.
- The pages have individually improved UX, but the page frame patterns are not fully consistent or premium enough.

## Runtime scope after approval

- `src/app/dashboard/page.tsx`
- `src/app/transactions/page.tsx`
- `src/app/reports/page.tsx`
- `src/app/categories/page.tsx`
- `src/app/login/page.tsx`
- `src/components/auth/login-form.tsx`

## Static protection scope after approval

Add or update lightweight static coverage that verifies the visual refresh keeps these key markers:

- scroll-story or page-frame story section semantics.
- motion-style background treatment.
- financial cockpit, app-preview, or command-console focus visual.
- surrounding cards or chips around the visual focus.
- CTA/footer presence where applicable.
- auth pages avoid internal-admin-shell treatment.
- no backend, Firestore, auth, or mutation changes.

## Constraints

- No package changes.
- No route changes.
- No data-fetching changes.
- No Firestore schema changes.
- No auth behavior changes.
- No mutation behavior changes.
- Preserve all existing page-level child components and suspense boundaries.
- Preserve existing CTAs and destinations.
- Preserve email/password login, email/password sign-up, Google sign-in, sample data creation, toast behavior, and redirect behavior.
- Do not introduce heavy overlays over the main visual treatment.
- Do not copy the reference literally; adapt the motion-site language to BudgetFlow.
- Do not introduce external videos/assets unless explicitly approved later.

## Acceptance criteria

- Dashboard, Transactions, Reports, and Categories use a consistent authenticated page frame pattern.
- `/login` feels like a premium app entry point, not an internal admin dashboard shell.
- Login/auth composition integrates the form into a premium glass panel or equivalent focused auth surface.
- Login/auth visual copy is shorter, more aspirational, and less article-like.
- Each page communicates product area, page title, short purpose, and evidence/scope signals.
- Pages feel more like a cohesive premium savings/budgeting product experience instead of isolated admin pages.
- Background treatment uses a coherent premium atmosphere such as soft gradient mesh, radial glow, glass panels, or depth shadows.
- Visual focus/card composition is adapted to BudgetFlow data surfaces and is the dominant visual signal.
- Cards feel memorable and product-specific rather than generic documentation cards.
- Existing child components remain wired exactly as before.
- Existing loading skeletons remain in place and still match the page structure.
- Existing CTA behavior remains unchanged.
- Static coverage protects the key visual/story markers.
- `rm -rf .next && npm run typecheck && npm run build` passes.

## Approval gate

```txt
Approved: 009-page-frame-consistency-evidence-first-ux-refinement for implementation in SHIP mode.
```
