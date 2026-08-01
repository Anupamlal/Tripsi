import Link from "next/link";
import { routes } from "../../routes";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link className="brand" href={routes.landingPage}>
          <span className="brand-mark">✦</span> Tripsi
        </Link>
        <div className="auth-aside-copy">
          <p className="eyebrow">
            <span /> Welcome back
          </p>
          <h1>
            Your next story
            <br />
            <em>is waiting.</em>
          </h1>
          <p>
            Pick up where you left off and return to all the journeys made just
            for you.
          </p>
        </div>
        <div className="aside-landscape">
          <div className="aside-sun" />
          <div className="aside-mountain" />
          <div className="aside-water" />
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-kicker">TRIPSI ACCOUNT</p>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">
            Sign in to continue planning your next escape.
          </p>
          <form className="auth-form">
            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </label>
            <div className="auth-options">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#reset">Forgot password?</a>
            </div>
            <button className="auth-submit" type="submit">
              Log in <span>→</span>
            </button>
          </form>
          <div className="auth-divider">
            <span>or continue with</span>
          </div>
          <div className="social-buttons">
            <button type="button">
              <b>G</b> Google
            </button>
          </div>
          <p className="auth-switch">
            New to Tripsi?{" "}
            <Link href={routes.signUp}>
              Create an account <span>→</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
