"use client";

import { useEffect } from "react";
import { initializeAnalytics } from "../lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    void initializeAnalytics().catch((error: unknown) => {
      // Analytics is optional; keep the app usable if it is unavailable.
      console.warn("Firebase Analytics could not be initialized.", error);
    });
  }, []);

  return null;
}
