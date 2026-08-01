const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

const expectedNextVersion = '15.5.22';
const actualNextVersion = pkg.dependencies && pkg.dependencies.next;

const failures = [];

if (actualNextVersion !== expectedNextVersion) {
  failures.push(`package.json next expected ${expectedNextVersion} but found ${actualNextVersion}`);
}

if (!lock.packages || !lock.packages[''] || lock.packages[''].dependencies.next !== expectedNextVersion) {
  failures.push(`package-lock root next dependency expected ${expectedNextVersion}`);
}

if (!lock.packages || !lock.packages['node_modules/next'] || lock.packages['node_modules/next'].version !== expectedNextVersion) {
  failures.push(`package-lock node_modules/next expected ${expectedNextVersion}`);
}

if (failures.length > 0) {
  console.error('013 Next security patch verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('013 Next security patch verification passed.');
