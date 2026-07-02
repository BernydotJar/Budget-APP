# 002-fix-next15-edit-transaction-page-props Tasks

Feature: Fix Next 15 Edit Transaction Page Props
Codename: Typed Route
Mode: SHIP
Status: spec_ready

## Spec gate

- [x] Capture validation failure from local `npm run typecheck`.
- [x] Create requirements.md.
- [x] Create design.md.
- [x] Create tasks.md.
- [x] Update feature_list.json.
- [ ] Update progress/current.md.
- [ ] Append progress/history.md.

## Approval gate

Required human approval phrase before implementation:

```txt
Approved: 002-fix-next15-edit-transaction-page-props for implementation in SHIP mode.
```

## Implementation tasks after approval

- [ ] Inspect `src/app/transactions/edit/[id]/page.tsx`.
- [ ] Update dynamic route props to satisfy Next.js 15 PageProps.
- [ ] Preserve the same transaction `id` value passed to the edit UI.
- [ ] Avoid changing transaction business logic.

## Review tasks after implementation

- [ ] Verify changed files are inside approved scope.
- [ ] Verify no package/env/Firebase/auth/schema/AI files changed.
- [ ] Run `npm run typecheck`.
- [ ] Confirm `/transactions/edit/[id]` PageProps error is gone.
- [ ] Document any remaining unrelated baseline errors.
