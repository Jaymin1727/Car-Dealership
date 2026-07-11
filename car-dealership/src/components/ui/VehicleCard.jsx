import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Fuel, Settings, ShoppingCart, Eye, Star } from 'lucide-react';
import StockBar from '../common/StockBar';
import { useApp } from '../../store/AppContext';
import styles from './VehicleCard.module.css';

const CATEGORY_COLORS = {
  Coupe: 'blue',
  Sedan: 'green',
  SUV: 'amber',
  Sports: 'blue',
  Electric: 'green',
  Luxury: 'grey',
};

export default function VehicleCard({ vehicle, index = 0 }) {
  const { openPurchaseModal } = useApp();
  const [imgLoaded, setImgLoaded] = useState(false);

  const isSoldOut = vehicle.stock === 0;
  const badgeColor = CATEGORY_COLORS[vehicle.category] || 'grey';

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        {!imgLoaded && <div className={`${styles.imgSkeleton} skeleton`} />}
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className={`${styles.image} ${imgLoaded ? styles.imageVisible : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges */}
        <div className={styles.imageBadges}>
          <span className={`badge badge-${badgeColor}`}>{vehicle.category}</span>
          {vehicle.tags?.slice(0, 1).map(tag => (
            <span key={tag} className="badge badge-dark">{tag}</span>
          ))}
        </div>

        {/* Featured star */}
        {vehicle.featured && (
          <div className={styles.featuredBadge}>
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        )}

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className={styles.soldOutOverlay}>
            <span>Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.model}>{vehicle.model} · {vehicle.year}</p>
            <h3 className={styles.name}>{vehicle.name}</h3>
          </div>
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>From</span>
            <span className={styles.price}>${vehicle.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Specs Row */}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <Zap size={14} className={styles.specIcon} />
            <span>{vehicle.horsepower} hp</span>
          </div>
          <div className={styles.specDivider} />
          <div className={styles.specItem}>
            <Settings size={14} className={styles.specIcon} />
            <span>{vehicle.transmission}</span>
          </div>
          <div className={styles.specDivider} />
          <div className={styles.specItem}>
            <Fuel size={14} className={styles.specIcon} />
            <span>{vehicle.fuel}</span>
          </div>
        </div>

        {/* Acceleration */}
        <p className={styles.acceleration}>{vehicle.acceleration}</p>

        {/* Stock Bar */}
        <StockBar stock={vehicle.stock} maxStock={vehicle.maxStock} />

        {/* Actions */}
        <div className={styles.actions}>
          <motion.button
            className={`btn btn-primary ${styles.purchaseBtn} ${isSoldOut ? styles.disabled : ''}`}
            onClick={() => !isSoldOut && openPurchaseModal(vehicle)}
            disabled={isSoldOut}
            whileHover={!isSoldOut ? { scale: 1.02 } : {}}
            whileTap={!isSoldOut ? { scale: 0.97 } : {}}
            id={`purchase-${vehicle.id}`}
          >
            <ShoppingCart size={15} />
            {isSoldOut ? 'Sold Out' : 'Purchase'}
          </motion.button>
          <motion.button
            className={`btn btn-ghost ${styles.viewBtn}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            id={`view-${vehicle.id}`}
          >
            <Eye size={15} />
            Details
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
