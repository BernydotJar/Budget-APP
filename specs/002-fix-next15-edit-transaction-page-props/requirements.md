# 002-fix-next15-edit-transaction-page-props Requirements

Feature: Fix Next 15 Edit Transaction Page Props
Codename: Typed Route
Mode: SHIP
Status: spec_ready

## Problem

`npm run typecheck` fails on the generated Next.js type check for the dynamic edit transaction route:

```txt
.next/types/app/transactions/edit/[id]/page.ts:34:29 - error TS2344: Type 'EditTransactionPageProps' does not satisfy the constraint 'PageProps'.
Types of property 'params' are incompatible.
Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

This is a compatibility issue with Next.js 15 page prop typing for dynamic route params.

## Goal

Update the edit transaction page prop typing so the route satisfies Next.js 15's generated `PageProps` contract.

## Scope

Allowed after approval:

- Inspect `src/app/transactions/edit/[id]/page.tsx`.
- Update only the page prop typing and param access required by Next.js 15.
- Preserve existing edit transaction behavior.

## Non-goals

- Do not redesign transaction forms.
- Do not change Firestore schema.
- Do not change transaction validation rules.
- Do not change auth behavior.
- Do not touch package files.
- Do not address unrelated typecheck failures in this feature.

## Acceptance Criteria

1. The generated Next.js PageProps error for `/transactions/edit/[id]` is resolved.
2. The edit transaction route still receives the same `id` value.
3. No transaction business logic changes are introduced.
4. No package/env/Firebase/auth/schema/AI files are changed.
5. Feature-specific validation target: `npm run typecheck` should no longer report the edit transaction PageProps error.

## Verification

Run locally:

```bash
npm run typecheck
```

Expected after implementation: the `/transactions/edit/[id]` PageProps error is gone. Other existing baseline type errors may remain and must be documented separately.
