# 002-fix-next15-edit-transaction-page-props Design

Feature: Fix Next 15 Edit Transaction Page Props
Codename: Typed Route
Mode: SHIP
Status: spec_ready

## Current Failure

The generated `.next/types` check expects the page component props to satisfy Next.js 15's dynamic route PageProps contract. The current page likely types `params` as a plain object:

```ts
{ params: { id: string } }
```

Next.js 15 may type dynamic route params as a Promise in generated page checks.

## Proposed Fix

After approval, inspect:

```txt
src/app/transactions/edit/[id]/page.tsx
```

Then update the page props to match the framework contract. The expected implementation pattern is:

```ts
interface EditTransactionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params;
  // preserve existing render behavior
}
```

If the existing page is a client component, use a minimal wrapper strategy that preserves client behavior while satisfying the server page prop contract.

## Constraints

- Keep the route path unchanged.
- Keep the transaction id semantics unchanged.
- Do not change transaction form internals in this feature.
- Do not change package files.
- Do not introduce new dependencies.
- Do not change Firebase, auth, schema, or AI files.

## Review Focus

- Does the route still pass the same `id` to the edit transaction UI?
- Is the change limited to the dynamic page prop typing/wrapper?
- Is the generated Next.js PageProps error removed from `npm run typecheck`?
- Are unrelated baseline errors documented instead of mixed into this feature?
