import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkKxoBu0bH4M7tHga7y9F1iJEeB9ksLcE",
  authDomain: "skillflow-4ce08.firebaseapp.com",
  projectId: "skillflow-4ce08",
  storageBucket: "skillflow-4ce08.firebasestorage.app",
  messagingSenderId: "642984362381",
  appId: "1:642984362381:web:6b8a0fa181d6453624bdc4"
};

let auth;
let storage;
let db;

try {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
  
  auth = getAuth(app);
  storage = getStorage(app);
  db = getFirestore(app);

  // Log authentication state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in:', user.uid);
    } else {
      console.log('No user is signed in.');
    }
  });

} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { auth, storage, db };