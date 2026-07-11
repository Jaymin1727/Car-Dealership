import { useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, DollarSign, Package, Activity, X } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import CountUp from '../common/CountUp';
import styles from './AnalyticsSection.module.css';

const PIE_COLORS = ['#0066FF', '#10B981', '#F59E0B', '#6B7280'];

export default function AnalyticsSection() {
  const { analyticsVisible, setAnalyticsVisible, vehicles, purchases, totalRevenue } = useApp();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const sectionY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Compute stats
  const inventoryValue = useMemo(() => vehicles.reduce((sum, v) => sum + (v.price * v.stock), 0), [vehicles]);
  const totalStock = useMemo(() => vehicles.reduce((sum, v) => sum + v.stock, 0), [vehicles]);

  // Bar Chart Data (Stock by Category)
  const barData = useMemo(() => {
    const counts = {};
    vehicles.forEach(v => {
      counts[v.category] = (counts[v.category] || 0) + v.stock;
    });
    return Object.keys(counts).map(name => ({ name, stock: counts[name] }));
  }, [vehicles]);

  // Pie Chart Data (Fuel Distribution)
  const pieData = useMemo(() => {
    const counts = {};
    vehicles.forEach(v => {
      counts[v.fuel] = (counts[v.fuel] || 0) + 1; // Count models, not stock
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [vehicles]);

  if (!analyticsVisible) return null;

  return (
    <AnimatePresence>
      <motion.section
        className={styles.analytics}
        id="analytics"
        ref={containerRef}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container">
          <motion.div style={{ y: sectionY, opacity: sectionOpacity }}>
            {/* Header */}
            <div className={styles.header}>
              <div>
                <div className="section-eyebrow">Insights</div>
                <h2 className="section-title">Dealership Performance</h2>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setAnalyticsVisible(false)}
                id="close-analytics-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiIconWrap}><DollarSign size={20} /></div>
                <p className={styles.kpiLabel}>Total Revenue</p>
                <h3 className={styles.kpiValue}>
                  <CountUp end={totalRevenue} prefix="$" />
                </h3>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiIconWrap}><Package size={20} /></div>
                <p className={styles.kpiLabel}>Inventory Value</p>
                <h3 className={styles.kpiValue}>
                  <CountUp end={inventoryValue} prefix="$" />
                </h3>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiIconWrap}><TrendingUp size={20} /></div>
                <p className={styles.kpiLabel}>Vehicles Sold</p>
                <h3 className={styles.kpiValue}>
                  <CountUp end={purchases.reduce((s, p) => s + p.quantity, 0)} />
                </h3>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiIconWrap}><Activity size={20} /></div>
                <p className={styles.kpiLabel}>Units in Stock</p>
                <h3 className={styles.kpiValue}>
                  <CountUp end={totalStock} />
                </h3>
              </div>
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
              {/* Bar Chart */}
              <div className={styles.chartCard}>
                <h4 className={styles.chartTitle}>Stock by Category</h4>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,102,255,0.05)' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                      />
                      <Bar dataKey="stock" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className={styles.chartCard}>
                <h4 className={styles.chartTitle}>Model Fuel Types</h4>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className={styles.tableCard}>
              <h4 className={styles.chartTitle}>Recent Transactions</h4>
              <div className={styles.tableWrapper}>
                {purchases.length > 0 ? (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Vehicle</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.slice(0, 10).map(p => (
                        <tr key={p.id}>
                          <td>{new Date(p.date).toLocaleDateString()}</td>
                          <td>
                            <div className={styles.tdVehicle}>
                              <img src={p.image} alt={p.vehicleName} className={styles.tdImg} />
                              <span>{p.vehicleName}</span>
                            </div>
                          </td>
                          <td>{p.quantity}</td>
                          <td>${p.priceEach.toLocaleString()}</td>
                          <td className={styles.tdTotal}>${p.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.emptyTable}>
                    <p>No transactions yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
