const fs = require('fs');

let code = `import { motion } from 'framer-motion';
import './Challenge.css';

const Challenge = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const criteriaVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="challenge" className="challenge">
      <div className="container">
        <motion.div
          className="challenge-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="challenge-header">
            <span className="challenge-label">GAMECRAFT HQ</span>
            <h2 className="challenge-title pixel-text">
              30-HOUR BUILD CHALLENGE
            </h2>
            <p className="challenge-subtitle">
              FINAL MISSION
            </p>
          </div>

          <div className="challenge-grid">
            <div className="challenge-info">
              <h3 className="challenge-section-title">THE MISSION</h3>
              <p className="challenge-description">
                Design and build a <strong>playable game</strong> that embeds a real strategic or
                game-theoretic concept. This is the flagship event — teams have exactly{' '}
                <strong>30 hours</strong> to go from concept to playable demo.
              </p>

              <motion.div 
                className="challenge-timeline"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { marker: 'START', time: 'Day 1 — 10:30 AM', desc: 'Challenge briefing & kickoff' },
                  { marker: 'BUILD', time: '30 Hours', desc: 'Design, develop, and test your game' },
                  { marker: 'SUBMIT', time: 'Day 2 — 4:30 PM', desc: 'Final submission deadline' },
                  { marker: 'DEMO', time: 'Day 2 — 5:00 PM', desc: 'Present to judges & sponsors' }
                ].map((item, i, arr) => (
                  <div key={item.marker} style={{ display: 'flex', flexDirection: 'column' }}>
                    <motion.div className="timeline-item" variants={itemVariants}>
                      <div className="timeline-marker">{item.marker}</div>
                      <div className="timeline-content">
                        <strong>{item.time}</strong>
                        <p>{item.desc}</p>
                      </div>
                    </motion.div>
                    {i < arr.length - 1 && (
                      <motion.div className="timeline-arrow" variants={itemVariants}>↓</motion.div>
                    )}
                  </div>
                ))}
              </motion.div>

              <div className="challenge-requirements">
                <h4>What You'll Submit:</h4>
                <ul>
                  <li>Playable build (digital or physical prototype)</li>
                  <li>One-page design note</li>
                  <li>3-minute Demo Expo pitch</li>
                </ul>
              </div>
            </div>

            <div className="challenge-countdown-wrapper">
              <motion.div 
                className="challenge-phases"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h4>Judging Criteria:</h4>
                {[
                  { name: 'Strategic Fidelity', weight: '35%' },
                  { name: 'Playability', weight: '25%' },
                  { name: 'Emergent Strategy', weight: '25%' },
                  { name: 'Polish', weight: '15%' }
                ].map((phase) => (
                  <motion.div key={phase.name} className="phase-item" variants={criteriaVariants}>
                    <span className="phase-name">{phase.name}</span>
                    <span className="phase-weight">{phase.weight}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Challenge;
`;

fs.writeFileSync('src/components/Challenge.tsx', code);
