import Link from "next/link";
import { routes } from "../../routes";
import { destinations } from "../landingpage/data";

export default function LandingPage() {
  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href={routes.home} aria-label="Tripsi home">
          <span className="brand-mark">✦</span> Tripsi
        </Link>
        <div className="nav-links">
          <a href="#discover">Discover</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About us</a>
        </div>
        <Link className="login" href={routes.login}>
          Log in <span>↗</span>
        </Link>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> Travel, thoughtfully planned
          </p>
          <h1>
            More wonder.
            <br />
            <em>Less planning.</em>
          </h1>
          <p className="hero-description">
            Tell us how you like to travel and Tripsi creates a journey that
            feels unmistakably yours.
          </p>
          <Link className="primary-button" href={routes.signUp}>
            Start planning <span>→</span>
          </Link>
          <div className="traveler-note">
            <div className="avatars">
              <i>J</i>
              <i>M</i>
              <i>S</i>
              <i>A</i>
            </div>
            <p>
              <strong>12k+ travelers</strong>
              <br />
              are exploring with Tripsi
            </p>
          </div>
        </div>
        <div className="hero-art" aria-label="Illustration of a coastal trip">
          <div className="sun" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="mountain mountain-back" />
          <div className="mountain mountain-front" />
          <div className="water" />
          <div className="shore" />
          <div className="postcard">
            <span className="postcard-stamp">✦</span>
            <p>
              Your next
              <br />
              <strong>great story</strong>
            </p>
            <span className="postcard-line" />
          </div>
          <div className="location-tag">
            <span>✦</span> Made for you
          </div>
          <div className="plane">⌁</div>
        </div>
      </section>

      <section className="planner-wrap shell" aria-label="Plan a trip">
        <div className="planner-card">
          <div className="planner-heading">
            <span className="planner-icon">✦</span>
            <div>
              <p>Where to next?</p>
              <small>Let&apos;s find your perfect escape</small>
            </div>
          </div>
          <label>
            Destination{" "}
            <div className="field">
              <span>⌖</span>
              <input placeholder="City, country, or anywhere" />
            </div>
          </label>
          <label>
            When{" "}
            <div className="field">
              <span>□</span>
              <input placeholder="Add dates" />
            </div>
          </label>
          <label>
            Travelers{" "}
            <div className="field">
              <span>♙</span>
              <input placeholder="2 travelers" />
            </div>
          </label>
          <button
            className="search-button"
            type="button"
            aria-label="Search trips"
          >
            →
          </button>
        </div>
      </section>

      <section className="discover shell" id="discover">
        <div>
          <p className="eyebrow">
            <span /> Curated escapes
          </p>
          <h2>
            Dream a little <em>bigger.</em>
          </h2>
        </div>
        <a className="all-link" href="#discover">
          View all destinations <span>→</span>
        </a>
        <div className="destination-grid">
          {destinations.map((destination, index) => (
            <article
              className={`destination-card ${destination.color}`}
              key={destination.name}
            >
              <div className="card-image">
                <span>{index === 0 ? "☀" : index === 1 ? "✿" : "◒"}</span>
              </div>
              <div className="card-content">
                <p>{destination.country}</p>
                <h3>{destination.name}</h3>
                <button type="button">
                  Explore <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
