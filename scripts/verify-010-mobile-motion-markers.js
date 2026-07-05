const fs = require('fs');
const path = require('path');

const root = process.cwd();

const checks = [
  {
    file: 'src/app/layout.tsx',
    markers: [
      'premium-top-dock',
      'mobile-safe-nav-scroll',
      'sm:px-5',
      'lg:px-6',
      'Premium savings cockpit',
    ],
  },
  {
    file: 'src/components/main-nav.tsx',
    markers: [
      'premium-shell-nav-wrap',
      'premium-shell-chips',
      'mobile-safe-nav-scroll',
      'snap-x',
      'data-motion-delay',
      'Primary budget workspace navigation',
    ],
  },
  {
    file: 'src/app/globals.css',
    markers: [
      'mobile-safe-nav-scroll',
      'premium-shell-nav-wrap::after',
      'responsive-cinema-title',
      'responsive-cinema-section',
      'responsive-cinema-copy',
      'budgetflow-rise-in',
      'budgetflow-scan',
      'prefers-reduced-motion',
    ],
  },
];

const missing = [];

for (const check of checks) {
  const fullPath = path.join(root, check.file);
  const source = fs.readFileSync(fullPath, 'utf8');

  for (const marker of check.markers) {
    if (!source.includes(marker)) {
      missing.push(`${check.file}: missing ${marker}`);
    }
  }
}

if (missing.length > 0) {
  console.error('010 mobile motion marker verification failed:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('010 mobile motion marker verification passed.');
