# 009 Page Frame Consistency UX Tasks

Feature: 009-page-frame-consistency-evidence-first-ux-refinement
Codename: Frame Lock
Mode: SHIP
Status: spec_ready

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

- [ ] Normalize dashboard page frame.
- [ ] Normalize transactions page frame.
- [ ] Normalize reports page frame.
- [ ] Normalize categories page frame.
- [ ] Refine login/auth page so it does not feel like an internal admin dashboard shell.
- [ ] Add BudgetFlow-specific financial cockpit or app-preview focus visual composition.
- [ ] Add floating cards or chips around the focus visual.
- [ ] Add premium glass/auth panel composition while preserving auth behavior.
- [ ] Add scroll-story or page-story markers without backend changes.
- [ ] Add consistent premium motion-style background treatment.
- [ ] Strengthen CTA/footer-style orientation where applicable.
- [ ] Add lightweight static coverage for key visual/story markers.
- [ ] Preserve existing child components and suspense boundaries.
- [ ] Preserve existing CTAs and route destinations.
- [ ] Preserve existing data and mutation behavior.
- [ ] Preserve email/password auth, Google sign-in, sample data creation, toasts, and redirects.

## Review tasks

- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
