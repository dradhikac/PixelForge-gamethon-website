import { eventConfig } from "../config/eventConfig";
import "./Registration.css";

const Registration = () => {
  const formUrl = eventConfig.googleFormUrl;
  const embedUrl = `${formUrl}?embedded=true`;

  return (
    <main className="registration-page">
      <div className="registration-grid" aria-hidden="true" />

      <div className="registration-container">
        <header className="registration-header">
          <span className="registration-code">PIXEL FORGE // REGISTRATION</span>
          <h1>
            REGISTER YOUR <span>TEAM</span>
          </h1>
          <p>Complete the form below to register for the hackathon.</p>
          <p className="registration-fee">Registration fee: {eventConfig.registrationFee}</p>
        </header>

        <div className="registration-form-frame">
          <iframe
            title="Pixel Forge hackathon registration form"
            src={embedUrl}
            width="100%"
            height="1200"
            loading="lazy"
          >
            Loading registration form…
          </iframe>
        </div>

        <p className="registration-form-fallback">
          Having trouble viewing the form?{" "}
          <a href={formUrl} target="_blank" rel="noopener noreferrer">
            Open it in a new tab
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default Registration;
