import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, User, Eye, EyeOff,
  LogIn, UserPlus, AlertCircle, CheckCircle2, Car
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import styles from '../../styles/ui/AuthModal.module.css';

function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak' };
  if (score <= 3) return { level: 2, label: 'Medium' };
  return { level: 3, label: 'Strong' };
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const { loginUser, registerUser } = useApp();
  const [activeTab, setActiveTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setLoginEmail('');
      setLoginPassword('');
      setShowLoginPassword(false);
      setLoginError('');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setShowRegPassword(false);
      setRegError('');
      setRegSuccess('');
    }
  }, [isOpen]);

  useEffect(() => {
    setLoginError('');
    setRegError('');
    setRegSuccess('');
  }, [activeTab]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please fill in all fields.');
      return;
    }

    const result = await loginUser(loginEmail.trim(), loginPassword);
    if (result.success) {
      onClose();
      if (result.isAdmin) {
        onLoginSuccess?.();
      }
    } else {
      setLoginError(result.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setRegError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    const result = await registerUser(regName.trim(), regEmail.trim(), regPassword);
    if (result.success) {
      setRegSuccess('Account created! Redirecting...');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setRegError(result.message);
    }
  };

  const strength = getPasswordStrength(regPassword);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          id="auth-modal-overlay"
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            id="auth-modal"
          >
            <div className={styles.header}>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close" id="auth-close-btn">
                <X size={16} />
              </button>
              <div className={styles.logoIcon}>
                <Car size={26} />
              </div>
              <h2 className={styles.title}>
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className={styles.subtitle}>
                {activeTab === 'login'
                  ? 'Sign in to access your dashboard'
                  : 'Join MMotor for the best experience'}
              </p>
            </div>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('login')}
                id="auth-tab-login"
              >
                Sign In
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('register')}
                id="auth-tab-register"
              >
                Register
              </button>
            </div>

            <div className={styles.body}>
              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.form
                    key="login"
                    className={styles.form}
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    id="login-form"
                  >
                    {loginError && (
                      <div className={styles.error}>
                        <AlertCircle size={14} />
                        {loginError}
                      </div>
                    )}

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="login-email">Email</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}><Mail size={16} /></span>
                        <input
                          type="email"
                          id="login-email"
                          className={styles.input}
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="login-password">Password</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}><Lock size={16} /></span>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          id="login-password"
                          className={styles.input}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className={styles.togglePassword}
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.formOptions}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" className={styles.checkbox} />
                        Remember me
                      </label>
                      <button type="button" className={styles.forgotLink}>Forgot password?</button>
                    </div>

                    <button type="submit" className={styles.submitBtn} id="login-submit-btn">
                      <LogIn size={16} />
                      Sign In
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    className={styles.form}
                    onSubmit={handleRegister}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    id="register-form"
                  >
                    {regError && (
                      <div className={styles.error}>
                        <AlertCircle size={14} />
                        {regError}
                      </div>
                    )}
                    {regSuccess && (
                      <div className={styles.success}>
                        <CheckCircle2 size={14} />
                        {regSuccess}
                      </div>
                    )}

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="reg-name">Full Name</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}><User size={16} /></span>
                        <input
                          type="text"
                          id="reg-name"
                          className={styles.input}
                          placeholder="User name"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="reg-email">Email</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}><Mail size={16} /></span>
                        <input
                          type="email"
                          id="reg-email"
                          className={styles.input}
                          placeholder="user@gmail.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="reg-password">Password</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}><Lock size={16} /></span>
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          id="reg-password"
                          className={styles.input}
                          placeholder="At least 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className={styles.togglePassword}
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {regPassword.length > 0 && (
                        <>
                          <div className={styles.strengthBar}>
                            {[1, 2, 3].map((seg) => (
                              <div
                                key={seg}
                                className={`${styles.strengthSegment} ${strength.level >= seg
                                  ? strength.level === 1
                                    ? styles.strengthWeak
                                    : strength.level === 2
                                      ? styles.strengthMedium
                                      : styles.strengthStrong
                                  : ''
                                  }`}
                              />
                            ))}
                          </div>
                          <span className={styles.strengthText}>{strength.label}</span>
                        </>
                      )}
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="reg-confirm-password">Confirm Password</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}><Lock size={16} /></span>
                        <input
                          type="password"
                          id="reg-confirm-password"
                          className={styles.input}
                          placeholder="Re-enter your password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} id="register-submit-btn">
                      <UserPlus size={16} />
                      Create Account
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.footer}>
              {activeTab === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button className={styles.footerLink} onClick={() => setActiveTab('register')}>
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button className={styles.footerLink} onClick={() => setActiveTab('login')}>
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
