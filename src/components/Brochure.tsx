import './Brochure.css';

const Brochure = () => {
  return (
    <section className="brochure-page">
      <div className="brochure-header-bar">
        <h1 className="brochure-title">Official Event Brochure</h1>
        <a
          href="/pixelforge-brochure.pdf"
          download="PixelForge-2026-Official-Brochure.pdf"
          className="brochure-download-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Download PDF</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="brochure-container">
        <iframe
          src="/pixelforge-brochure.pdf#toolbar=1&navpanes=0&scrollbar=1"
          title="PIXEL FORGE 2026 Official Brochure"
          className="brochure-iframe"
        />
      </div>
    </section>
  );
};

export default Brochure;
