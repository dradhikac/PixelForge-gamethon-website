import { motion } from 'framer-motion';
import './Events.css';

/* ==========================================================================
   ICONS (INLINE SVGs - Zero Dependency, Crisp Pixel / Outline Styling)
   ========================================================================== */

/* Handshake Icon for TRUST FALL */
const HandshakeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.4 1.4" />
    <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l1.4-1.4" />
    <path d="M18 11V6a2 2 0 0 0-2-2h-3" />
    <path d="M6 13v5a2 2 0 0 0 2 2h3" />
  </svg>
);

/* Golden Gavel / Mallet Icon for SILENT AUCTION */
const GavelIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffd000"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m14 13-7.5 7.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8L11 10" />
    <path d="m16 16 6-6" />
    <path d="m8 8 6-6" />
    <path d="m9 7 8 8" />
    <path d="m21 11-8-8" />
  </svg>
);

/* Stack of Gold Coins Icon for POOL PARTY */
const CoinsIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffd000"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <ellipse cx="12" cy="7" rx="8" ry="3.5" />
    <path d="M4 7v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5V7" />
    <path d="M4 12v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-5" />
  </svg>
);

/* Stopwatch / Timer Icon */
const StopwatchIcon = ({ color }: { color: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="13" r="8" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="9.5" y1="2" x2="14.5" y2="2" />
    <polyline points="12 9 12 13 15 13" />
    <line x1="18" y1="7" x2="19.5" y2="5.5" />
  </svg>
);

/* ==========================================================================
   ARENA DATA
   ========================================================================== */

interface ArenaCardData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  cardVariant: 'magenta' | 'cyan' | 'gold';
  icon: React.ReactNode;
}

const arenaCards: ArenaCardData[] = [
  {
    id: 'trust-fall',
    name: 'TRUST FALL',
    subtitle: 'Trust and betrayal.',
    description:
      'Face every other team in repeated rounds, secretly choosing to cooperate or ditch, and the team with the most points wins.',
    image: '/assets/pixelforge/arena/arena-trust-fall.png',
    accentColor: '#FF00D4',
    cardVariant: 'magenta',
    icon: <HandshakeIcon />,
  },
  {
    id: 'silent-auction',
    name: 'SILENT AUCTION',
    subtitle: 'Auctions and truthful bidding.',
    description:
      'Place secret bids with fake coins for build-boosting prizes, where the smartest bidder wins and overbidding leaves you broke.',
    image: '/assets/pixelforge/arena/arena-silent-auction.png',
    accentColor: '#00E5FF',
    cardVariant: 'cyan',
    icon: <GavelIcon />,
  },
  {
    id: 'pool-party',
    name: 'POOL PARTY',
    subtitle: 'Win-win cooperation.',
    description:
      'Every team secretly adds tokens to a shared pot that grows and is split equally, so everyone gains if all contribute, but anyone who holds back can profit.',
    image: '/assets/pixelforge/arena/arena-pool-party.png',
    accentColor: '#FFD500',
    cardVariant: 'gold',
    icon: <CoinsIcon />,
  },
];

/* ==========================================================================
   EVENTS (ARENA) COMPONENT
   ========================================================================== */

const Events = () => {
  return (
    <section id="events" className="arena-section" aria-label="Game Arenas">
      {/* Background Pixel & Glow Decorations */}
      <div className="arena-pixel-block-tl" aria-hidden="true" />
      <div className="arena-pixel-block-tr" aria-hidden="true" />
      <div className="arena-pixel-block-bl" aria-hidden="true" />
      <div className="arena-pixel-block-br" aria-hidden="true" />
      <div className="arena-ambient-glow" aria-hidden="true" />

      <div className="arena-container">
        {/* Header Group */}
        <div className="arena-header-group">
          {/* Label Badge: // GAME ARENAS // */}
          <motion.div
            className="arena-kicker-badge"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span className="arena-kicker-slash">//</span>
            <span className="arena-kicker-text">GAME ARENAS</span>
            <span className="arena-kicker-slash">//</span>
          </motion.div>

          {/* Heading: THE THREE ARENAS */}
          <motion.h2
            className="arena-main-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            THE THREE <span className="arena-heading-gold">ARENAS</span>
          </motion.h2>

          {/* Subtitle Description */}
          <motion.p
            className="arena-header-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            Compete in three high-intensity, one-hour arenas that test strategy, reasoning,
            and teamwork in unique and exciting formats.
          </motion.p>
        </div>

        {/* 3 Arena Cards Grid */}
        <div className="arena-cards-grid">
          {arenaCards.map((arena, index) => (
            <motion.div
              key={arena.id}
              className={`arena-card arena-card-${arena.cardVariant}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Card Mascot Artwork */}
              <div className="arena-card-art-box">
                <img
                  src={arena.image}
                  alt={arena.name}
                  className="arena-card-mascot-img"
                  loading="eager"
                />
              </div>

              {/* Angular Title Banner */}
              <div className={`arena-title-banner arena-banner-${arena.cardVariant}`}>
                <span className="arena-banner-icon">{arena.icon}</span>
                <span className="arena-banner-text">{arena.name}</span>
              </div>

              {/* Subtitle */}
              <div className="arena-card-subheading">{arena.subtitle}</div>

              {/* Description + Vertical Divider + Timer Row */}
              <div className="arena-card-body-row">
                <p className="arena-card-description">{arena.description}</p>
                <div
                  className="arena-card-vertical-divider"
                  style={{ backgroundColor: arena.accentColor, boxShadow: `0 0 10px ${arena.accentColor}` }}
                  aria-hidden="true"
                />
                <div className="arena-card-timer-wrap">
                  <StopwatchIcon color={arena.accentColor} />
                  <span className="arena-timer-text">1 HOUR</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
