# 001-dashboard-evidence-first-ux-refinement Tasks

Feature: Dashboard Evidence-First UX Refinement
Codename: Silver Ledger
Mode: SHIP
Status: spec_ready

## Spec gate

- [x] Inspect repository entry points.
- [x] Confirm dashboard files and current behavior.
- [x] Create requirements.md.
- [x] Create design.md.
- [x] Create tasks.md.
- [x] Update feature_list.json.
- [ ] Update progress/current.md.
- [ ] Append progress/history.md.

## Approval gate

Required human approval phrase before implementation:

```txt
Approved: 001-dashboard-evidence-first-ux-refinement for implementation in SHIP mode.
```

## Implementation tasks after approval

- [ ] Confirm local branch and clean status.
- [ ] Re-read source of truth files.
- [ ] Refine `src/app/dashboard/page.tsx` hierarchy and scope copy.
- [ ] Replace placeholder metric card in `src/components/dashboard/dashboard-metrics.tsx`.
- [ ] Improve `src/components/dashboard/expense-chart.tsx` empty/error state copy without changing query semantics.
- [ ] Align `src/components/dashboard/dashboard-skeleton.tsx` with final layout.
- [ ] Add or update tests only if the existing test setup supports dashboard rendering.

## Review tasks after implementation

- [ ] Verify changed files are inside approved scope.
- [ ] Verify no package/env/migration/auth/AI files changed.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Produce review notes.
- [ ] Move feature to done only after successful review.
