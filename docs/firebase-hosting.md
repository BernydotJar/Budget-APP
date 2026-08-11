# Firebase Hosting Deployment

BudgetFlow can be deployed to Firebase Hosting for stakeholder walkthroughs and customer-facing review links while keeping the product UI clean. Do not add broad "demo" labeling across the app. Use the Firebase Hosting URL, Firebase project name, and internal deployment notes to identify the environment.

## Why this path

- The app already uses Firebase Auth and Firestore from the browser.
- Firebase Hosting can serve the Next.js application without introducing a VPS for the first review links.
- This keeps operations low-friction for same-day marketing and sales walkthroughs.

## Required Firebase setup

Create or select a Firebase project intended for review/staging use.

Enable these Firebase services:

- Authentication
  - Email/password provider
  - Google provider, if Google sign-in will be shown
- Firestore Database
- Hosting

Use the web app configuration from Firebase Project Settings to populate `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

Required values:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

These are browser public config values. Do not commit `.env.local` and do not place service account credentials in this app.

## Deploy with Firebase Hosting

Install/use Firebase CLI without adding it as a project dependency:

```bash
npx firebase-tools@latest login
npx firebase-tools@latest deploy --only hosting --project <firebase-project-id>
```

For a short-lived review URL, use a preview channel:

```bash
npx firebase-tools@latest hosting:channel:deploy marketing-review --expires 7d --project <firebase-project-id>
```

## Notes for today's walkthrough

- Use the Firebase Hosting URL as the environment signal.
- Avoid adding "demo" banners or labels throughout the app UI.
- Keep real Firebase Auth and Firestore enabled so login, starter data, categories, transactions, and reports can be exercised.
- Seed behavior is already handled for email/password sign-up and new Google sign-in users.

## Validation

Before deploy, run:

```bash
node scripts/verify-018-firebase-hosting-readiness.js
rm -rf .next && npm run typecheck && npm run build
```
