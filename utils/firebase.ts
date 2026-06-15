import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCWrjqU7ZqhBIiGuzOQ9755EJ2TsKZ5jMM",
  authDomain: "gorets-2cfda.firebaseapp.com",
  projectId: "gorets-2cfda",
  storageBucket: "gorets-2cfda.firebasestorage.app",
  messagingSenderId: "828605157406",
  appId: "1:828605157406:web:649687db1346f4b7845e0f",
  databaseURL: "https://gorets-2cfda-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

// Initialize compat app for expo-firebase-recaptcha on Web
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = getDatabase(app);
