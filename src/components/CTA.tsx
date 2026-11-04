import { motion } from 'framer-motion';
import { eventConfig } from '../config/eventConfig';
import './CTA.css';

const CTA = () => {
  return (
    <section id="register" className="cta-section">
      <div className="container">
        <motion.div
          className="forge-cta-card"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle Ambient Glowing Embers */}
          <div className="cta-ember-glow" />

          {/* Badge */}
          <div className="cta-registration-pill">
            <span className="pill-dot" />
            <span>OFFICIAL REGISTRATION OPEN</span>
          </div>

          {/* Heading */}
          <h2 className="cta-heading">
            READY TO ENTER THE <span className="highlight-forge">ARENA?</span>
          </h2>

          {/* Description */}
          <p className="cta-description">
            Assemble your squad, master strategic game theory, and compete for championship glory
            in the 30-Hour Build Challenge. Registrations close <strong>20 October 2026</strong>.
          </p>

          {/* Action CTA Button */}
          <div className="cta-button-wrap">
            <a href="/registration" className="forge-register-btn">
              <span>REGISTER YOUR TEAM NOW</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>

          {/* Meta Details Pill Strip */}
          <div className="cta-meta-strip">
            <div className="meta-pill">
              <span className="meta-icon">🎟️</span>
              <span>Pass: {eventConfig.registrationFee}</span>
            </div>
            <div className="meta-pill">
              <span className="meta-icon">👥</span>
              <span>Squad: 3–4 Members</span>
            </div>
            <div className="meta-pill">
              <span className="meta-icon">🏆</span>
              <span>Cash Prizes & Trophies</span>
            </div>
            <div className="meta-pill">
              <span className="meta-icon">🎓</span>
              <span>Enrolled Students (All Colleges)</span>
            </div>
          </div>

          {/* Contact Support */}
          <p className="cta-support-line">
            Need assistance or have registration questions? Reach out to{' '}
            <a href="mailto:gamecraftsupport2026@gmail.com">
              gamecraftsupport2026@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
