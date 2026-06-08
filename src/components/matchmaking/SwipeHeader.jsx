import { SlidersHorizontal, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'paraTi',    label: 'Para ti' },
  { id: 'guardados', label: 'Guardados' },
];

function SwipeHeader({ activeTab, onTabChange, savedCount, onOpenFilters }) {
  return (
    <>
      {/* Top gradient for readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{ height: '88px', background: 'linear-gradient(to bottom, rgba(7,12,24,0.75) 0%, transparent 100%)' }}
      />

      {/* Header controls */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-3 pb-2">
        <motion.button
          type="button"
          onClick={onOpenFilters}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.90 }}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.18)' }}
        >
          <SlidersHorizontal className="h-[18px] w-[18px] text-white/85" />
        </motion.button>

        <div
          className="flex items-center rounded-full p-1"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-[#141E30] shadow-sm' : 'text-white/60 hover:text-white/85'
              }`}
            >
              {tab.label}
              {tab.id === 'guardados' && savedCount > 0 && (
                <span className={`ml-1 text-[11px] ${activeTab === tab.id ? 'text-[#141E30]/60' : 'text-white/40'}`}>
                  ({savedCount})
                </span>
              )}
            </button>
          ))}
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.90 }}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.18)' }}
        >
          <Zap className="h-[18px] w-[18px] text-[#4A9FFF]" />
        </motion.button>
      </div>
    </>
  );
}

export default SwipeHeader;
