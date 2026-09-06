/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, X, ExternalLink } from 'lucide-react';
import { SUITE_APPS } from '../data/suiteApps';

/**
 * A self-contained floating entry point into the wider DAE / KrishiAI tool
 * suite (Krishi AI, Plant Detective, nursery registries, Krishak Card, etc).
 * Deliberately kept isolated from the legacy iframe's own 5-tab UI and its
 * fragile switchTab() logic -- this mounts as its own fixed overlay, same
 * pattern as the satellite-map button in App.tsx, so it can never interfere
 * with the legacy form/dashboard/map tabs.
 */
export default function MoreAppsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-40 flex items-center justify-center rounded-full shadow-lg w-10 h-10 text-white cursor-pointer active:scale-95 transition"
        style={{ top: '14px', right: '14px', background: '#006A4E' }}
        title="আরও অ্যাপস"
      >
        <LayoutGrid size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed z-50 w-[88vw] max-w-sm bg-white/95 border border-gray-200 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
              style={{ top: '64px', right: '14px' }}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <span className="font-extrabold text-gray-800 text-xs tracking-tight uppercase flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-emerald-600" />
                  আরও অ্যাপস
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 active:text-gray-800 active:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {SUITE_APPS.map((app) => (
                  <a
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 bg-white border border-gray-100 rounded-xl p-3 shadow-sm active:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{app.nameBn}</p>
                      <p className="text-[10px] text-gray-500 truncate">{app.descriptionBn}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
