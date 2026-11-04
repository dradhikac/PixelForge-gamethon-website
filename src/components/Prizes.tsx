import { motion } from 'framer-motion';
import './Prizes.css';

/* ==========================================================================
   ICONS (INLINE SVGs - Zero Dependency, Crisp Pixel / Outline Styling)
   ========================================================================== */

/* Golden Game Controller SVG for decorative divider */
const GameControllerDividerSvg = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="#ffd000"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM9 13H7V15H6V13H4V12H6V10H7V12H9V13ZM17.5 14.5C16.67 14.5 16 13.83 16 13C16 12.17 16.67 11.5 17.5 11.5C18.33 11.5 19 12.17 19 13C19 13.83 18.33 14.5 17.5 14.5ZM19.5 10.5C18.67 10.5 18 9.83 18 9C18 8.17 18.67 7.5 19.5 7.5C20.33 7.5 21 8.17 21 9C21 9.83 20.33 10.5 19.5 10.5Z" />
  </svg>
);

/* Trophy SVG Icon for PRIZE MONEY */
const TrophyCardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#ffd000"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M19 5H17V3H7V5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.63 7.39 12.93C8.14 14.75 9.89 16.09 12 16.29V19H8V21H16V19H12V16.29C14.11 16.09 15.86 14.75 16.61 12.93C19.08 12.63 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V10.82C5.84 10.4 5 9.3 5 8ZM19 8C19 9.3 18.16 10.4 17 10.82V7H19V8Z" />
  </svg>
);

/* Certificate / Award Scroll SVG Icon for CERTIFICATE */
const CertificateCardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffd000"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#ffd000" strokeWidth="2" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="16" x2="13" y2="16" />
  </svg>
);

/* Laptop / Coding SVG Icon for HANDS-ON EXPERIENCE */
const LaptopCardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00E5FF"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#00E5FF" strokeWidth="2" />
    <path d="M2 20h20" />
    <circle cx="12" cy="10" r="2" fill="#00E5FF" />
  </svg>
);

/* ==========================================================================
   REWARDS DATA
   ========================================================================== */

interface RewardCardData {
  id: string;
  name: string;
  highlight: string;
  description: string;
  image: string;
  alt: string;
  variant: 'gold' | 'magenta' | 'cyan';
  icon: React.ReactNode;
}

const rewardCards: RewardCardData[] = [
  {
    id: 'prize-money',
    name: 'PRIZE MONEY',
    highlight: 'The prize pool is about to be announced!',
    description:
      'Stay tuned for the official announcement of the prize money. The best teams will be rewarded for their creativity, strategy and impact.',
    image: '/assets/pixelforge/prizes/prize-trophy.png',
    alt: 'Voxel Golden Trophy with Pixel Star',
    variant: 'gold',
    icon: <TrophyCardIcon />,
  },
  {
    id: 'certificate',
    name: 'CERTIFICATE',
    highlight: 'Every student gets a certificate.',
    description:
      'Showcase your achievement with an official Pixel Forge 2026 participation certificate, recognizing your skills, effort and teamwork.',
    image: '/assets/pixelforge/prizes/prize-certificate.png',
    alt: 'Neon Voxel Gaming Achievement Award',
    variant: 'magenta',
    icon: <CertificateCardIcon />,
  },
  {
    id: 'hands-on-experience',
    name: 'HANDS-ON EXPERIENCE',
    highlight: 'Get real experience in a 30-hour hackathon.',
    description:
      'Build, collaborate and develop practical skills through an immersive 30-hour game development hackathon experience.',
    image: '/assets/pixelforge/prizes/prize-experience.png',
    alt: 'Pixel Forge Warrior Coding in Neon',
    variant: 'cyan',
    icon: <LaptopCardIcon />,
  },
];

/* ==========================================================================
   PRIZES (REWARDS & HONORS) COMPONENT
   ========================================================================== */

export const Prizes = () => {
  return (
    <section id="prizes" className="prizes-section" aria-label="Rewards & Honors">
      {/* Background Pixel & Glow Decorations */}
      <div className="prizes-pixel-block-tl" aria-hidden="true" />
      <div className="prizes-pixel-block-tr" aria-hidden="true" />
      <div className="prizes-pixel-block-bl" aria-hidden="true" />
      <div className="prizes-pixel-block-br" aria-hidden="true" />
      <div className="prizes-ambient-glow" aria-hidden="true" />

      <div className="prizes-container">
        {/* Header Group */}
        <div className="prizes-header-group">
          {/* Label Badge: // 04 REWARDS & HONORS // */}
          <motion.div
            className="prizes-kicker-badge"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span className="prizes-kicker-slash">//</span>
            <span className="prizes-kicker-text">REWARDS & HONORS</span>
            <span className="prizes-kicker-slash">//</span>
          </motion.div>

          {/* Main Heading: PRIZES & RECOGNITION */}
          <motion.h2
            className="prizes-main-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            PRIZES & <span className="prizes-heading-gold">RECOGNITION</span>
          </motion.h2>

          {/* Subtitle Description */}
          <motion.p
            className="prizes-header-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            Your skills, creativity, and teamwork deserve to be celebrated.
            <br />
            Here's what you'll take home from Pixel Forge 2026.
          </motion.p>

          {/* Horizontal Golden Divider with Center Game Controller */}
          <div className="prizes-divider-row" aria-hidden="true">
            <span className="prizes-divider-line left" />
            <div className="prizes-divider-controller">
              <GameControllerDividerSvg />
            </div>
            <span className="prizes-divider-line right" />
          </div>
        </div>

        {/* Content Row: 3 Cards on Left + Mascot on Right */}
        <div className="prizes-content-row">
          {/* 3 Reward Cards Grid */}
          <div className="prizes-cards-grid">
            {rewardCards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`prizes-card prizes-card-${card.variant}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                {/* Card Artwork */}
                <div className="prizes-card-art-box">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="prizes-card-img"
                    loading="eager"
                  />
                </div>

                {/* Chamfered Title Banner */}
                <div className={`prizes-title-banner prizes-banner-${card.variant}`}>
                  <span className="prizes-banner-icon">{card.icon}</span>
                  <span className="prizes-banner-text">{card.name}</span>
                </div>

                {/* Highlight Subtitle */}
                <div className="prizes-card-highlight">{card.highlight}</div>

                {/* Description */}
                <p className="prizes-card-description">{card.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Full-Body Warrior Mascot (Right Side) */}
          <motion.div
            className="prizes-mascot-wrapper"
            initial={{ opacity: 0, scale: 0.95, x: 25 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="prizes-mascot-glow" aria-hidden="true" />
            <img
              src="/assets/pixelforge/prizes/prize-mascot.png"
              alt="Pixel Forge Warrior with Glowing Achievement Award"
              className="prizes-mascot-img"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Prizes;
