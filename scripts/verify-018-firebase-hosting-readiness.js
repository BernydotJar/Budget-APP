const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function fail(message) {
  console.error(`018 Firebase Hosting readiness verification failed: ${message}`);
  process.exit(1);
}

const firebasePath = path.join(root, 'firebase.json');
if (!fs.existsSync(firebasePath)) {
  fail('firebase.json is missing.');
}

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(read('firebase.json'));
} catch (error) {
  fail(`firebase.json is not valid JSON: ${error.message}`);
}

if (!firebaseConfig.hosting) {
  fail('firebase.json must define hosting.');
}

if (firebaseConfig.hosting.source !== '.') {
  fail('hosting.source must be "." so Firebase CLI can deploy the Next.js app without forcing a static export.');
}

if (firebaseConfig.hosting.public === 'out') {
  fail('hosting.public must not be "out" for this hot path because the app still has a dynamic edit route.');
}

const docs = read('docs/firebase-hosting.md');
const requiredDocMarkers = [
  'npx firebase-tools@latest deploy --only hosting --project <firebase-project-id>',
  'hosting:channel:deploy marketing-review --expires 7d --project <firebase-project-id>',
  'Do not add broad "demo" labeling across the app.',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'Firestore Database',
  'Authentication',
];

for (const marker of requiredDocMarkers) {
  if (!docs.includes(marker)) {
    fail(`docs/firebase-hosting.md missing marker: ${marker}`);
  }
}

const nextConfig = read('next.config.ts');
if (nextConfig.includes('output: "export"') || nextConfig.includes("output: 'export'")) {
  fail('next.config.ts must not enable static export until dynamic authenticated routes are explicitly refactored.');
}

const workflow = read('.github/workflows/ci.yml');
if (!workflow.includes('node scripts/verify-018-firebase-hosting-readiness.js')) {
  fail('CI must run the Firebase Hosting readiness verifier.');
}

const sourceDirsToCheck = ['src/app', 'src/components'];
const bannedUiPhrases = ['DEMO MODE', 'Demo Mode', 'demo mode', 'demo banner'];

function walk(dir) {
  const entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(relativePath);
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry.name)) {
      continue;
    }
    const source = read(relativePath);
    for (const phrase of bannedUiPhrases) {
      if (source.includes(phrase)) {
        fail(`broad demo labeling phrase "${phrase}" found in ${relativePath}`);
      }
    }
  }
}

for (const dir of sourceDirsToCheck) {
  walk(dir);
}

console.log('018 Firebase Hosting readiness verification passed.');
