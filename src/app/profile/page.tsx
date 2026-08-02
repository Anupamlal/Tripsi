"use client";

import Link from "next/link";
import { type SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import messages from "../../locales/en.json";
import { routes } from "../../routes";
import {
  getUserPreferences,
  sendUserEmailVerification,
  signOutUser,
  type UserPreferences,
  saveUserPreferences,
  subscribeToAuthChanges,
  updateUserProfile,
} from "../../services/firebase/auth";
import { type User } from "firebase/auth";
import styles from "./profile.module.css";

const { common, profile } = messages;
const preferencesKey = "tripsi-travel-preferences";

const emptyPreferences: UserPreferences = {
  travelStyle: profile.travelStyleOptions[0],
  budget: profile.budgetOptions[0],
  departureCity: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [displayName, setDisplayName] = useState("");
  const [preferences, setPreferences] =
    useState<UserPreferences>(emptyPreferences);
  const [profileMessage, setProfileMessage] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
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
    async function loadPreferences() {
      if (!user?.email) return;

      const savedPreferences = window.localStorage.getItem(preferencesKey);
      if (savedPreferences) {
        try {
          setPreferences({
            ...emptyPreferences,
            ...JSON.parse(savedPreferences),
          });
          return;
        } catch {
          window.localStorage.removeItem(preferencesKey);
        }
      }

      try {
        const remotePreferences = await getUserPreferences(user.email);
        if (!remotePreferences) return;

        const mergedPreferences = { ...emptyPreferences, ...remotePreferences };
        setPreferences(mergedPreferences);
        window.localStorage.setItem(
          preferencesKey,
          JSON.stringify(mergedPreferences)
        );
      } catch {
        setPreferences(emptyPreferences);
      }
    }

    void loadPreferences();
  }, [user?.email]);

  async function saveProfile(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setProfileMessage("");
    setIsSaving(true);
    try {
      await updateUserProfile(user, { displayName: displayName.trim() });
      setProfileMessage(profile.saved);
    } catch {
      setProfileMessage(profile.errors.save);
    } finally {
      setIsSaving(false);
    }
  }

  async function savePreferences(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.email) return;

    try {
      window.localStorage.setItem(preferencesKey, JSON.stringify(preferences));
      await saveUserPreferences(user.email, preferences);
      setPreferencesMessage(profile.preferencesSaved);
    } catch {
      setPreferencesMessage(profile.errors.save);
    }
  }

  async function handleSignOut() {
    await signOutUser();
    router.replace(routes.home);
  }

  async function handleVerifyEmail() {
    if (!user || user.emailVerified) return;

    setVerificationMessage("");
    setIsSendingVerification(true);
    try {
      await sendUserEmailVerification(user);
      setVerificationMessage(profile.verificationSent);
    } catch {
      setVerificationMessage(profile.errors.verification);
    } finally {
      setIsSendingVerification(false);
    }
  }

  if (!user)
    return <main className={styles.profileLoading}>{profile.loading}</main>;

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
          <div className={styles.verificationRow}>
            <span
              className={`${styles.verification} ${
                user.emailVerified ? styles.verified : ""
              }`}
            >
              {user.emailVerified ? profile.verified : profile.notVerified}
            </span>
            {!user.emailVerified && (
              <button
                className={styles.verifyEmail}
                type="button"
                onClick={handleVerifyEmail}
                disabled={isSendingVerification}
              >
                {isSendingVerification
                  ? profile.sendingVerification
                  : profile.verifyEmail}
              </button>
            )}
          </div>
          {verificationMessage && (
            <p className="profile-message" role="status">
              {verificationMessage}
            </p>
          )}
          <dl>
            <div>
              <dt>{profile.memberSince}</dt>
              <dd>{createdAt}</dd>
            </div>
          </dl>
          <button
            className={styles.signOut}
            type="button"
            onClick={handleSignOut}
          >
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
                <p className="profile-message" role="status">
                  {profileMessage}
                </p>
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
                <p className="profile-message" role="status">
                  {preferencesMessage}
                </p>
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
