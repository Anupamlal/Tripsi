"use client";

import Link from "next/link";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseApp } from "../lib/firebase";
import messages from "../locales/en.json";
import { routes } from "../routes";

export function AuthNavigation() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(getAuth(firebaseApp), setUser), []);

  if (user === undefined) return <span className="auth-nav-loading" aria-label={messages.common.loading} />;
  if (!user) return <Link className="login" href={routes.login}>{messages.landing.nav.login} <span>↗</span></Link>;

  const name = user.displayName || user.email || messages.common.brand;
  const initial = name.trim().charAt(0).toUpperCase();
  const ariaLabel = messages.common.profileAriaLabel.replace("{name}", name);

  return <Link className="profile-avatar" href={routes.profile} aria-label={ariaLabel} title={name}>{user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : initial}</Link>;
}
