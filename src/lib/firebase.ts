import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const missingValues = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingValues.length) {
  throw new Error(`Missing Firebase configuration: ${missingValues.join(", ")}`);
}

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

/** Analytics is browser-only; calling this on the server safely returns null. */
export async function initializeAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !(await isSupported())) return null;

  return getAnalytics(firebaseApp);
}
