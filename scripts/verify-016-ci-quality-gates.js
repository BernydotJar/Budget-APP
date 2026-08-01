const fs = require('fs');

const workflowPath = '.github/workflows/ci.yml';
const workflow = fs.readFileSync(workflowPath, 'utf8');

const requiredMarkers = [
  'name: CI Quality Gates',
  'pull_request:',
  'push:',
  'branches:',
  '- main',
  'actions/checkout@v4',
  'actions/setup-node@v4',
  'node-version: 22',
  'cache: npm',
  'npm ci',
  'cp .env.example .env.local',
  'node scripts/verify-015-env-contract.js',
  'node scripts/verify-013-next-security-patch.js',
  'node scripts/verify-011-sample-data-integrity.js',
  'node scripts/verify-012-google-seed-parity.js',
  'node scripts/verify-014-no-critical-audit.js',
  'node scripts/verify-016-ci-quality-gates.js',
  'rm -rf .next',
  'npm run typecheck',
  'npm run build',
];

const failures = requiredMarkers.filter((marker) => !workflow.includes(marker));

if (workflow.includes('secrets.')) {
  failures.push('workflow must not require secrets for verification gates');
}

if (failures.length > 0) {
  console.error('016 CI quality gates verification failed:');
  for (const failure of failures) {
    console.error(`- missing or invalid marker: ${failure}`);
  }
  process.exit(1);
}

console.log('016 CI quality gates verification passed.');
