import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

async function createAccounts() {
  console.log("Creating admin and kitchen accounts...");
  
  try {
    await createUserWithEmailAndPassword(auth, "gorets@admin.com", "admin@goretscafe");
    console.log("✅ Admin account created: gorets@admin.com");
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log("⚠️ Admin account already exists!");
    } else {
      console.error("❌ Failed to create Admin account:", err.message);
    }
  }

  try {
    await createUserWithEmailAndPassword(auth, "kitchen@gorets.com", "kitchen@goretscafe");
    console.log("✅ Kitchen account created: kitchen@gorets.com");
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log("⚠️ Kitchen account already exists!");
    } else {
      console.error("❌ Failed to create Kitchen account:", err.message);
    }
  }
  
  process.exit(0);
}

createAccounts();
