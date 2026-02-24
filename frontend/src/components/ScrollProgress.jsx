import React, { useState, useEffect } from 'react';

/** Thin orange bar that tracks overall page scroll progress, fixed just below the navbar. */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-white/5 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400"
        style={{ width: `${pct}%`, transition: 'width 80ms linear' }}
      />
    </div>
  );
}
