import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let firestore: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseFirestore(): Firestore | null {
  if (firestore) return firestore;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (Object.values(config).some((value) => !value)) return null;

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  firestore = getFirestore(app);
  return firestore;
}

export async function ensureFirebaseAuth(): Promise<Firestore | null> {
  const db = getFirebaseFirestore();
  if (!db) return null;

  auth ??= getAuth();
  if (!auth.currentUser) await signInAnonymously(auth);
  return db;
}