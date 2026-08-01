# Firebase Studio

This is a NextJS Project

To get started, take a look at src/app/page.tsx.

## Local environment

BudgetFlow requires Firebase Web App public configuration at build/runtime. Copy the committed example file and replace placeholders with values from Firebase Project Settings -> General -> Web app SDK config.

```bash
cp .env.example .env.local
```

Required keys:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

These `NEXT_PUBLIC_*` values are public browser configuration. Do not place Firebase Admin SDK private keys or service account credentials in `.env.local`.

Validate the environment contract with:

```bash
node scripts/verify-015-env-contract.js
```

