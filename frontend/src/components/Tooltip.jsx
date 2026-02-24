import React from 'react';

/**
 * Inline hover tooltip.
 * Usage: <Tooltip text="Full explanation here">DCA</Tooltip>
 */
export default function Tooltip({ children, text }) {
  return (
    <span className="relative inline-block group">
      {/* Dashed underline signals "hover me" */}
      <span className="border-b border-dashed border-current/60 cursor-help">
        {children}
      </span>

      {/* Tooltip bubble */}
      <span
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          w-60 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600
          text-gray-700 dark:text-white/90 text-xs rounded-xl px-3 py-2.5
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          pointer-events-none z-50 shadow-2xl
          leading-relaxed text-center
          whitespace-normal
        "
      >
        {text}
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-200 dark:border-t-slate-600" />
      </span>
    </span>
  );
}
