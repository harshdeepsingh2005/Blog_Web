import { useEffect, useState } from 'react';

/**
 * Tracks scroll position and returns read percentage (0–100).
 * Attaches to the element with id="article-content" if present,
 * otherwise measures the whole document.
 */
export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById('article-content');
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
      } else {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return progress;
}
