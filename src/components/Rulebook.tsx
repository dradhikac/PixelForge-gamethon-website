import "./Rulebook.css";

const Rulebook = () => {
  return (
    <main className="rulebook-page">
      <iframe
        src="/gamecraft-rulebook.pdf#toolbar=0&navpanes=0&scrollbar=1"
        title="GAMECRAFT 2026 Rulebook"
        className="rulebook-iframe"
      />
    </main>
  );
};

export default Rulebook;