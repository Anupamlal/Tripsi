"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { firebaseApp } from "../../lib/firebase";
import { routes } from "../../routes";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(getAuth(firebaseApp), email, password);
      const displayName = [firstName, lastName].filter(Boolean).join(" ");
      if (displayName) await updateProfile(credential.user, { displayName });
      router.push(routes.home);
    } catch (signUpError: unknown) {
      const code = (signUpError as { code?: string }).code;
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "An account already exists for this email address.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/weak-password": "Choose a stronger password.",
        "auth/operation-not-allowed": "Email/password sign-up is not enabled in Firebase yet.",
      };
      setError(messages[code ?? ""] ?? "We couldn’t create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page signup-page">
      <section className="auth-aside">
        <Link className="brand" href={routes.landingPage}><span className="brand-mark">✦</span> Tripsi</Link>
        <div className="auth-aside-copy">
          <p className="eyebrow"><span /> Start your journey</p>
          <h1>Let&apos;s go<br /><em>somewhere.</em></h1>
          <p>A few details are all we need to start making travel feel effortless.</p>
        </div>
        <div className="aside-landscape"><div className="aside-sun" /><div className="aside-mountain" /><div className="aside-water" /></div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-kicker">CREATE YOUR ACCOUNT</p>
          <h2>Travel starts here</h2>
          <p className="auth-subtitle">Create a free account and make every trip feel more you.</p>
          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="name-fields">
              <label>First name<input name="firstName" type="text" placeholder="Alex" autoComplete="given-name" required /></label>
              <label>Last name<input name="lastName" type="text" placeholder="Morgan" autoComplete="family-name" /></label>
            </div>
            <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Create password<input name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required /></label>
            <label className="terms"><input type="checkbox" required /> I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? "Creating account…" : "Create account"} <span>→</span></button>
          </form>
          <p className="auth-switch">Already have an account? <Link href={routes.login}>Log in <span>→</span></Link></p>
        </div>
      </section>
    </main>
  );
}
