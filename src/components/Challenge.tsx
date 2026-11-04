import { motion } from 'framer-motion';
import './Challenge.css';

const Challenge = () => {
  const roadmapSteps = [
    {
      marker: "START",
      time: "Day 1 — 10:30 AM",
      title: "Kickoff & Problem Reveal",
      desc: "Theme announcement, strategy brief, and clock starts."
    },
    {
      marker: "BUILD",
      time: "30 Continuous Hours",
      title: "Design & Development Sprint",
      desc: "Mechanics, art, testing, and overnight building in secure labs."
    },
    {
      marker: "SUBMIT",
      time: "Day 2 — 04:30 PM",
      title: "Code Freeze & Submission",
      desc: "Playable builds and 1-page design notes uploaded."
    },
    {
      marker: "DEMO",
      time: "Day 2 — 05:00 PM",
      title: "Demo Expo & Judging Pitch",
      desc: "3-minute live presentation to faculty and industry judges."
    }
  ];

  const criteria = [
    { name: "Strategic Fidelity", weight: "35%", desc: "Depth and accuracy of the embedded game theory concepts." },
    { name: "Playability & Fun", weight: "25%", desc: "Intuitive mechanics, gameplay loops, and player experience." },
    { name: "Emergent Strategy", weight: "25%", desc: "Player agency, meaningful choices, and tactical depth." },
    { name: "Craft & Polish", weight: "15%", desc: "Audio-visual design, bug-free execution, and presentation." }
  ];

  return (
    <section id="challenge" className="build-section" aria-label="30-Hour Build Challenge">
      {/* Decorative Outer Pixel Blocks */}
      <div className="build-pixel-block-tl" aria-hidden="true" />
      <div className="build-pixel-block-tr" aria-hidden="true" />
      <div className="build-pixel-block-bl" aria-hidden="true" />
      <div className="build-pixel-block-br" aria-hidden="true" />
      <div className="build-ambient-glow" aria-hidden="true" />

      <div className="build-container">
        {/* Header Group */}
        <div className="build-header-group">
          <motion.div
            className="build-kicker-badge"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span className="build-kicker-slash">//</span>
            <span className="build-kicker-text">FLAGSHIP MISSION</span>
            <span className="build-kicker-slash">//</span>
          </motion.div>

          <motion.h2
            className="build-main-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            30-HOUR BUILD CHALLENGE
          </motion.h2>

          <motion.p
            className="build-header-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            From zero to a playable game demo in 30 continuous hours.
            Embed real strategic concepts and pitch live to industry leaders.
          </motion.p>
        </div>

        {/* Two-Panel Layout */}
        <div className="build-grid-layout">
          {/* Left Panel: Roadmap & Deliverables */}
          <motion.div
            className="build-panel build-panel-left"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="build-panel-inner-header">
              <span className="build-panel-badge">ROADMAP</span>
              <h3 className="build-panel-title">The 30-Hour Sprint</h3>
            </div>

            {/* Timeline */}
            <div className="build-timeline">
              {roadmapSteps.map((step, idx) => (
                <div key={step.marker} className="build-timeline-node">
                  <div className="build-node-marker-col">
                    <span className="build-node-marker-badge">{step.marker}</span>
                    {idx < roadmapSteps.length - 1 && <span className="build-node-spine" />}
                  </div>
                  <div className="build-node-content">
                    <span className="build-node-timestamp">{step.time}</span>
                    <h4 className="build-node-heading">{step.title}</h4>
                    <p className="build-node-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Submission Checklist */}
            <div className="build-deliverables-box">
              <h4 className="build-deliverables-heading">WHAT YOUR SQUAD SUBMITS:</h4>
              <div className="build-deliverables-grid">
                <div className="build-deliverable-item">
                  <span className="build-deliverable-icon" aria-hidden="true">🎮</span>
                  <span className="build-deliverable-text">Playable Game Build (Web / PC / Mobile / Prototype)</span>
                </div>
                <div className="build-deliverable-item">
                  <span className="build-deliverable-icon" aria-hidden="true">📝</span>
                  <span className="build-deliverable-text">1-Page Strategy & Mechanism Design Note</span>
                </div>
                <div className="build-deliverable-item">
                  <span className="build-deliverable-icon" aria-hidden="true">🎤</span>
                  <span className="build-deliverable-text">3-Minute Live Demo Pitch at the Demo Expo</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Judging Rubric & Technology */}
          <motion.div
            className="build-panel build-panel-right"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="build-panel-inner-header">
              <span className="build-panel-badge">EVALUATION</span>
              <h3 className="build-panel-title">Judging Criteria & Weightage</h3>
            </div>

            {/* Criteria List */}
            <div className="build-criteria-list">
              {criteria.map((item) => (
                <div key={item.name} className="build-criterion-item">
                  <div className="build-criterion-top">
                    <span className="build-criterion-name">{item.name}</span>
                    <span className="build-criterion-weight-pill">{item.weight}</span>
                  </div>
                  <div className="build-progress-bar">
                    <div
                      className="build-progress-fill"
                      style={{ width: item.weight }}
                    />
                  </div>
                  <p className="build-criterion-desc">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Allowed Tech Stacks */}
            <div className="build-tech-freedom-box">
              <div className="build-tech-header">
                <span className="build-tech-icon" aria-hidden="true">🛠️</span>
                <span className="build-tech-title">ANY ENGINE. COMPLETE CREATIVE FREEDOM.</span>
              </div>
              <p className="build-tech-text">
                Build in Unity, Godot, Unreal Engine, WebGL/Three.js, Pygame, or custom frameworks.
                Asset packs and open-source libraries are permitted; core game logic must be written on site.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Challenge;
