const fs = require('fs');
const { spawnSync } = require('child_process');

const result = spawnSync('npm', ['audit', '--json'], {
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 30,
});

if (!result.stdout) {
  console.error('017 audit triage failed: npm audit produced no JSON output.');
  process.exit(1);
}

let audit;
try {
  audit = JSON.parse(result.stdout);
} catch (error) {
  console.error('017 audit triage failed: npm audit output was not valid JSON.');
  console.error(error.message);
  process.exit(1);
}

const vulnerabilities = audit.vulnerabilities || {};
const summary = audit.metadata?.vulnerabilities || {};
const highPackages = [];
const unsafeFixes = [];
const safeFixAvailable = [];

for (const [name, vulnerability] of Object.entries(vulnerabilities)) {
  const via = Array.isArray(vulnerability.via) ? vulnerability.via : [];
  const advisorySeverities = via
    .filter((item) => item && typeof item === 'object')
    .map((item) => item.severity)
    .filter(Boolean);
  const isHigh = vulnerability.severity === 'high' || advisorySeverities.includes('high');

  if (!isHigh) {
    continue;
  }

  const fix = vulnerability.fixAvailable;
  const fixInfo = typeof fix === 'object' && fix !== null ? fix : null;
  const isUnsafe = fixInfo?.isSemVerMajor === true || (name === 'next' && fixInfo?.version && fixInfo.version.startsWith('9.'));

  const entry = {
    name,
    severity: vulnerability.severity,
    range: vulnerability.range || null,
    effects: vulnerability.effects || [],
    fixAvailable: fix,
    advisoryTitles: via
      .filter((item) => item && typeof item === 'object')
      .map((item) => item.title),
  };

  highPackages.push(entry);

  if (isUnsafe) {
    unsafeFixes.push({
      name,
      reason: fixInfo?.isSemVerMajor === true ? 'semver-major fix required' : 'audit suggests unsafe Next downgrade',
      fixAvailable: fix,
    });
  } else if (fix === true || fixInfo) {
    safeFixAvailable.push({ name, fixAvailable: fix });
  }
}

const report = {
  generatedBy: 'scripts/verify-017-audit-risk-triage.js',
  summary,
  criticalGate: {
    expected: 0,
    actual: summary.critical ?? 0,
    passed: (summary.critical ?? 0) === 0,
  },
  highPackageCount: highPackages.length,
  highPackages,
  unsafeFixes,
  safeFixAvailable,
};

fs.writeFileSync('progress/audit-017-risk-triage.json', JSON.stringify(report, null, 2) + '\n');

if (!report.criticalGate.passed) {
  console.error(`017 audit triage failed: expected 0 critical vulnerabilities, found ${report.criticalGate.actual}.`);
  process.exit(1);
}

if (highPackages.length === 0) {
  console.error('017 audit triage failed: expected residual high findings to triage, found none.');
  process.exit(1);
}

console.log('017 audit risk triage verification passed.');
console.log(`017 high package count: ${highPackages.length}`);
console.log(`017 unsafe fix count: ${unsafeFixes.length}`);
console.log(`017 safe fix available count: ${safeFixAvailable.length}`);
