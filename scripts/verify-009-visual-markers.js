const fs = require('fs');
const path = require('path');

const root = process.cwd();

const checks = [
  {
    file: 'src/app/login/page.tsx',
    markers: ['fixed inset-0', 'LoginForm'],
  },
  {
    file: 'src/components/auth/login-form.tsx',
    markers: [
      'admin-shell-free-auth',
      'budgetflow-motion-shell',
      'financial-cockpit',
      'glass-panel',
      'Premium savings cockpit',
    ],
  },
  {
    file: 'src/app/dashboard/page.tsx',
    markers: ['budgetflow-motion-shell', 'scroll-story', 'financial-cockpit', 'app-preview-focus'],
  },
  {
    file: 'src/app/transactions/page.tsx',
    markers: ['budgetflow-motion-shell', 'scroll-story', 'financial-cockpit', 'app-preview-focus'],
  },
  {
    file: 'src/app/reports/page.tsx',
    markers: ['budgetflow-motion-shell', 'scroll-story', 'financial-cockpit', 'app-preview-focus'],
  },
  {
    file: 'src/app/categories/page.tsx',
    markers: ['budgetflow-motion-shell', 'scroll-story', 'financial-cockpit', 'app-preview-focus'],
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
  console.error('009 visual marker verification failed:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('009 visual marker verification passed.');
