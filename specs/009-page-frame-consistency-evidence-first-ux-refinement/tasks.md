# 009 Page Frame Consistency UX Tasks

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: done

## Spec gate

- [x] Verify main contains 008 merge.
- [x] Inspect dashboard page frame.
- [x] Inspect transactions page frame.
- [x] Inspect reports page frame.
- [x] Inspect categories page frame.
- [x] Inspect login/auth page frame.
- [x] Review supplied savings-app motion-site reference.
- [x] Record premium cinematic savings-app reorientation.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Approval gate

Required approval:

Approved: 009-page-frame-consistency-evidence-first-ux-refinement for implementation in SHIP mode.

## Implementation tasks after approval

- [x] Normalize dashboard page frame.
- [x] Normalize transactions page frame.
- [x] Normalize reports page frame.
- [x] Normalize categories page frame.
- [x] Refine login/auth page so it does not feel like an internal admin dashboard shell.
- [x] Add BudgetFlow-specific financial cockpit or app-preview focus visual composition.
- [x] Add floating cards or chips around the focus visual.
- [x] Add premium glass/auth panel composition while preserving auth behavior.
- [x] Add scroll-story or page-story markers without backend changes.
- [x] Add consistent premium motion-style background treatment.
- [x] Strengthen CTA/footer-style orientation where applicable.
- [x] Add lightweight static coverage for key visual/story markers.
- [x] Preserve existing child components and suspense boundaries.
- [x] Preserve existing CTAs and route destinations.
- [x] Preserve existing data and mutation behavior.
- [x] Preserve email/password auth, Google sign-in, sample data creation, toasts, and redirects.

## Review tasks

- [x] Run node scripts/verify-009-visual-markers.js.
- [x] Run rm -rf .next && npm run typecheck && npm run build.
- [x] Capture review evidence.
- [x] Move feature to done after validation passes.
