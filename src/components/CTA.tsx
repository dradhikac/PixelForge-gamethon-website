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
          <div className="cta-registration-pill cta-pill-closed">
            <span className="pill-dot pill-dot-closed" />
            <span>REGISTRATIONS ARE CLOSED</span>
          </div>

          {/* Heading */}
          <h2 className="cta-heading">
            THE ARENA IS <span className="highlight-forge">READY.</span>
          </h2>

          {/* Description */}
          <p className="cta-description">
            Online and walk-in registrations are now officially closed. Registered squads, get ready for the 30-Hour Build Challenge on 19–20 November at DSATM!
          </p>

          {/* Action CTA Button */}
          <div className="cta-button-wrap">
            <a href="/registration" className="forge-register-btn forge-btn-closed">
              <span>REGISTRATIONS CLOSED</span>
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
            <a href="mailto:pixelforgesupport2026@gmail.com">
              pixelforgesupport2026@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
