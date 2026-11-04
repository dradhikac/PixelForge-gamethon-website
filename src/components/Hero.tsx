import { motion } from 'framer-motion';
import { eventConfig } from '../config/eventConfig';
import './Hero.css';

/* Calendar SVG Icon (Card 1) */
const CalendarIconSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="3" fill="rgba(139, 53, 255, 0.25)" stroke="#c084fc" strokeWidth="1.8" />
    <path d="M3 9.5H21" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 2.5V5.5" stroke="#ffd000" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2.5V5.5" stroke="#ffd000" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7.5" cy="13" r="1.2" fill="#ffffff" />
    <circle cx="12" cy="13" r="1.2" fill="#ffffff" />
    <circle cx="16.5" cy="13" r="1.2" fill="#ffffff" />
    <circle cx="7.5" cy="17" r="1.2" fill="#ffffff" />
    <circle cx="12" cy="17" r="1.2" fill="#ffd000" />
    <circle cx="16.5" cy="17" r="1.2" fill="#ffd000" />
  </svg>
);

/* Golden Location Map Pin SVG Icon (Card 2) */
const VenuePinIconSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z"
      fill="#ffd000"
      stroke="#eab308"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="9.5" r="3" fill="#1c0a35" />
  </svg>
);

/* Golden Trophy SVG Icon (Card 3) */
const TrophyIconSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M7 4H17V9C17 11.76 14.76 14 12 14C9.24 14 7 11.76 7 9V4Z"
      fill="#ffd000"
      stroke="#fef08a"
      strokeWidth="1.5"
    />
    <path d="M7 6H3V8C3 9.66 4.34 11 6 11H7V6Z" fill="#ffd000" opacity="0.9" />
    <path d="M17 6H21V8C21 9.66 19.66 11 18 11H17V6Z" fill="#ffd000" opacity="0.9" />
    <path d="M10 14V17H14V14" stroke="#ffd000" strokeWidth="2" />
    <rect x="8" y="17" width="8" height="3" rx="1" fill="#ffd000" />
    <path d="M12 6.5L12.8 8.2L14.6 8.4L13.3 9.6L13.6 11.4L12 10.5L10.4 11.4L10.7 9.6L9.4 8.4L11.2 8.2L12 6.5Z" fill="#1c0a35" />
  </svg>
);

/* Event Ticket / Pass SVG Icon (Card 4) */
const TicketPassIconSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="6" width="20" height="12" rx="2.5" fill="#ff007f" />
    <path d="M2 12C3.38 12 4.5 10.88 4.5 9.5H2V12Z" fill="#1c0a35" />
    <path d="M2 14.5C3.38 14.5 4.5 13.38 4.5 12H2V14.5Z" fill="#1c0a35" />
    <path d="M22 12C20.62 12 19.5 10.88 19.5 9.5H22V12Z" fill="#1c0a35" />
    <path d="M22 14.5C20.62 14.5 19.5 13.38 19.5 12H22V14.5Z" fill="#1c0a35" />
    <line x1="8" y1="8" x2="8" y2="16" stroke="#ffd000" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="14" cy="12" r="2" fill="#ffffff" />
  </svg>
);

/* Golden Clock SVG Icon (Status Bar) */
const ClockIconSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="status-clock-svg">
    <circle cx="12" cy="12" r="9.5" fill="#ffd000" stroke="#fef08a" strokeWidth="1.5" />
    <path d="M12 6.5V12L15.5 14" stroke="#1c0a35" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/* Team / Squad SVG Icon (Register Button) */
const TeamIconSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="btn-action-svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13.01 6.34 13.01 8C13.01 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5.01 6.34 5.01 8C5.01 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
  </svg>
);

/* Gamepad SVG Icon (Explore Arena Button) */
const GamepadIconSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="btn-action-svg">
    <path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM9 13H7V15H6V13H4V12H6V10H7V12H9V13ZM17.5 14.5C16.67 14.5 16 13.83 16 13C16 12.17 16.67 11.5 17.5 11.5C18.33 11.5 19 12.17 19 13C19 13.83 18.33 14.5 17.5 14.5ZM19.5 10.5C18.67 10.5 18 9.83 18 9C18 8.17 18.67 7.5 19.5 7.5C20.33 7.5 21 8.17 21 9C21 9.83 20.33 10.5 19.5 10.5Z" />
  </svg>
);

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      {/* Restrained Pixel-Block Edge Decorations & Subtle Ambient Glow */}
      <div className="hero-pixel-blocks-left" aria-hidden="true" />
      <div className="hero-pixel-blocks-right" aria-hidden="true" />
      <div className="hero-ambient-glow-core" aria-hidden="true" />

      <div className="hero-viewport-container">
        <div className="hero-two-column-layout">

          {/* ====================================================================
              LEFT COLUMN (approx 36%): VOXEL BLACKSMITH WARRIOR
              ==================================================================== */}
          <div className="hero-left-column">
            <div className="hero-warrior-stage">
              <div className="hero-warrior-ambient-shadow" aria-hidden="true" />
              <img
                src="/assets/pixelforge/landing/voxel-warrior.png"
                alt="Pixel Forge Voxel Blacksmith Warrior"
                className="hero-warrior-character"
                loading="eager"
              />
              <div className="hero-warrior-pedestal-glow" aria-hidden="true" />
            </div>
          </div>

          {/* ====================================================================
              RIGHT COLUMN (approx 64%): MAIN CONTENT (Centered Vertical Alignment)
              ==================================================================== */}
          <div className="hero-right-column">
            <div className="hero-right-content-wrapper">

              {/* 1. College Identity Outlined Container (approx 790px x 64px) */}
              <motion.div
                className="hero-college-pill"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="college-emblem-wrap">
                  <img
                    src="/dsatm-logo.png"
                    alt="DSATM Logo"
                    className="college-emblem-img"
                  />
                </div>
                <div className="college-pill-divider" />
                <div className="college-meta-stack">
                  <span className="college-name-text">
                    DAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MANAGEMENT
                  </span>
                  <span className="college-dept-text">
                    Department of Computer Science & Engineering – Data Science
                  </span>
                </div>
              </motion.div>

              {/* 2. Main Event Title: PIXEL FORGE [2026] ON ONE SINGLE LINE */}
              <motion.div
                className="hero-title-row"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <h1 className="hero-single-line-title">
                  <span className="title-word-pixel">PIXEL</span>
                  <span className="title-word-forge">FORGE</span>
                  <span className="title-badge-2026">2026</span>
                </h1>
              </motion.div>

              {/* 3. Main Tagline */}
              <motion.div
                className="hero-tagline-block"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.16 }}
              >
                <p className="hero-main-tagline">
                  FORGE YOUR IDEAS. BUILD WHAT'S NEXT.
                </p>

                {/* 4. Sub-Tagline with Flanking Golden Lines */}
                <div className="hero-subtagline-row">
                  <span className="subtagline-flank-line" />
                  <span className="hero-subtagline-text">
                    2 Days · 30-Hour Build Challenge
                  </span>
                  <span className="subtagline-flank-line" />
                </div>
              </motion.div>

              {/* 5. Exactly FOUR Information Cards (Identical Dimensions in One Row) */}
              <motion.div
                className="hero-four-cards-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
              >
                {/* CARD 1 — DATES */}
                <div className="hero-unified-card">
                  <div className="card-icon-container">
                    <CalendarIconSvg />
                  </div>
                  <div className="card-content-block">
                    <span className="card-top-label">DATES</span>
                    <span className="card-primary-val">19–20</span>
                    <span className="card-secondary-val">November </span>
                  </div>
                </div>

                {/* CARD 2 — VENUE */}
                <a
                  href={eventConfig.venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-unified-card venue-card-link"
                  title="Open DSATM Campus in Google Maps"
                >
                  <div className="card-icon-container">
                    <VenuePinIconSvg />
                  </div>
                  <div className="card-content-block">
                    <span className="card-top-label">VENUE</span>
                    <span className="card-primary-val">DSATM ·</span>
                    <span className="card-secondary-val">Bengaluru</span>
                  </div>
                </a>

                {/* CARD 3 — REWARDS */}
                <div className="hero-unified-card">
                  <div className="card-icon-container">
                    <TrophyIconSvg />
                  </div>
                  <div className="card-content-block">
                    <span className="card-top-label">REWARDS</span>
                    <span className="card-primary-val">Exciting</span>
                    <span className="card-secondary-val">Cash Prizes</span>
                  </div>
                </div>

                {/* CARD 4 — TEAM PASS */}
                <div className="hero-unified-card pass-card">
                  <div className="card-icon-container">
                    <TicketPassIconSvg />
                  </div>
                  <div className="card-content-block">
                    <span className="card-top-label">TEAM PASS</span>
                    <span className="card-primary-val">₹250 / Team</span>
                    <span className="card-secondary-val">(2–4)</span>
                  </div>
                </div>
              </motion.div>

              {/* 6. Single Horizontal Registration Status Bar (approx 864px x 52px) */}
              <motion.div
                className="hero-registration-status-bar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
              >
                <div className="status-live-area">
                  <span className="status-radar-glow-dot" />
                  <span className="status-live-banner-text">ARENA IS LIVE NOW</span>
                </div>
                <div className="status-bar-vertical-divider" />
                <div className="status-deadline-area">
                  <ClockIconSvg />
                  <span className="status-deadline-text">
                    Registration Closes <strong>15 November 2026</strong>
                  </span>
                </div>
              </motion.div>

              {/* 7. Main Action Buttons (Two Horizontally Aligned Buttons) */}
              <motion.div
                className="hero-dual-cta-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.4 }}
              >
                {/* Button 1: REGISTER YOUR TEAM */}
                <a href="/registration" className="hero-action-btn primary-register-btn">
                  <TeamIconSvg />
                  <span>REGISTER YOUR TEAM</span>
                  <span className="action-btn-arrow">→</span>
                </a>

                {/* Button 2: EXPLORE THE ARENA */}
                <button
                  type="button"
                  className="hero-action-btn secondary-explore-btn"
                  onClick={() => scrollToSection('#about')}
                >
                  <GamepadIconSvg />
                  <span>EXPLORE THE ARENA</span>
                  <span className="action-btn-arrow">↓</span>
                </button>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;