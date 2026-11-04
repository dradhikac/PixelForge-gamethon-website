import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { championshipSchedule, type ScheduleEvent } from '../data/schedule';
import './Schedule.css';

/* ==========================================================================
   ICONS (INLINE SVGs - Zero Dependency, Crisp Geometric Styling, No Emojis)
   ========================================================================== */

/* Golden Game Controller SVG for decorative divider */
const GameControllerDividerSvg = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="#ffd000"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM9 13H7V15H6V13H4V12H6V10H7V12H9V13ZM17.5 14.5C16.67 14.5 16 13.83 16 13C16 12.17 16.67 11.5 17.5 11.5C18.33 11.5 19 12.17 19 13C19 13.83 18.33 14.5 17.5 14.5ZM19.5 10.5C18.67 10.5 18 9.83 18 9C18 8.17 18.67 7.5 19.5 7.5C20.33 7.5 21 8.17 21 9C21 9.83 20.33 10.5 19.5 10.5Z" />
  </svg>
);

/* Clock Outline SVG for Timestamps */
const ClockOutlineSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* Calendar Icon for Header Badge */
const CalendarIconSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffd000"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* Category Icon Selector */
const EventCategoryIcon = ({ category }: { category: ScheduleEvent['category'] }) => {
  switch (category) {
    case 'game':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 12h4m-2-2v4" />
          <circle cx="17" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case 'build':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'keynote':
    case 'briefing':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      );
    case 'ceremony':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
          <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
          <path d="M4 5h16v7a8 8 0 0 1-16 0V5z" />
          <path d="M12 15v5m-4 0h8" />
        </svg>
      );
    case 'expo':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'break':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      );
    case 'check-in':
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      );
  }
};

/* ==========================================================================
   SCHEDULE COMPONENT
   ========================================================================== */

const Schedule = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const activeDay = championshipSchedule[activeDayIndex];

  return (
    <section id="schedule" className="sched-section" aria-label="Championship Schedule">
      {/* Background Pixel & Ambient Glow Decorations */}
      <div className="sched-pixel-block-tl" aria-hidden="true" />
      <div className="sched-pixel-block-tr" aria-hidden="true" />
      <div className="sched-pixel-block-bl" aria-hidden="true" />
      <div className="sched-pixel-block-br" aria-hidden="true" />
      <div className="sched-ambient-glow" aria-hidden="true" />

      <div className="sched-container">
        {/* Header Group */}
        <div className="sched-header-group">
          {/* Section Kicker Badge */}
          <motion.div
            className="sched-kicker-badge"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span className="sched-kicker-slash">//</span>
            <span className="sched-kicker-text">05 CHRONOLOGY</span>
            <span className="sched-kicker-slash">//</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            className="sched-main-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            CHAMPIONSHIP <span className="sched-heading-gold">SCHEDULE</span>
          </motion.h2>

          {/* Championship Dates Pill */}
          <motion.div
            className="sched-date-pill"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <CalendarIconSvg />
            <span className="sched-date-pill-text">NOVEMBER 19–20, 2026</span>
          </motion.div>

          {/* Subtitle Description */}
          <motion.p
            className="sched-header-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            Two days of high-intensity game theory challenges, overnight building,
            and the ultimate live demo expo.
          </motion.p>

          {/* Horizontal Golden Divider */}
          <div className="sched-divider-row" aria-hidden="true">
            <span className="sched-divider-line left" />
            <div className="sched-divider-controller">
              <GameControllerDividerSvg />
            </div>
            <span className="sched-divider-line right" />
          </div>

          {/* Interactive Day Tabs */}
          <div className="sched-day-tabs" role="tablist" aria-label="Schedule Days">
            {championshipSchedule.map((day, idx) => {
              const isActive = activeDayIndex === idx;
              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  role="tab"
                  id={`sched-tab-${day.dayNumber}`}
                  aria-selected={isActive}
                  aria-controls={`sched-panel-${day.dayNumber}`}
                  className={`sched-day-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveDayIndex(idx)}
                >
                  <div className="sched-tab-content">
                    <span className="sched-tab-day-label">DAY 0{day.dayNumber}</span>
                    <span className="sched-tab-date-label">{day.dateLabel}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeScheduleTabGlow"
                      className="sched-tab-active-glow"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Timeline Panel with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDayIndex}
            id={`sched-panel-${activeDay.dayNumber}`}
            role="tabpanel"
            aria-labelledby={`sched-tab-${activeDay.dayNumber}`}
            className="sched-timeline-wrapper"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            {/* Day Header Banner */}
            <div className="sched-day-focus-banner">
              <div className="sched-focus-tag">
                <span className="sched-focus-day">DAY 0{activeDay.dayNumber}</span>
                <span className="sched-focus-divider">|</span>
                <span className="sched-focus-date">{activeDay.dateLabel}</span>
              </div>
              <h3 className="sched-focus-title">{activeDay.subtitle}</h3>
            </div>

            {/* Vertical Timeline Container */}
            <div className="sched-timeline-list">
              <div className="sched-timeline-spine" aria-hidden="true" />

              {activeDay.events.map((event, index) => {
                const accentClass = event.accent ? `accent-${event.accent}` : 'accent-purple';
                const milestoneClass = event.isMilestone ? 'is-milestone' : '';

                return (
                  <motion.div
                    key={`${activeDayIndex}-${event.time}-${index}`}
                    className={`sched-timeline-item ${accentClass} ${milestoneClass}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.035 }}
                  >
                    {/* Timestamp Box */}
                    <div className="sched-time-col">
                      <div className="sched-time-pill">
                        <span className="sched-clock-icon">
                          <ClockOutlineSvg />
                        </span>
                        <span className="sched-time-text">{event.time}</span>
                      </div>
                    </div>

                    {/* Timeline Spine Node Marker */}
                    <div className="sched-node-col" aria-hidden="true">
                      <div className="sched-node-marker">
                        <div className="sched-node-inner" />
                      </div>
                    </div>

                    {/* Event Detail Card */}
                    <div className="sched-event-card">
                      <div className="sched-card-top-row">
                        <h4 className="sched-event-title">{event.title}</h4>
                        <span className={`sched-badge-pill ${accentClass}`}>
                          <EventCategoryIcon category={event.category} />
                          <span className="sched-badge-text">{event.badge}</span>
                        </span>
                      </div>

                      {event.description && (
                        <p className="sched-event-desc">{event.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Mission Note */}
        <div className="sched-footer-banner">
          <div className="sched-footer-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="sched-footer-text">
            <strong>30-Hour Build Sprint Protocol:</strong> Development begins after kickoff at <strong>10:30 AM on Day 1</strong> and runs continuously through <strong>11:15 AM on Day 2</strong>. Overnight lab workspaces and faculty mentoring are provided on site.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
