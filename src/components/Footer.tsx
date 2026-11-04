import { eventConfig } from '../config/eventConfig';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Organization Column */}
          <div className="footer-col-brand">
            <div className="footer-brand-header">
              <span className="footer-crest-icon">⚔️</span>
              <span className="footer-brand-title">PIXEL FORGE</span>
              <span className="footer-year-badge">// 2026</span>
            </div>

            <p className="footer-tagline-text">{eventConfig.tagline}</p>

            <div className="footer-org-box">
              <span className="org-label">ORGANIZED BY:</span>
              <p className="org-name">{eventConfig.organizer}</p>
              <p className="org-institute">{eventConfig.institute}</p>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="footer-col-links">
            <h4 className="footer-col-heading">NAVIGATION</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="#about" onClick={(e) => scrollToSection(e, '#about')}>
                  About Hackathon
                </a>
              </li>
              <li>
                <a href="#events" onClick={(e) => scrollToSection(e, '#events')}>
                  The Six Arenas
                </a>
              </li>
              <li>
                <a href="#challenge" onClick={(e) => scrollToSection(e, '#challenge')}>
                  30-Hour Build Sprint
                </a>
              </li>
              <li>
                <a href="#prizes" onClick={(e) => scrollToSection(e, '#prizes')}>
                  Prizes & Recognition
                </a>
              </li>
              <li>
                <a href="#schedule" onClick={(e) => scrollToSection(e, '#schedule')}>
                  Event Schedule
                </a>
              </li>
              <li>
                <a href="#rules" onClick={(e) => scrollToSection(e, '#rules')}>
                  Rules of Engagement
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => scrollToSection(e, '#faq')}>
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="/brochure">Official Brochure PDF</a>
              </li>
              <li>
                <a href="/rulebook">Official Rulebook PDF</a>
              </li>
              <li>
                <a href="/registration" className="footer-highlight-link">
                  Register Your Team →
                </a>
              </li>
            </ul>
          </div>

          {/* Coordinators & Contacts Column */}
          <div className="footer-col-contact">
            <h4 className="footer-col-heading">EVENT COORDINATORS</h4>

            <div className="coordinators-group">
              <span className="coord-group-title">Faculty Coordinators:</span>
              {eventConfig.contact.faculty.map((contact, i) => (
                <div key={i} className="coord-card">
                  <span className="coord-name">{contact.name}</span>
                  <a href={`mailto:${contact.email}`} className="coord-email">
                    {contact.email}
                  </a>
                  <a href={`tel:${contact.phone}`} className="coord-phone">
                    📞 +91 {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="coordinators-group">
              <span className="coord-group-title">Student Coordinators:</span>
              <div className="students-grid">
                {eventConfig.contact.students.map((contact, i) => (
                  <div key={i} className="student-coord-item">
                    <span className="student-name">{contact.name}</span>
                    <a href={`tel:${contact.phone}`} className="student-phone">
                      📞 {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Venue & Location Column */}
          <div className="footer-col-venue">
            <h4 className="footer-col-heading">ARENA VENUE</h4>
            <p className="footer-venue-text">
              <strong>Dayananda Sagar Academy of Technology and Management</strong>
              <br />
              {eventConfig.contact.address}
            </p>
            <a
              href={eventConfig.venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-map-btn"
            >
              <span>Get Directions on Google Maps</span>
              <span>↗</span>
            </a>
            <div className="footer-admin-link">
              <a href="/admin">Staff Admin Portal</a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="footer-bottom-strip">
          <p className="copyright-text">
            © {currentYear} PIXEL FORGE. Dayananda Sagar Academy of Technology & Management. All rights reserved.
          </p>
          <span className="voxel-signature">Crafted with ⚔️ for PIXEL FORGE 2026</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
