import styles from './StockBar.module.css';

/**
 * StockBar — Animated stock progress bar
 * @param {number} stock - Current stock
 * @param {number} maxStock - Maximum stock
 */
export default function StockBar({ stock, maxStock }) {
  const pct = Math.max(0, Math.min(100, (stock / maxStock) * 100));
  const isLow = pct <= 25;
  const isEmpty = pct === 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        <span className={styles.label}>Stock</span>
        <span className={`${styles.value} ${isLow ? styles.low : ''} ${isEmpty ? styles.empty : ''}`}>
          {isEmpty ? 'Out of Stock' : `${stock} / ${maxStock}`}
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${isLow ? styles.fillLow : ''} ${isEmpty ? styles.fillEmpty : ''}`}
          style={{ '--bar-pct': `${pct}%` }}
        />
      </div>
    </div>
  );
}
