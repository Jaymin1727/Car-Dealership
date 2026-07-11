import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, BarChart2, Heart, Settings, ChevronRight } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '#hero', id: 'sidebar-home' },
  { icon: LayoutGrid, label: 'Inventory', href: '#inventory', id: 'sidebar-inventory' },
  { icon: BarChart2, label: 'Analytics', href: '#analytics', id: 'sidebar-analytics' },
  { icon: Heart, label: 'Favourites', href: '#', id: 'sidebar-favourites' },
  { icon: Settings, label: 'Settings', href: '#', id: 'sidebar-settings' },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      className={styles.sidebar}
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      id="sidebar"
    >
      <motion.div
        className={styles.inner}
        animate={{ width: expanded ? 200 : 56 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {NAV_ITEMS.map(({ icon: Icon, label, href, id }) => (
          <a key={id} href={href} className={styles.navItem} id={id} tabIndex={0}>
            <span className={styles.iconWrap}>
              <Icon size={18} />
            </span>
            <motion.span
              className={styles.label}
              animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -8 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
            {expanded && (
              <motion.span
                className={styles.arrow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <ChevronRight size={14} />
              </motion.span>
            )}
          </a>
        ))}
      </motion.div>
    </motion.aside>
  );
}
