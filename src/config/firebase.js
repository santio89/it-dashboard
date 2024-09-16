import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_DB_API_KEY,
  authDomain: import.meta.env.VITE_DB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_DB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_DB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_DB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_DB_APP_ID
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(firebaseApp)
export const firebaseDb = getFirestore(firebaseApp)
export const timestamp = serverTimestamp()
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseGoogleProvider = new GoogleAuthProvider();
export const firebaseSignInWithPopup = signInWithPopup
export const firebaseSignOut = signOut
export const firebaseSetPersistance = setPersistence
export const firebaseBrowserLocalPersistence = browserLocalPersistence
export const firebaseOnAuthStateChanged = onAuthStateChanged