"use client";

import Link from "next/link";
import messages from "../../locales/en.json";
import { routes } from "../../routes";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseApp } from "../../lib/firebase";
import styles from "./auth.module.css";

const { common, login } = messages;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (password.length < 8) {
      setError(login.errors.shortPassword);
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);
      if (userCredential.user) {
        router.push(routes.home);
      } else {
        setError(login.errors.invalidEmailOrPassword);
      }
    } catch (loginError: unknown) {
      const code = (loginError as { code?: string }).code;
      const messages: Record<string, string> = {
        "auth/email-already-in-use": login.errors.emailInUse,
        "auth/invalid-email": login.errors.invalidEmail,
        "auth/weak-password": login.errors.weakPassword,
        "auth/operation-not-allowed": login.errors.operationNotAllowed,
      };
      setError(messages[code ?? ""] ?? login.errors.invalidEmailOrPassword);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authAside}>
        <Link className="brand" href={routes.home}>
          <span className="brand-mark">✦</span> {common.brand}
        </Link>
        <div className={styles.authAsideCopy}>
          <p className="eyebrow">
            <span /> {login.eyebrow}
          </p>
          <h1>
            {login.asideTitle}
            <br />
            <em>{login.asideTitleEmphasis}</em>
          </h1>
          <p>{login.asideDescription}</p>
        </div>
        <div className={styles.asideLandscape}>
          <div className={styles.asideSun} />
          <div className={styles.asideMountain} />
          <div className={styles.asideWater} />
        </div>
      </section>
      <section className={styles.authPanel}>
        <div className={styles.authCard}>
          <p className={styles.authKicker}>{login.kicker}</p>
          <h2>{login.title}</h2>
          <p className={styles.authSubtitle}>{login.subtitle}</p>
          <form className={styles.authForm} method="post" onSubmit={handleLogin}>
            <label>
              {login.email}
              <input type="email" name="email" placeholder={login.emailPlaceholder} autoComplete="email" required />
            </label>
            <label>
              {login.password}
              <input
                type="password"
                name="password"
                placeholder={login.passwordPlaceholder}
                autoComplete="current-password"
                required
                minLength={8}
              />
            </label>
            <div className={styles.authOptions}>
              <label className={styles.remember}>
                <input type="checkbox" /> {login.rememberMe}
              </label>
              <a href="#reset">{login.forgotPassword}</a>
            </div>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button className={styles.authSubmit} type="submit" disabled={isLoading}>
              {isLoading ? login.submitting : login.submit}
              <span>{common.arrow}</span>
            </button>
          </form>
          <div className={styles.authDivider}>
            <span>{login.divider}</span>
          </div>
          <div className={styles.socialButtons}>
            <button type="button">
              <b>G</b> {login.google}
            </button>
          </div>
          <p className={styles.authSwitch}>
            {login.newToTripsi}{" "}
            <Link href={routes.signUp}>
              {login.createAccount} <span>{common.arrow}</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
