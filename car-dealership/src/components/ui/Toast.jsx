import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import styles from './Toast.module.css';

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertCircle size={18} />,
};

export default function Toast() {
  const { toast, showToast } = useApp();

  const dismiss = () => showToast(null);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <span className={styles.icon}>{ICONS[toast.type] || ICONS.info}</span>
            <span className={styles.message}>{toast.message}</span>
            <button className={styles.close} onClick={dismiss} aria-label="Dismiss">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
