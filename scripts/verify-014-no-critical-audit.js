const fs = require('fs');
const { spawnSync } = require('child_process');

const result = spawnSync('npm', ['audit', '--audit-level=critical', '--json'], {
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 20,
});

const stdout = result.stdout || '{}';
let audit;
try {
  audit = JSON.parse(stdout);
} catch (error) {
  console.error('014 audit verification failed: npm audit did not return JSON.');
  console.error(error.message);
  process.exit(1);
}

const criticalCount = audit.metadata?.vulnerabilities?.critical ?? 0;
if (criticalCount !== 0) {
  console.error(`014 audit verification failed: expected 0 critical vulnerabilities, found ${criticalCount}.`);
  process.exit(1);
}

fs.writeFileSync('progress/audit-014-critical.json', JSON.stringify({
  generatedBy: 'scripts/verify-014-no-critical-audit.js',
  critical: criticalCount,
  vulnerabilities: audit.metadata?.vulnerabilities ?? null,
}, null, 2) + '\n');

console.log('014 no critical audit verification passed.');
