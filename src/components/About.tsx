import { motion } from 'framer-motion';
import './About.css';

/* Golden Game Controller SVG for decorative divider */
const GameControllerDividerSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffd000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM9 13H7V15H6V13H4V12H6V10H7V12H9V13ZM17.5 14.5C16.67 14.5 16 13.83 16 13C16 12.17 16.67 11.5 17.5 11.5C18.33 11.5 19 12.17 19 13C19 13.83 18.33 14.5 17.5 14.5ZM19.5 10.5C18.67 10.5 18 9.83 18 9C18 8.17 18.67 7.5 19.5 7.5C20.33 7.5 21 8.17 21 9C21 9.83 20.33 10.5 19.5 10.5Z" />
  </svg>
);

/* Trophy SVG Icon for COMPETE badge */
const TrophyBadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffd000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M19 5H17V3H7V5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.63 7.39 12.93C8.14 14.75 9.89 16.09 12 16.29V19H8V21H16V19H12V16.29C14.11 16.09 15.86 14.75 16.61 12.93C19.08 12.63 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V10.82C5.84 10.4 5 9.3 5 8ZM19 8C19 9.3 18.16 10.4 17 10.82V7H19V8Z" />
  </svg>
);

/* Code SVG Icon for BUILD badge */
const CodeBadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

/* Presentation Screen SVG Icon for DEMO badge */
const ScreenBadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#ffd000" strokeWidth="2" fill="rgba(255, 208, 0, 0.15)" />
    <path d="M8 21H16" stroke="#ffd000" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 17V21" stroke="#ffd000" strokeWidth="2" />
    <polygon points="10 7 15 10 10 13" fill="#ffd000" />
  </svg>
);

const About = () => {
  return (
    <section id="about" className="about-section">
      {/* Subtle pixel-block edge decorations */}
      <div className="about-pixel-block-tl" aria-hidden="true" />
      <div className="about-pixel-block-tr" aria-hidden="true" />
      <div className="about-pixel-block-bl" aria-hidden="true" />
      <div className="about-pixel-block-br" aria-hidden="true" />
      <div className="about-ambient-glow-core" aria-hidden="true" />

      <div className="about-viewport-container">
        {/* Top Header Group */}
        <div className="about-header-group">
          {/* 1. Kicker Label: // EVENT OVERVIEW // */}
          <motion.div
            className="about-kicker-badge"
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span className="kicker-slash">//</span>
            <span className="kicker-text">EVENT OVERVIEW</span>
            <span className="kicker-slash">//</span>
          </motion.div>

          {/* 2. Main Title: ABOUT PIXEL FORGE */}
          <motion.h2
            className="about-main-title"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06 }}
          >
            <span className="about-title-white">ABOUT</span>{' '}
            <span className="about-title-gold">PIXEL FORGE</span>
          </motion.h2>

          {/* 3. Intro Description with Highlight */}
          <motion.p
            className="about-intro-text"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            Pixel Forge is a two-day inter-college buildathon where game theory stops
            <br />
            being a whiteboard subject and becomes something you{' '}
            <strong className="about-intro-highlight">build, play, and compete in.</strong>
          </motion.p>
        </div>

        {/* 4. Decorative Golden Divider with Center Gamepad */}
        <div className="about-divider-row" aria-hidden="true">
          <span className="divider-line left" />
          <div className="divider-controller-wrap">
            <GameControllerDividerSvg />
          </div>
          <span className="divider-line right" />
        </div>

        {/* 5. Three Main Activity Cards: COMPETE | BUILD | DEMO */}
        <div className="about-three-cards-row">
          {/* Card 1 — COMPETE */}
          <motion.div
            className="about-activity-card"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 }}
          >
            <div className="card-character-stage">
              <img
                src="/assets/pixelforge/about/warrior-compete.png"
                alt="Pixel Forge Compete Warrior"
                className="activity-character-img compete-img"
                loading="eager"
              />
            </div>
            <div className="card-badge-pill">
              <TrophyBadgeIcon />
              <span className="card-badge-title">COMPETE</span>
            </div>
            <p className="card-desc-text">
              Live interactive challenges and win exciting rewards.
            </p>
          </motion.div>

          {/* Card 2 — BUILD */}
          <motion.div
            className="about-activity-card"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <div className="card-character-stage">
              <img
                src="/assets/pixelforge/about/warrior-build.png"
                alt="Pixel Forge Build Warrior"
                className="activity-character-img build-img"
                loading="eager"
              />
            </div>
            <div className="card-badge-pill">
              <CodeBadgeIcon />
              <span className="card-badge-title">BUILD</span>
            </div>
            <p className="card-desc-text">
              A continuous game-building challenge across two days.
            </p>
          </motion.div>

          {/* Card 3 — DEMO */}
          <motion.div
            className="about-activity-card"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="card-character-stage">
              <img
                src="/assets/pixelforge/about/warrior-demo.png"
                alt="Pixel Forge Demo Warrior"
                className="activity-character-img demo-img"
                loading="eager"
              />
            </div>
            <div className="card-badge-pill">
              <ScreenBadgeIcon />
              <span className="card-badge-title">DEMO</span>
            </div>
            <p className="card-desc-text">
              Present your game to judges and defend your design.
            </p>
          </motion.div>
        </div>

        {/* 6. Bottom THEMES Banner */}
        <motion.div
          className="about-themes-banner"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.36 }}
        >
          {/* Left: THEMES pill */}
          <div className="themes-left-area">
            <div className="themes-brand-pill">
              <span className="themes-brand-text">THEMES</span>
              <span className="themes-brand-slashes">//</span>
            </div>
          </div>

          {/* Center-Left: Magical Treasure Chest */}
          <div className="themes-chest-stage">
            <img
              src="/assets/pixelforge/about/themes-chest.png"
              alt="Pixel Forge Themes Mystery Chest"
              className="themes-chest-img"
              loading="eager"
            />
          </div>

          {/* Vertical Separator Divider */}
          <div className="themes-vertical-divider" aria-hidden="true" />

          {/* Right: Reveal sentence */}
          <div className="themes-copy-area">
            <p className="themes-reveal-sentence">
              We’re gatekeeping the event themes until kickoff
              <br />
              —be there for the <span className="themes-gold-highlight">ultimate drop! 👀✨</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
