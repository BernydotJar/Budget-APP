const fs = require('fs');
const path = require('path');

const sourcePath = path.join(process.cwd(), 'src/components/auth/login-form.tsx');
const source = fs.readFileSync(sourcePath, 'utf8');

const requiredMarkers = [
  "getAdditionalUserInfo",
  "const userCredential = await signInWithPopup(auth, provider);",
  "const isNewGoogleUser = getAdditionalUserInfo(userCredential)?.isNewUser === true;",
  "if (isNewGoogleUser)",
  "await addDummyData(userCredential.user.uid);",
  "Adding sample data for your new workspace...",
  "toast({ title: 'Google Sign-In Successful', description: 'Welcome!' });",
  "router.push('/dashboard');",
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length > 0) {
  console.error('012 Google seed parity verification failed:');
  for (const marker of missing) {
    console.error(`- missing marker: ${marker}`);
  }
  process.exit(1);
}

if (source.includes('For simplicity, we\'ll skip that for Google Sign-In for now.')) {
  console.error('012 Google seed parity verification failed: legacy Google seed skip comment is still present.');
  process.exit(1);
}

const googleHandlerStart = source.indexOf('const handleGoogleSignIn = async () => {');
const googleHandlerEnd = source.indexOf('  const toggleMode = () => {');

if (googleHandlerStart === -1 || googleHandlerEnd === -1 || googleHandlerEnd <= googleHandlerStart) {
  console.error('012 Google seed parity verification failed: could not isolate Google sign-in handler.');
  process.exit(1);
}

const googleHandler = source.slice(googleHandlerStart, googleHandlerEnd);

if (!googleHandler.includes('if (isNewGoogleUser)')) {
  console.error('012 Google seed parity verification failed: Google starter data is not guarded by new-user detection.');
  process.exit(1);
}

if (!googleHandler.includes('await addDummyData(userCredential.user.uid);')) {
  console.error('012 Google seed parity verification failed: Google first-run seed call is missing.');
  process.exit(1);
}

if (googleHandler.indexOf('await addDummyData(userCredential.user.uid);') < googleHandler.indexOf('if (isNewGoogleUser)')) {
  console.error('012 Google seed parity verification failed: Google seed call appears before the new-user guard.');
  process.exit(1);
}

console.log('012 Google seed parity verification passed.');
