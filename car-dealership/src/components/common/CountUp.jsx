import { useEffect, useRef, useState } from 'react';

/**
 * CountUp — Animated number counter using requestAnimationFrame
 * @param {number} end - Target number
 * @param {number} duration - Animation duration in ms
 * @param {string} prefix - Prefix string (e.g. "$")
 * @param {string} suffix - Suffix string (e.g. "+")
 * @param {boolean} start - Whether to start counting
 */
export default function CountUp({ end, duration = 2000, prefix = '', suffix = '', start = true, decimals = 0 }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, start]);

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}
