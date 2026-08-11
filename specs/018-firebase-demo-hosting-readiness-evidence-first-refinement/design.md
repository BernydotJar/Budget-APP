# 018 Firebase Demo Hosting Readiness Design

Feature: 018-firebase-demo-hosting-readiness-evidence-first-refinement
Codename: Launch Pad
Mode: SHIP
Status: done

## Design decision

Use Firebase Hosting framework-aware configuration for the current Next.js app instead of forcing a static export today.

Reason:

- The app has a dynamic authenticated edit route: `/transactions/edit/[id]`.
- Converting to static export immediately risks breaking URL refresh and edit flows.
- Marketing needs a same-day review link more than a deeper static-routing refactor.

## Implementation shape

- `firebase.json` uses `hosting.source = "."`.
- No `.firebaserc` is committed, so deploys must supply `--project <firebase-project-id>` or use a local Firebase alias.
- `docs/firebase-hosting.md` gives direct deployment and preview-channel commands.
- `scripts/verify-018-firebase-hosting-readiness.js` verifies the hosting config, docs markers, CI inclusion, and absence of broad demo-label phrases in UI source.

## UI policy

Do not add app-wide "demo" banners or labels. The Firebase URL, Firebase project name, and internal deployment notes identify the environment. A future product decision can add minimal environment copy on the landing page only, but that is explicitly out of scope for this hot path.

## Validation

- node scripts/verify-018-firebase-hosting-readiness.js
- rm -rf .next && npm run typecheck && npm run build
