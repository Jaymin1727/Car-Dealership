import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Sun, Moon, User, ChevronDown, LogIn, LogOut,
  Shield, ShieldOff, Menu, X
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import AuthModal from '../ui/AuthModal';
import styles from '../../styles/layout/Navbar.module.css';

export default function Navbar({ onInventoryClick, onInsightsClick }) {
  const {
    darkMode, setDarkMode,
    setSearchPanel, searchPanelOpen,
    isAdmin,
    purchases,
    currentUser, logoutUser,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadNotifications = purchases.length;

  const handleDashboardRedirect = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <motion.header
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        id="navbar"
      >
        <div className={styles.inner}>
          <a href="#hero" className={styles.logo} id="nav-logo">
            <span className={styles.logoM}>M</span>
            <span className={styles.logoMotor}> MOTOR</span>
          </a>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <a href="#hero" className={styles.navLink} id="nav-home">Home</a>
            <button className={styles.navLink} onClick={onInventoryClick} id="nav-inventory">Inventory</button>
            <button className={styles.navLink} onClick={onInsightsClick} id="nav-insights">Insights</button>
            <a href="#footer" className={styles.navLink} id="nav-contact">Contact</a>
          </nav>
          <div className={styles.actions}>
            <motion.button
              className={`${styles.iconBtn} ${searchPanelOpen ? styles.iconBtnActive : ''}`}
              onClick={() => setSearchPanel(!searchPanelOpen)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Search"
              id="nav-search-btn"
            >
              <Search size={18} />
            </motion.button>
            <motion.button
              className={styles.iconBtn}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Notifications"
              id="nav-notifications-btn"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className={styles.badge}>{Math.min(unreadNotifications, 9)}</span>
              )}
            </motion.button>
            <motion.button
              className={styles.iconBtn}
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Toggle dark mode"
              id="nav-darkmode-btn"
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            {currentUser ? (
              <div className={styles.profileWrapper} ref={profileRef}>
                <motion.button
                  className={`${styles.profileBtn} ${isAdmin ? styles.adminActive : ''}`}
                  onClick={() => setProfileOpen(v => !v)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  id="nav-profile-btn"
                >
                  {isAdmin ? <Shield size={16} /> : <User size={16} />}
                  <span className={styles.profileLabel}>{isAdmin ? 'Admin' : currentUser.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`${styles.profileChevron} ${profileOpen ? styles.chevronUp : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      id="profile-dropdown"
                    >
                      <div className={styles.dropdownHeader}>
                        <p className={styles.dropdownRole}>{isAdmin ? 'Administrator' : currentUser.name}</p>
                        <p className={styles.dropdownEmail}>{currentUser.email}</p>
                      </div>

                      <div className={styles.dropdownDivider} />

                      {isAdmin && (
                        <button
                          className={styles.dropdownItem}
                          onClick={handleDashboardRedirect}
                          id="admin-dashboard-btn"
                        >
                          <Shield size={15} />
                          Admin Dashboard
                        </button>
                      )}

                      <button
                        className={styles.dropdownItem}
                        onClick={() => {
                          logoutUser();
                          setProfileOpen(false);
                          window.history.pushState({}, '', '/');
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        id="logout-btn"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className={styles.signInBtn}
                onClick={() => setAuthModalOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                id="nav-signin-btn"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </motion.button>
            )}
            <button
              className={`${styles.iconBtn} ${styles.mobileOnly}`}
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Menu"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className={styles.mobileMenu}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              id="mobile-menu"
            >
              <a href="#hero" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Home</a>
              <button className={styles.mobileLink} onClick={() => { onInventoryClick(); setMobileMenuOpen(false); }}>Inventory</button>
              <button className={styles.mobileLink} onClick={() => { onInsightsClick(); setMobileMenuOpen(false); }}>Insights</button>
              <a href="#footer" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleDashboardRedirect}
      />
    </>
  );
}
