import { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import VehicleCard from '../ui/VehicleCard';
import styles from './InventorySection.module.css';

export default function InventorySection() {
  const { filteredVehicles, setSearchPanel } = useApp();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section className={styles.inventory} id="inventory" ref={containerRef}>
      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="section-eyebrow">Discover</div>
          <div className={styles.headerRow}>
            <h2 className="section-title">Our Collection</h2>
            <button
              className={styles.searchTrigger}
              onClick={() => setSearchPanel(true)}
              id="inventory-search-trigger"
            >
              <Search size={16} />
              <span>Search & Filter</span>
            </button>
          </div>
        </motion.div>

        {/* Grid */}
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
              ))
            ) : (
              <motion.div
                key="empty"
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.emptyIcon}>
                  <Search size={32} />
                </div>
                <h3 className={styles.emptyTitle}>No vehicles found</h3>
                <p className={styles.emptyDesc}>
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
                <button
                  className="btn btn-ghost"
                  onClick={() => setSearchPanel(true)}
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
