import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import styles from './SearchPanel.module.css';

const FILTER_CHIPS = ['All', 'BMW', 'SUV', 'Sedan', 'Coupe', 'Sports', 'Luxury', 'Electric'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'hp-desc', label: 'Most Powerful' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'stock', label: 'In Stock First' },
];

const PLACEHOLDERS = [
  'Search BMW M4...',
  'Filter by category...',
  'Find electric vehicles...',
  'Search by horsepower...',
  'Explore M Collection...',
];

export default function SearchPanel() {
  const {
    searchPanelOpen,
    setSearchPanel,
    searchQuery,
    setSearch,
    activeFilters,
    setFilters,
    sortBy,
    setSort,
    priceRange,
    setPriceRange,
    filteredVehicles,
  } = useApp();

  const inputRef = useRef(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Animate placeholder cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (searchPanelOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchPanelOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSearchPanel(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setSearchPanel]);

  const toggleFilter = (chip) => {
    if (chip === 'All') {
      setFilters(['All']);
      return;
    }
    const next = activeFilters.includes('All')
      ? [chip]
      : activeFilters.includes(chip)
        ? activeFilters.filter(f => f !== chip).length === 0 ? ['All'] : activeFilters.filter(f => f !== chip)
        : [...activeFilters, chip];
    setFilters(next);
  };

  const clearAll = () => {
    setSearch('');
    setFilters(['All']);
    setSort('featured');
    setPriceRange([0, 250000]);
  };

  if (!searchPanelOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSearchPanel(false)}
      />
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        id="search-panel"
      >
        {/* Search Input */}
        <div className={styles.inputRow}>
          <Search size={20} className={styles.searchIcon} />
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              placeholder=""
              id="search-input"
              autoComplete="off"
            />
            {!searchQuery && (
              <div className={styles.placeholder} aria-hidden>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={placeholderIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {PLACEHOLDERS[placeholderIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
          <div className={styles.divider} />
          <button
            className={`${styles.filtersToggle} ${showFilters ? styles.filtersActive : ''}`}
            onClick={() => setShowFilters(v => !v)}
            id="filters-toggle"
          >
            <SlidersHorizontal size={16} />
            Filters
            <ChevronDown size={14} className={`${styles.chevron} ${showFilters ? styles.chevronUp : ''}`} />
          </button>
        </div>

        {/* Results Count */}
        <div className={styles.resultsMeta}>
          <span className={styles.resultsCount}>
            {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
          </span>
          {(searchQuery || !activeFilters.includes('All') || sortBy !== 'featured') && (
            <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>
          )}
        </div>

        {/* Filter Chips */}
        <div className={styles.chips}>
          {FILTER_CHIPS.map(chip => (
            <motion.button
              key={chip}
              className={`${styles.chip} ${
                activeFilters.includes(chip) || (chip === 'All' && activeFilters.includes('All'))
                  ? styles.chipActive : ''
              }`}
              onClick={() => toggleFilter(chip)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              id={`filter-chip-${chip.toLowerCase()}`}
            >
              {chip}
            </motion.button>
          ))}
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className={styles.expandedFilters}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.filterRow}>
                {/* Price Range */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>
                    Price Range
                    <span className={styles.filterValue}>
                      ${priceRange[0].toLocaleString()} — ${priceRange[1].toLocaleString()}
                    </span>
                  </label>
                  <div className={styles.sliderRow}>
                    <input
                      type="range"
                      min="0"
                      max="250000"
                      step="5000"
                      value={priceRange[0]}
                      onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                      className={styles.slider}
                      id="price-min-slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="250000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className={styles.slider}
                      id="price-max-slider"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Sort By</label>
                  <div className={styles.sortGrid}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`${styles.sortBtn} ${sortBy === opt.value ? styles.sortActive : ''}`}
                        onClick={() => setSort(opt.value)}
                        id={`sort-${opt.value}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
