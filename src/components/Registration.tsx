import { eventConfig } from "../config/eventConfig";
import "./Registration.css";

const Registration = () => {
  const formUrl = eventConfig.googleFormUrl;
  const embedUrl = `${formUrl}?embedded=true`;

  return (
    <main className="registration-page">
      {/* Ambient background glows */}
      <div className="registration-grid" aria-hidden="true" />
      <div className="registration-ambient-glow" aria-hidden="true" />

      <div className="registration-container">
        <header className="registration-header">
          <div className="registration-kicker-badge">
            <span className="kicker-spark">✦</span>
            <span>PIXEL FORGE 2026 // REGISTRATION</span>
          </div>

          <h1>
            REGISTER YOUR <span className="highlight-forge">TEAM</span>
          </h1>

          <p className="registration-subtitle">
            Complete the official form below to register your squad for the 30-hour hackathon.
          </p>

          <div className="registration-fee-pill">
            <span className="fee-icon">🎟</span>
            <span>Registration Fee: <strong>{eventConfig.registrationFee}</strong></span>
            <span className="fee-dot">•</span>
            <span>Team Size: <strong>2–4 Members</strong></span>
          </div>
        </header>

        <div className="registration-form-frame">
          <div className="form-frame-header">
            <div className="frame-traffic-lights" aria-hidden="true">
              <span className="traffic-dot dot-red" />
              <span className="traffic-dot dot-yellow" />
              <span className="traffic-dot dot-green" />
            </div>
            <span className="frame-title">OFFICIAL REGISTRATION FORM TERMINAL</span>
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="frame-external-link"
              title="Open Google Form in a new tab"
            >
              Open Form ↗
            </a>
          </div>

          <iframe
            title="Pixel Forge hackathon registration form"
            src={embedUrl}
            width="100%"
            height="1250"
            loading="lazy"
          >
            Loading registration form…
          </iframe>
        </div>

        <p className="registration-form-fallback">
          Having trouble viewing the embedded form?{" "}
          <a href={formUrl} target="_blank" rel="noopener noreferrer">
            Click here to open it directly in a new tab ↗
          </a>
        </p>
      </div>
    </main>
  );
};

export default Registration;
