import './Brochure.css';

const Brochure = () => {
  return (
    <section className="brochure-page">
      <div className="brochure-container">
        <iframe
          src="/gamecraft-brochure.pdf#toolbar=0&navpanes=0&scrollbar=1"
          title="GAMECRAFT 2026 Brochure"
          className="brochure-iframe"
        />
      </div>
    </section>
  );
};

export default Brochure;