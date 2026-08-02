"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import messages from "../locales/en.json";
import { routes } from "../routes";
import { subscribeToAuthChanges } from "../services/firebase/auth";
import { type User } from "firebase/auth";

export function AuthNavigation() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => subscribeToAuthChanges(setUser), []);

  if (user === undefined) return <span className="auth-nav-loading" aria-label={messages.common.loading} />;
  if (!user) return <Link className="login" href={routes.login}>{messages.landing.nav.login} <span>↗</span></Link>;

  const name = user.displayName || user.email || messages.common.brand;
  const initial = name.trim().charAt(0).toUpperCase();
  const ariaLabel = messages.common.profileAriaLabel.replace("{name}", name);

  return <Link className="profile-avatar" href={routes.profile} aria-label={ariaLabel} title={name}>{user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : initial}</Link>;
}
