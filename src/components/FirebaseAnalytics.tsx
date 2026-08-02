"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "../services/firebase/config";

export function FirebaseAnalytics() {
  useEffect(() => {
    void initializeFirebaseAnalytics().catch((error: unknown) => {
      // Analytics is optional; keep the app usable if it is unavailable.
      console.warn("Firebase Analytics could not be initialized.", error);
    });
  }, []);

  return null;
}
