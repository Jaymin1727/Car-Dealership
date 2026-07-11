import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Zap, Fuel, Settings, CheckCircle, Minus, Plus } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import styles from './PurchaseModal.module.css';

export default function PurchaseModal() {
  const { purchaseModal, closePurchaseModal, purchaseVehicle, showToast } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [purchased, setPurchased] = useState(false);

  const vehicle = purchaseModal;

  const handleClose = () => {
    closePurchaseModal();
    setTimeout(() => {
      setQuantity(1);
      setPurchased(false);
    }, 300);
  };

  const handlePurchase = async () => {
    if (!vehicle || vehicle.stock < quantity) return;
    const result = await purchaseVehicle(vehicle.id, quantity);
    if (result.success) {
      setPurchased(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const decrement = () => setQuantity(q => Math.max(1, q - 1));
  const increment = () => setQuantity(q => Math.min(vehicle?.stock || 1, q + 1));

  return (
    <AnimatePresence>
      {vehicle && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            id="purchase-modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Purchase ${vehicle.name}`}
            id="purchase-modal"
          >
            {/* Close */}
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {!purchased ? (
                <motion.div
                  key="form"
                  className={styles.content}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {/* Left — Image */}
                  <div className={styles.imageSection}>
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className={styles.vehicleImage}
                    />
                    <div className={styles.imageMeta}>
                      <span className="badge badge-blue">{vehicle.category}</span>
                      <span className={styles.year}>{vehicle.year}</span>
                    </div>
                  </div>

                  {/* Right — Details */}
                  <div className={styles.detailsSection}>
                    <div>
                      <p className={styles.modalModel}>{vehicle.model}</p>
                      <h2 className={styles.modalName}>{vehicle.name}</h2>
                      <p className={styles.modalDesc}>{vehicle.description}</p>
                    </div>

                    {/* Specs */}
                    <div className={styles.specsGrid}>
                      <div className={styles.specCard}>
                        <Zap size={16} className={styles.specCardIcon} />
                        <span className={styles.specCardValue}>{vehicle.horsepower} hp</span>
                        <span className={styles.specCardLabel}>Power</span>
                      </div>
                      <div className={styles.specCard}>
                        <Settings size={16} className={styles.specCardIcon} />
                        <span className={styles.specCardValue}>{vehicle.transmission}</span>
                        <span className={styles.specCardLabel}>Gearbox</span>
                      </div>
                      <div className={styles.specCard}>
                        <Fuel size={16} className={styles.specCardIcon} />
                        <span className={styles.specCardValue}>{vehicle.fuel}</span>
                        <span className={styles.specCardLabel}>Fuel</span>
                      </div>
                    </div>

                    {/* Price & Qty */}
                    <div className={styles.priceRow}>
                      <div>
                        <p className={styles.pricePerUnit}>${vehicle.price.toLocaleString()} each</p>
                        <p className={styles.totalPrice}>Total: ${(vehicle.price * quantity).toLocaleString()}</p>
                      </div>
                      <div className={styles.qty}>
                        <button className={styles.qtyBtn} onClick={decrement} disabled={quantity <= 1} id="qty-decrement">
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyValue}>{quantity}</span>
                        <button className={styles.qtyBtn} onClick={increment} disabled={quantity >= vehicle.stock} id="qty-increment">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <p className={styles.stockNote}>{vehicle.stock} unit{vehicle.stock !== 1 ? 's' : ''} available</p>

                    {/* CTA */}
                    <motion.button
                      className={`btn btn-primary ${styles.confirmBtn}`}
                      onClick={handlePurchase}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id="confirm-purchase-btn"
                    >
                      <ShoppingCart size={18} />
                      Confirm Purchase — ${(vehicle.price * quantity).toLocaleString()}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  className={styles.successView}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                >
                  <motion.div
                    className={styles.successIcon}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle size={56} />
                  </motion.div>
                  <h2 className={styles.successTitle}>Order Confirmed</h2>
                  <p className={styles.successMsg}>
                    Your {vehicle.name} ×{quantity} has been reserved.
                    Our team will contact you shortly.
                  </p>
                  <p className={styles.successTotal}>${(vehicle.price * quantity).toLocaleString()}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
