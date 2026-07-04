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
- [ ] Preserve existing child components and suspense boundaries.
- [ ] Preserve existing CTAs and route destinations.
- [ ] Preserve existing data and mutation behavior.

## Review tasks

- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
