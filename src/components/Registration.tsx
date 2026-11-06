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
            Follow the 2 simple steps below: Pay the registration fee, save your payment screenshot, and submit your squad details.
          </p>

          <div className="registration-fee-pill">
            <span className="fee-icon">🎟</span>
            <span>Registration Fee: <strong>{eventConfig.registrationFee}</strong></span>
            <span className="fee-dot">•</span>
            <span>Team Size: <strong>2–4 Members</strong></span>
          </div>
        </header>

        {/* ====================================================================
            STEP 1: PAYMENT QR & INSTRUCTIONS
            ==================================================================== */}
        <section className="registration-payment-card" aria-label="Registration Fee Payment">
          <div className="payment-card-badge">
            <span className="payment-step-num">STEP 1</span>
            <span className="payment-step-title">SCAN & PAY REGISTRATION FEE</span>
          </div>

          <div className="payment-card-body">
            <div className="payment-qr-frame">
              <img
                src="/pixelforge-payment-qr.jpg"
                alt="Pixel Forge UPI Payment QR Code"
                className="payment-qr-img"
              />
              <div className="payment-qr-scan-badge">Scan to Pay ₹250</div>
            </div>

            <div className="payment-instructions">
              <h2 className="payment-instruction-title">Pay ₹250 via any UPI App</h2>
              
              <ul className="payment-instruction-list">
                <li>
                  <span className="instruction-step-icon">1</span>
                  <span>Open <strong>GPay, PhonePe, Paytm, BHIM</strong> or any UPI app on your phone.</span>
                </li>
                <li>
                  <span className="instruction-step-icon">2</span>
                  <span>Scan this QR code and complete the payment of <strong>₹250 per team</strong>.</span>
                </li>
                <li>
                  <span className="instruction-step-icon">3</span>
                  <span className="highlight-critical">
                    <strong>Take a clear screenshot</strong> of the completed payment receipt showing the <strong>Transaction ID / UTR number</strong>.
                  </span>
                </li>
                <li>
                  <span className="instruction-step-icon">4</span>
                  <span>Proceed to <strong>Step 2</strong> below to fill in your team details and upload this payment screenshot.</span>
                </li>
              </ul>

              <div className="payment-notice-pill">
                <span className="notice-icon">📸</span>
                <span><strong>Remember:</strong> Store your payment screenshot safely — it is required in the form below!</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            STEP 2: FORM TERMINAL
            ==================================================================== */}
        <div className="registration-step2-indicator">
          <span className="step2-badge">STEP 2</span>
          <span className="step2-text">Fill Out Team Details & Attach Payment Screenshot Below</span>
          <span className="step2-arrow" aria-hidden="true">↓</span>
        </div>

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
            height="520"
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
