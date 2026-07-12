import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Package, X, Settings } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import AdminVehicleForm from '../ui/AdminVehicleForm';
import styles from '../../styles/layout/AdminDrawer.module.css';

const ACTIONS = [
  { id: 'add', icon: Plus, label: 'Add Vehicle', desc: 'Add a new vehicle to inventory' },
  { id: 'edit', icon: Edit3, label: 'Edit Vehicle', desc: 'Update existing vehicle details' },
  { id: 'restock', icon: Package, label: 'Restock', desc: 'Replenish vehicle inventory' },
  { id: 'delete', icon: Trash2, label: 'Delete Vehicle', desc: 'Remove a vehicle permanently' },
];

export default function AdminDrawer() {
  const { adminDrawerOpen, setAdminDrawer, isAdmin, vehicles } = useApp();
  const [activeAction, setActiveAction] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleAction = (actionId) => {
    if (actionId === 'add') {
      setActiveAction('add');
      setSelectedVehicle(null);
    } else {
      setActiveAction(actionId);
      setSelectedVehicle(vehicles[0] || null);
    }
  };

  const handleClose = () => {
    setAdminDrawer(false);
    setActiveAction(null);
    setSelectedVehicle(null);
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* FAB */}
      <motion.button
        className={styles.fab}
        onClick={() => setAdminDrawer(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Admin Panel"
        id="admin-fab"
      >
        <Settings size={22} />
        <span className={styles.fabPulse} />
      </motion.button>

      {/* Drawer Backdrop */}
      <AnimatePresence>
        {adminDrawerOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {adminDrawerOpen && (
          <motion.aside
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            id="admin-drawer"
          >
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div>
                <p className={styles.drawerEyebrow}>Admin Panel</p>
                <h2 className={styles.drawerTitle}>Inventory Control</h2>
              </div>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close admin panel" id="admin-drawer-close">
                <X size={18} />
              </button>
            </div>

            {/* Vehicle Selector (for edit/restock/delete) */}
            {activeAction && activeAction !== 'add' && (
              <div className={styles.vehicleSelector}>
                <label className={styles.selectorLabel}>Select Vehicle</label>
                <select
                  className={styles.selectorSelect}
                  value={selectedVehicle?.id || ''}
                  onChange={e => setSelectedVehicle(vehicles.find(v => v.id === e.target.value) || null)}
                  id="admin-vehicle-select"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Form or Action List */}
            <AnimatePresence mode="wait">
              {activeAction ? (
                <AdminVehicleForm
                  key={activeAction}
                  mode={activeAction}
                  vehicle={selectedVehicle}
                  onClose={() => setActiveAction(null)}
                />
              ) : (
                <motion.div
                  key="actions"
                  className={styles.actionList}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                >
                  <p className={styles.actionListTitle}>Choose an action</p>
                  {ACTIONS.map(({ id, icon: Icon, label, desc }, i) => (
                    <motion.button
                      key={id}
                      className={`${styles.actionItem} ${id === 'delete' ? styles.deleteAction : ''}`}
                      onClick={() => handleAction(id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ x: 4 }}
                      id={`admin-action-${id}`}
                    >
                      <span className={styles.actionIcon}>
                        <Icon size={18} />
                      </span>
                      <span className={styles.actionText}>
                        <span className={styles.actionLabel}>{label}</span>
                        <span className={styles.actionDesc}>{desc}</span>
                      </span>
                    </motion.button>
                  ))}

                  {/* Stats */}
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <span className={styles.statValue}>{vehicles.length}</span>
                      <span className={styles.statLabel}>Total Models</span>
                    </div>
                    <div className={styles.statCard}>
                      <span className={styles.statValue}>
                        {vehicles.reduce((sum, v) => sum + v.stock, 0)}
                      </span>
                      <span className={styles.statLabel}>Units in Stock</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
