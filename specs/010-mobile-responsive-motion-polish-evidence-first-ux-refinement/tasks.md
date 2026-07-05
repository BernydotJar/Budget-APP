# 010 Mobile Responsive Motion Polish UX Tasks

Feature: 010-mobile-responsive-motion-polish-evidence-first-ux-refinement
Codename: Pocket Cinema
Mode: SHIP
Status: implementation_ready_for_review

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

- [x] Implementation approved in SHIP mode.

## Implementation tasks after approval

- [x] Refine top dock responsive density.
- [x] Refine shell chip overflow behavior on narrow screens.
- [x] Preserve active route behavior.
- [x] Preserve logout behavior.
- [x] Refine motion timing and visual polish.
- [x] Preserve reduced-motion support.
- [x] Add reusable responsive typography utilities.
- [x] Preserve runtime behavior outside visual shell polish.
- [x] Add static coverage for mobile/motion markers.

## Review tasks

- [ ] Run node scripts/verify-010-mobile-motion-markers.js.
- [ ] Run rm -rf .next && npm run typecheck && npm run build.
- [ ] Capture review evidence.
- [ ] Move feature to done after validation passes.
