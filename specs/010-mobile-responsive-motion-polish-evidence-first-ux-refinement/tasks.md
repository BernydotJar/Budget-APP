# 010 Mobile Responsive Motion Polish UX Tasks

Feature: 010-mobile-responsive-motion-polish-evidence-first-ux-refinement
Codename: Pocket Cinema
Mode: SHIP
Status: spec_ready

## Spec gate

- [x] Verify main contains 009 merge.
- [x] Inspect current feature registry.
- [x] Inspect current progress state.
- [x] Inspect premium top dock layout.
- [x] Inspect shell chip navigation.
- [x] Create feature registry entry.
- [x] Create requirements.md.
- [x] Create design.md.

## Approval gate

Required approval:

Approved: 010-mobile-responsive-motion-polish-evidence-first-ux-refinement for implementation in SHIP mode.

## Implementation tasks after approval

- [ ] Refine top dock responsive density.
- [ ] Refine shell chip overflow behavior on narrow screens.
- [ ] Preserve active route behavior.
- [ ] Preserve logout behavior.
- [ ] Refine motion timing and visual polish.
- [ ] Preserve reduced-motion support.
- [ ] Tighten responsive typography on cinematic frames.
- [ ] Preserve auth, Firestore, route, mutation, toast, redirect, and suspense behavior.
- [ ] Add static coverage for mobile/motion markers.

## Review tasks

- [ ] Run node scripts/verify-010-mobile-motion-markers.js if added.
- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
