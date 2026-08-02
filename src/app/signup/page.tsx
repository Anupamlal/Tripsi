"use client";

import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import messages from "../../locales/en.json";
import { routes } from "../../routes";
import { signUpWithEmail } from "../../services/firebase/auth";
import styles from "../login/auth.module.css";
import signupStyles from "./signup.module.css";

const { common, signup } = messages;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (password.length < 8) {
      setError(signup.errors.shortPassword);
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail({ email, password, firstName, lastName });
      router.push(routes.home);
    } catch (signUpError: unknown) {
      const code = (signUpError as { code?: string }).code;
      const messages: Record<string, string> = {
        "auth/email-already-in-use": signup.errors.emailInUse,
        "auth/invalid-email": signup.errors.invalidEmail,
        "auth/weak-password": signup.errors.weakPassword,
        "auth/operation-not-allowed": signup.errors.operationNotAllowed,
      };
      setError(messages[code ?? ""] ?? signup.errors.generic);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={`${styles.authPage} ${signupStyles.signupPage}`}>
      <section className={styles.authAside}>
        <Link className="brand" href={routes.home}>
          <span className="brand-mark">✦</span> {common.brand}
        </Link>
        <div className={styles.authAsideCopy}>
          <p className="eyebrow">
            <span /> {signup.eyebrow}
          </p>
          <h1>
            {signup.asideTitle}
            <br />
            <em>{signup.asideTitleEmphasis}</em>
          </h1>
          <p>{signup.asideDescription}</p>
        </div>
        <div className={styles.asideLandscape}>
          <div className={styles.asideSun} />
          <div className={styles.asideMountain} />
          <div className={styles.asideWater} />
        </div>
      </section>
      <section className={styles.authPanel}>
        <div className={styles.authCard}>
          <p className={styles.authKicker}>{signup.kicker}</p>
          <h2>{signup.title}</h2>
          <p className={styles.authSubtitle}>{signup.subtitle}</p>
          <form className={styles.authForm} onSubmit={handleSignUp}>
            <div className={styles.nameFields}>
              <label>
                {signup.firstName}
                <input name="firstName" type="text" placeholder={signup.firstNamePlaceholder} autoComplete="given-name" required />
              </label>
              <label>
                {signup.lastName}
                <input name="lastName" type="text" placeholder={signup.lastNamePlaceholder} autoComplete="family-name" />
              </label>
            </div>
            <label>
              {signup.email}
              <input name="email" type="email" placeholder={signup.emailPlaceholder} autoComplete="email" required />
            </label>
            <label>
              {signup.password}
              <input name="password" type="password" placeholder={signup.passwordPlaceholder} autoComplete="new-password" minLength={8} required />
            </label>
            <label className={styles.terms}>
              <input type="checkbox" required /> {signup.termsStart} <a href="#terms">{signup.terms}</a> {signup.termsJoiner}{" "}
              <a href="#privacy">{signup.privacy}</a>.
            </label>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button className={styles.authSubmit} type="submit" disabled={isLoading}>
              {isLoading ? signup.submitting : signup.submit} <span>{common.arrow}</span>
            </button>
          </form>
          <p className={styles.authSwitch}>
            {signup.existingAccount}{" "}
            <Link href={routes.login}>
              {signup.login} <span>{common.arrow}</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
