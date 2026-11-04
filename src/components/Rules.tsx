import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { rulesData } from '../data/rules';
import './Rules.css';

const Rules = () => {
  const [openCategory, setOpenCategory] = useState<string | null>("eligibility");

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const highlights = [
    { icon: "👥", label: "Team Size", value: "3–4 Members", color: "var(--pf-pink)" },
    { icon: "🎮", label: "Arena Games", value: "3 Live Arenas", color: "var(--pf-cyan)" },
    { icon: "🎓", label: "Eligibility", value: "All Enrolled Students", color: "var(--pf-green)" },
    { icon: "🌐", label: "Squads", value: "Cross-College Allowed", color: "var(--pf-golden-yellow)" }
  ];

  return (
    <section id="rules" className="rules-section">
      <div className="container">
        {/* Header */}
        <div className="rules-header">
          <span className="section-kicker">//  PROTOCOL //</span>
          <h2 className="section-title">RULES OF ENGAGEMENT</h2>
          <p className="section-subtitle">
            Essential guidelines, fairness protocols, and competition regulations.
          </p>
        </div>

        {/* 4 Quick Highlights Grid */}
        <div className="rules-highlights-grid">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rule-highlight-card"
              style={{ borderColor: item.color }}
            >
              <span className="highlight-icon-box">{item.icon}</span>
              <div className="highlight-text-wrap">
                <span className="highlight-meta-label">{item.label}</span>
                <span className="highlight-meta-val">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Categories Accordion */}
        <div className="rules-accordion-container">
          {rulesData.map((category) => {
            const isOpen = openCategory === category.id;
            return (
              <div
                key={category.id}
                className={`rule-accordion-panel ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="rule-accordion-header-btn"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isOpen}
                >
                  <div className="rule-btn-left">
                    <span className="rule-bullet-point">◆</span>
                    <span className="rule-cat-title">{category.title}</span>
                  </div>
                  <span className="rule-toggle-icon">{isOpen ? "−" : "+"}</span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="rule-accordion-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ul className="rule-items-ul">
                        {category.rules.map((rule, idx) => (
                          <li key={idx} className="rule-single-li">
                            <span className="rule-item-check">✓</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default Rules;
