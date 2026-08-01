const fs = require('fs');

const firebaseSource = fs.readFileSync('src/firebase.ts', 'utf8');
const envExample = fs.readFileSync('.env.example', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');

const requiredKeys = Array.from(firebaseSource.matchAll(/process\.env\.(NEXT_PUBLIC_FIREBASE_[A-Z0-9_]+)/g)).map((match) => match[1]);
const uniqueRequiredKeys = [...new Set(requiredKeys)].sort();
const envKeys = envExample
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split('=')[0])
  .sort();

const failures = [];

for (const key of uniqueRequiredKeys) {
  if (!envKeys.includes(key)) {
    failures.push(`.env.example is missing ${key}`);
  }
}

for (const key of envKeys) {
  if (key.startsWith('NEXT_PUBLIC_FIREBASE_') && !uniqueRequiredKeys.includes(key)) {
    failures.push(`.env.example includes unused Firebase key ${key}`);
  }
}

if (!readme.includes('cp .env.example .env.local')) {
  failures.push('README.md must document copying .env.example to .env.local');
}

if (!envExample.includes('do not place private service account credentials here')) {
  failures.push('.env.example must warn against private service account credentials');
}

if (failures.length > 0) {
  console.error('015 environment contract verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('015 environment contract verification passed.');
