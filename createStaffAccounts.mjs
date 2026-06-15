import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCWrjqU7ZqhBIiGuzOQ9755EJ2TsKZ5jMM",
  authDomain: "gorets-2cfda.firebaseapp.com",
  projectId: "gorets-2cfda",
  storageBucket: "gorets-2cfda.firebasestorage.app",
  messagingSenderId: "828605157406",
  appId: "1:828605157406:web:649687db1346f4b7845e0f",
  databaseURL: "https://gorets-2cfda-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const staffAccounts = [
  { email: 'gorets@admin.com',   password: 'Admin@123',   name: 'Store Admin',    role: 'admin',   phone: '0000000001' },
  { email: 'kitchen@gorets.com', password: 'Kitchen@123', name: 'Kitchen Staff',  role: 'kitchen', phone: '0000000002' },
  { email: 'driver@gorets.com',  password: 'Driver@123',  name: 'Delivery Driver',role: 'driver',  phone: '0000000003' },
];

async function createOrGetUid(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`  ⚠️  ${email} already exists, signing in to get UID...`);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user.uid;
    }
    throw err;
  }
}

async function main() {
  console.log('\n🚀 Creating Goret\'s Staff Accounts...\n');

  for (const account of staffAccounts) {
    try {
      console.log(`Creating [${account.role.toUpperCase()}] ${account.email}...`);
      const uid = await createOrGetUid(account.email, account.password);

      await set(ref(db, 'users/' + uid), {
        name: account.name,
        phone: account.phone,
        role: account.role,
        email: account.email,
      });

      console.log(`  ✅ Done! UID: ${uid}`);
    } catch (err) {
      console.error(`  ❌ Failed for ${account.email}: ${err.message}`);
    }
  }

  console.log('\n✅ All done! Use these credentials to log in:\n');
  console.log('  ADMIN   → gorets@admin.com    / Admin@123');
  console.log('  KITCHEN → kitchen@gorets.com  / Kitchen@123');
  console.log('  DRIVER  → driver@gorets.com   / Driver@123');
  console.log('\nYou can change these passwords in Firebase Console → Authentication.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
