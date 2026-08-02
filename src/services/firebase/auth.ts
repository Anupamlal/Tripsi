import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type NextOrObserver,
  type User,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { firebaseApp, getFirebaseDatabase } from "./config";

const auth = getAuth(firebaseApp);

export type UserPreferences = {
  travelStyle: string;
  budget: string;
  departureCity: string;
};

function sanitizeEmailForPath(email: string) {
  return email.replaceAll(".", ",");
}

function getUserRootPath(email: string) {
  return `Users/${sanitizeEmailForPath(email)}`;
}

export function subscribeToAuthChanges(nextOrObserver: NextOrObserver<User>) {
  return onAuthStateChanged(auth, nextOrObserver);
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  preferences?: UserPreferences;
}) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    params.email,
    params.password,
  );
  const displayName = [params.firstName, params.lastName].filter(Boolean).join(" ");

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  const memberSince = credential.user.metadata.creationTime ?? new Date().toISOString();
  await Promise.all([
    set(ref(getFirebaseDatabase(), `${getUserRootPath(params.email)}/UserInfo`), {
      name: displayName,
      email: params.email,
      memberSince,
    }),
    set(ref(getFirebaseDatabase(), `${getUserRootPath(params.email)}/Preferences`), {
      travelStyle: params.preferences?.travelStyle ?? "",
      budget: params.preferences?.budget ?? "",
      departureCity: params.preferences?.departureCity ?? "",
    }),
  ]);

  return credential;
}

export async function updateUserProfile(user: User, profile: { displayName?: string | null }) {
  await updateProfile(user, profile);
}

export async function signOutUser() {
  await signOut(auth);
}

export async function sendUserEmailVerification(user: User) {
  await sendEmailVerification(user);
}

export async function saveUserPreferences(email: string, preferences: UserPreferences) {
  await set(ref(getFirebaseDatabase(), `${getUserRootPath(email)}/Preferences`), preferences);
}

export async function getUserPreferences(email: string): Promise<Partial<UserPreferences> | null> {
  const snapshot = await get(ref(getFirebaseDatabase(), `${getUserRootPath(email)}/Preferences`));
  return snapshot.exists() ? (snapshot.val() as Partial<UserPreferences>) : null;
}
