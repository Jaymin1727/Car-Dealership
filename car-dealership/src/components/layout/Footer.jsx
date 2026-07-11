import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

const LINKS = {
  Models: ['BMW M2', 'BMW M3', 'BMW M4', 'BMW M5', 'BMW M8', 'BMW X5 M'],
  Company: ['About Us', 'Careers', 'Press', 'Contact', 'Showrooms'],
  Services: ['Test Drive', 'Financing', 'Insurance', 'Maintenance', 'Trade-In'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
};

// Inline SVGs for brand icons as Lucide removed them
const Instagram = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Twitter = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Linkedin = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Youtube = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      {/* Top Section */}
      <div className={styles.top}>
        <div className="container">
          <div className={styles.topInner}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.brandLogo}>
                <span className={styles.logoM}>M</span>
                <span className={styles.logoMotor}> MOTOR</span>
              </div>
              <p className={styles.brandTagline}>Experience Precision Engineering</p>
              <p className={styles.brandDesc}>
                The ultimate BMW M destination. Premium vehicles, uncompromising quality, extraordinary experiences.
              </p>
              {/* Newsletter */}
              <div className={styles.newsletter}>
                <label className={styles.newsletterLabel}>Stay in the fast lane</label>
                <div className={styles.newsletterRow}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={styles.newsletterInput}
                    id="newsletter-input"
                  />
                  <button className={`btn btn-primary ${styles.newsletterBtn}`} id="newsletter-submit">
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            <div className={styles.linkColumns}>
              {Object.entries(LINKS).map(([title, links]) => (
                <div key={title} className={styles.linkColumn}>
                  <h4 className={styles.columnTitle}>{title}</h4>
                  <ul className={styles.columnLinks}>
                    {links.map(link => (
                      <li key={link}>
                        <a href="#" className={styles.link}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} M Motor. Built for Incubyte Full Stack Assessment.
            </p>

            <div className={styles.socials}>
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  className={styles.socialBtn}
                  aria-label={label}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>

            <p className={styles.poweredBy}>
              Powered by React 19 + Three.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
