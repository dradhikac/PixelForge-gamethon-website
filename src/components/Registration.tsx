import "./Registration.css";

const Registration = () => {
  return (
    <main className="registration-page">
      {/* Ambient background glows */}
      <div className="registration-grid" aria-hidden="true" />
      <div className="registration-ambient-glow" aria-hidden="true" />

      <div className="registration-container">
        <header className="registration-header">
          <div className="registration-kicker-badge kicker-closed">
            <span className="kicker-spark">🔒</span>
            <span>PIXEL FORGE 2026 // STATUS</span>
          </div>

          <h1>
            REGISTRATIONS ARE <span className="highlight-forge">CLOSED</span>
          </h1>

          <p className="registration-subtitle">
            Thank you for the tremendous response! Online and walk-in registrations for Pixel Forge 2026 are now officially closed.
          </p>

          <div className="registration-closed-card">
            <div className="closed-card-badge">📢 NOTICE FOR REGISTERED SQUADS</div>
            <p className="closed-card-text">
              All registered teams must report to the <strong>Dayananda Sagar Academy of Technology and Management (DSATM)</strong> campus on <strong>19th November 2026 at 8:30 AM</strong> with valid college ID cards for registration check-in.
            </p>
            <div className="closed-meta-row">
              <span className="closed-meta-item">📍 Venue: DSATM Bengaluru</span>
              <span className="closed-meta-dot">•</span>
              <span className="closed-meta-item">📅 Dates: 19–20 November 2026</span>
              <span className="closed-meta-dot">•</span>
              <span className="closed-meta-item">⏰ Check-In: 8:30 AM</span>
            </div>
            <div className="closed-actions-row">
              <a href="/" className="closed-return-btn">
                ← Return to Main Page
              </a>
              <a href="/brochure" className="closed-brochure-btn">
                View Event Brochure ↗
              </a>
            </div>
          </div>
        </header>
      </div>
    </main>
  );
};

export default Registration;
