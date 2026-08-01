import Link from "next/link";
import { AuthNavigation } from "../../components/AuthNavigation";
import messages from "../../locales/en.json";
import { routes } from "../../routes";
import styles from "./landing.module.css";

const { common, landing } = messages;

export default function LandingPage() {
  return (
    <main>
      <nav className={`${styles.nav} shell`}>
        <Link className="brand" href={routes.home} aria-label={landing.brandAriaLabel}>
          <span className="brand-mark">✦</span> {common.brand}
        </Link>
        <div className={styles.navLinks}>
          <a href="#discover">{landing.nav.discover}</a>
          <a href="#how-it-works">{landing.nav.howItWorks}</a>
          <a href="#about">{landing.nav.about}</a>
        </div>
        <AuthNavigation />
      </nav>
      <section className={`${styles.hero} shell`} id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> {landing.hero.eyebrow}
          </p>
          <h1>
            {landing.hero.title}
            <br />
            <em>{landing.hero.titleEmphasis}</em>
          </h1>
          <p className={styles.heroDescription}>{landing.hero.description}</p>
          <Link className="primary-button" href={routes.signUp}>
            {landing.hero.cta} <span>{common.arrow}</span>
          </Link>
          <div className={styles.travelerNote}>
            <div className={styles.avatars}>
              <i>J</i>
              <i>M</i>
              <i>S</i>
              <i>A</i>
            </div>
            <p>
              <strong>{landing.hero.travelers}</strong>
              <br />
              {landing.hero.travelersDescription}
            </p>
          </div>
        </div>
        <div className={styles.heroArt} aria-label={landing.hero.artAriaLabel}>
          <div className={styles.sun} />
          <div className={`${styles.cloud} ${styles.cloudOne}`} />
          <div className={`${styles.cloud} ${styles.cloudTwo}`} />
          <div className={`${styles.mountain} ${styles.mountainBack}`} />
          <div className={`${styles.mountain} ${styles.mountainFront}`} />
          <div className={styles.water} />
          <div className={styles.shore} />
          <div className={styles.postcard}>
            <span className={styles.postcardStamp}>✦</span>
            <p>
              {landing.hero.postcard}
              <br />
              <strong>{landing.hero.postcardEmphasis}</strong>
            </p>
            <span className={styles.postcardLine} />
          </div>
          <div className={styles.locationTag}>
            <span>✦</span> {landing.hero.madeForYou}
          </div>
          <div className={styles.plane}>⌁</div>
        </div>
      </section>
      <section className={`${styles.plannerWrap} shell`} aria-label={landing.planner.ariaLabel}>
        <div className={styles.plannerCard}>
          <div className={styles.plannerHeading}>
            <span className={styles.plannerIcon}>✦</span>
            <div>
              <p>{landing.planner.heading}</p>
              <small>{landing.planner.subheading}</small>
            </div>
          </div>
          <label>
            {landing.planner.destination}
            <div className={styles.field}>
              <span>⌖</span>
              <input placeholder={landing.planner.destinationPlaceholder} />
            </div>
          </label>
          <label>
            {landing.planner.when}
            <div className={styles.field}>
              <span>□</span>
              <input placeholder={landing.planner.whenPlaceholder} />
            </div>
          </label>
          <label>
            {landing.planner.travelers}
            <div className={styles.field}>
              <span>♙</span>
              <input placeholder={landing.planner.travelersPlaceholder} />
            </div>
          </label>
          <button className={styles.searchButton} type="button" aria-label={landing.planner.searchAriaLabel}>
            {common.arrow}
          </button>
        </div>
      </section>
      <section className={`${styles.discover} shell`} id="discover">
        <div>
          <p className="eyebrow">
            <span /> {landing.discover.eyebrow}
          </p>
          <h2>
            {landing.discover.title} <em>{landing.discover.titleEmphasis}</em>
          </h2>
        </div>
        <a className={`${styles.allLink} all-link`} href="#discover">
          {landing.discover.viewAll} <span>{common.arrow}</span>
        </a>
        <div className={styles.destinationGrid}>
          {landing.destinations.map((destination) => (
            <article className={`${styles.destinationCard} ${styles[destination.color]}`} key={destination.name}>
              <div className={styles.cardImage}>
                <span>{destination.symbol}</span>
              </div>
              <div className={styles.cardContent}>
                <p>{destination.country}</p>
                <h3>{destination.name}</h3>
                <button type="button">
                  {landing.discover.explore} <span>{common.arrow}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
