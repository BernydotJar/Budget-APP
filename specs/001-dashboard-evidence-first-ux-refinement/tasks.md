# 001-dashboard-evidence-first-ux-refinement Tasks

Feature: Dashboard Evidence-First UX Refinement
Codename: Silver Ledger
Mode: SHIP
Status: review

## Spec gate

- [x] Inspect repository entry points.
- [x] Confirm dashboard files and current behavior.
- [x] Create requirements.md.
- [x] Create design.md.
- [x] Create tasks.md.
- [x] Update feature_list.json.
- [x] Update progress/current.md.
- [x] Append progress/history.md.

## Approval gate

Approval received:

```txt
Approved: 001-dashboard-evidence-first-ux-refinement for implementation in SHIP mode.
```

## Implementation tasks after approval

- [x] Confirm local branch and clean status.
- [x] Re-read source of truth files.
- [x] Refine `src/app/dashboard/page.tsx` hierarchy and scope copy.
- [x] Replace placeholder metric card in `src/components/dashboard/dashboard-metrics.tsx`.
- [x] Improve `src/components/dashboard/expense-chart.tsx` empty/error state copy without changing query semantics.
- [x] Align `src/components/dashboard/dashboard-skeleton.tsx` with final layout.
- [x] Add or update tests only if the existing test setup supports dashboard rendering. No test script exists in package.json, so no tests were added in this pass.

## Review tasks after implementation

- [x] Verify changed files are inside approved scope.
- [x] Verify no package/env/migration/auth/AI files changed.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Produce review notes.
- [ ] Move feature to done only after successful review.
