const fs = require('fs');
const path = require('path');

const sourcePath = path.join(process.cwd(), 'src/components/auth/login-form.tsx');
const source = fs.readFileSync(sourcePath, 'utf8');

const requiredMarkers = [
  'const dummyCategories = [',
  '] as const;',
  'type DummyCategoryName',
  'const categoryDescriptions: Record<DummyCategoryName, string[]>',
  "'Food Delivery': ['Pizza Night', 'Sushi Delivery']",
  'const descriptionList = categoryDescriptions[cat.name];',
  'description: descriptionList[i % descriptionList.length]',
  "collection(db, 'categories')",
  "collection(db, 'transactions')",
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length > 0) {
  console.error('011 sample data integrity verification failed:');
  for (const marker of missing) {
    console.error(`- missing marker: ${marker}`);
  }
  process.exit(1);
}

if (source.includes('FoodDelivery:')) {
  console.error('011 sample data integrity verification failed: legacy FoodDelivery key is still present.');
  process.exit(1);
}

if (source.includes('descriptions[cat.name as keyof typeof descriptions]')) {
  console.error('011 sample data integrity verification failed: unsafe dynamic description lookup is still present.');
  process.exit(1);
}

console.log('011 sample data integrity verification passed.');
