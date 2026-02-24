import React, { useRef, useEffect, useState } from 'react';

/**
 * Wraps children in a div that fades + slides into view when it enters the viewport.
 * Props:
 *   direction  'up' | 'left' | 'right'  (default 'up')
 *   delay      number in ms (default 0) — useful for staggering siblings
 *   className  extra Tailwind classes forwarded to the wrapper div
 */
export default function ScrollSection({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);   // animate once
        }
      },
      { threshold: 0.07, rootMargin: '0px 0px -50px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    direction === 'left'  ? 'translateX(-32px)' :
    direction === 'right' ? 'translateX(32px)'  :
                            'translateY(32px)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : hiddenTransform,
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
