import React, { useState } from 'react';
import { XCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MYTHS } from '../data/homeContent';

export default function MythAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {MYTHS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-xl border transition-colors ${isOpen ? 'border-orange-500/40 bg-orange-500/5' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20'}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left px-5 py-4 flex items-start gap-3"
            >
              <XCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${isOpen ? 'text-orange-400' : 'text-red-400/60'}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm transition-colors ${isOpen ? 'text-orange-300' : 'text-gray-800 dark:text-white/80'}`}>
                  {item.myth}
                </p>
                {!isOpen && (
                  <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">{item.short}</p>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider">The Reality</p>
                </div>
                <div className="space-y-3">
                  {item.rebuttal.trim().split('\n\n').map((para, j) => (
                    <p key={j} className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
