import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventConfig } from '../config/eventConfig';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
  tag: string;
}

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Who is eligible to participate in PIXEL FORGE 2026?",
      answer: "PIXEL FORGE is open to all students currently enrolled in any recognized undergraduate or postgraduate degree program (Engineering, Design, Economics, Mathematics, Computer Applications, etc.). A valid college ID card is required at check-in.",
      tag: "ELIGIBILITY"
    },
    {
      question: "Can we form a team with members from different colleges?",
      answer: "Yes! Cross-college and cross-disciplinary teams are fully permitted and actively encouraged. Teams must consist of 3 to 4 members. One member must be designated as the Team Lead.",
      tag: "TEAMS"
    },
    {
      question: "What is the registration fee and what does it include?",
      answer: `The registration fee is ${eventConfig.registrationFee} (fixed for the whole team of 3–4 members). It covers participation in the flagship 30-Hour Pixel Forge Challenge, up to two district arena tournaments, access to overnight build facilities, event meals/refreshments, and official certification.`,
      tag: "REGISTRATION"
    },
    {
      question: "What game engines and software can we use for the build challenge?",
      answer: "You are free to use any game engine (Unity, Godot, Unreal Engine, Web/Three.js, Pygame, Phaser, etc.) or custom frameworks. Open-source assets and libraries are allowed, but the core strategic mechanics must be created during the 30-hour hackathon window.",
      tag: "DEVELOPMENT"
    },
    {
      question: "Is overnight stay permitted on campus for the 30-hour sprint?",
      answer: "Yes. Registered teams participating in the 30-Hour Pixel Forge Challenge are provided access to dedicated, secure on-campus labs with power outlets, Wi-Fi, and continuous campus security.",
      tag: "LOGISTICS"
    },
    {
      question: "How does the final Demo Expo and judging process work?",
      answer: "On Day 2 at 5:00 PM, teams present their playable games at their designated Demo Expo booth. Each team receives 3–5 minutes to demo gameplay and pitch their underlying game-theoretic strategy to our panel of faculty and industry judges.",
      tag: "JUDGING"
    },
    {
      question: "Where is the event venue and how do we reach DSATM?",
      answer: "Dayananda Sagar Academy of Technology and Management (DSATM) is located on Kanakapura Main Road, Udayapura, Bengaluru (Pin: 560082). It is easily accessible via the Bengaluru Namma Metro Green Line (Silk Institute station) and BMTC bus routes.",
      tag: "VENUE"
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="faq-header">
          <span className="section-kicker">// 07 CLARIFICATIONS</span>
          <h2 className="section-title">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="section-subtitle">
            Everything you need to know before stepping into the arena.
          </p>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                className={`faq-item-card ${isOpen ? 'open' : ''}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-q-left">
                    <span className="faq-tag-badge">{item.tag}</span>
                    <span className="faq-q-text">{item.question}</span>
                  </div>
                  <span className="faq-expand-icon">{isOpen ? "−" : "+"}</span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="faq-answer-inner">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="faq-support-box">
          <p>
            Have another question? Reach out to the student team at{" "}
            <a href="mailto:gamecraftsupport2026@gmail.com">gamecraftsupport2026@gmail.com</a>{" "}
            or check our <a href="/rulebook">Rulebook</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

