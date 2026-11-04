const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

code = code.replace(
`          <div className="footer-social">
            <h4 className="footer-heading">Connect</h4>

            <div className="social-links">
              <a
                href={eventConfig.social.instagram}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>

              <a
                href={eventConfig.social.linkedin}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>

              <a
                href={eventConfig.social.twitter}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>

              <a
                href={eventConfig.social.discord}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </div>
          </div>
        </div>`,
`          <div className="footer-social">
            <h4 className="footer-heading">Connect</h4>

            <div className="social-links">
              <a
                href={eventConfig.social.instagram}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>

              <a
                href={eventConfig.social.linkedin}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>

              <a
                href={eventConfig.social.twitter}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>

              <a
                href={eventConfig.social.discord}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </div>
          </div>
        </motion.div>`
);

fs.writeFileSync('src/components/Footer.tsx', code);
