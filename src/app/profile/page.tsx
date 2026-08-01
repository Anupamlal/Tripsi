"use client";

import Link from "next/link";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { type SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firebaseApp } from "../../lib/firebase";
import messages from "../../locales/en.json";
import { routes } from "../../routes";
import styles from "./profile.module.css";

const { common, profile } = messages;
const preferencesKey = "tripsi-travel-preferences";

type Preferences = {
  travelStyle: string;
  budget: string;
  departureCity: string;
};
const emptyPreferences: Preferences = {
  travelStyle: profile.travelStyleOptions[0],
  budget: profile.budgetOptions[0],
  departureCity: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [displayName, setDisplayName] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(emptyPreferences);
  const [profileMessage, setProfileMessage] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace(routes.login);
        return;
      }
      setUser(currentUser);
      setDisplayName(currentUser.displayName ?? "");
    });
    return unsubscribe;
  }, [router]);

  useEffect(() => {
    const savedPreferences = window.localStorage.getItem(preferencesKey);
    if (!savedPreferences) return;
    try {
      setPreferences({ ...emptyPreferences, ...JSON.parse(savedPreferences) });
    } catch {
      window.localStorage.removeItem(preferencesKey);
    }
  }, []);

  async function saveProfile(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setProfileMessage("");
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      setProfileMessage(profile.saved);
    } catch {
      setProfileMessage(profile.errors.save);
    } finally {
      setIsSaving(false);
    }
  }

  function savePreferences(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(preferencesKey, JSON.stringify(preferences));
    setPreferencesMessage(profile.preferencesSaved);
  }

  async function handleSignOut() {
    await signOut(getAuth(firebaseApp));
    router.replace(routes.home);
  }

  if (!user) return <main className={styles.profileLoading}>{profile.loading}</main>;

  const userName = user.displayName || user.email || common.brand;
  const initial = userName.charAt(0).toUpperCase();
  const createdAt = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "—";

  return (
    <main className={styles.profilePage}>
      <nav className={`${styles.profileNav} shell`}>
        <Link className="brand" href={routes.home}>
          <span className="brand-mark">✦</span> {common.brand}
        </Link>
        <Link className={styles.backLink} href={routes.home}>
          ← {profile.backToExplore}
        </Link>
      </nav>
      <section className={`${styles.profileHero} shell`}>
        <p className="eyebrow">
          <span /> {profile.eyebrow}
        </p>
        <h1>{profile.title}</h1>
        <p>{profile.subtitle}</p>
      </section>
      <section className={`${styles.profileLayout} shell`}>
        <aside className={styles.profileSummary}>
          <div className={styles.profileLargeAvatar}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
            ) : (
              initial
            )}
          </div>
          <h2>{userName}</h2>
          <p>{user.email}</p>
          <span
            className={`${styles.verification} ${user.emailVerified ? styles.verified : ""}`}
          >
            {user.emailVerified ? profile.verified : profile.notVerified}
          </span>
          <dl>
            <div>
              <dt>{profile.memberSince}</dt>
              <dd>{createdAt}</dd>
            </div>
          </dl>
          <button className={styles.signOut} type="button" onClick={handleSignOut}>
            {profile.signOut} <span>↗</span>
          </button>
        </aside>
        <div className={styles.profileContent}>
          <section className={styles.profileCard}>
            <div className={styles.profileCardHeading}>
              <p>{profile.account}</p>
              <h2>{profile.personalDetails}</h2>
              <span>{profile.personalDetailsDescription}</span>
            </div>
            <form className={styles.profileForm} onSubmit={saveProfile}>
              <label>
                {profile.displayName}
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  autoComplete="name"
                />
              </label>
              <label>
                {profile.email}
                <input value={user.email ?? ""} disabled />
                <small>{profile.emailNote}</small>
              </label>
              {profileMessage && (
                <p className="profile-message" role="status">{profileMessage}</p>
              )}
              <button
                className={styles.profileSave}
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? profile.saving : profile.saveProfile}{" "}
                <span>{common.arrow}</span>
              </button>
            </form>
          </section>
          <section className={styles.profileCard}>
            <div className={styles.profileCardHeading}>
              <h2>{profile.preferences}</h2>
              <span>{profile.preferencesDescription}</span>
            </div>
            <form
              className={`${styles.profileForm} ${styles.preferenceForm}`}
              onSubmit={savePreferences}
            >
              <label>
                {profile.travelStyle}
                <select
                  value={preferences.travelStyle}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      travelStyle: event.target.value,
                    })
                  }
                >
                  {profile.travelStyleOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                {profile.budget}
                <select
                  value={preferences.budget}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      budget: event.target.value,
                    })
                  }
                >
                  {profile.budgetOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                {profile.departureCity}
                <input
                  value={preferences.departureCity}
                  placeholder={profile.departurePlaceholder}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      departureCity: event.target.value,
                    })
                  }
                />
              </label>
              {preferencesMessage && (
                <p className="profile-message" role="status">{preferencesMessage}</p>
              )}
              <button className={styles.profileSave} type="submit">
                {profile.savePreferences} <span>{common.arrow}</span>
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
