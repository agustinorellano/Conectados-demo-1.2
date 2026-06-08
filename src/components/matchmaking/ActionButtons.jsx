import { ArrowUp, Heart, RotateCcw, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

const BTN_SM = 'flex h-[52px] w-[52px] items-center justify-center rounded-full';
const BTN_LG = 'flex h-[64px] w-[64px] items-center justify-center rounded-full';

function ActionButtons({ onUndo, onSkip, onSave, onLike, onViewProfile }) {
  return (
    <>
      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40"
        style={{
          height: '34%',
          background: 'linear-gradient(to top, rgba(4,8,16,0.96) 0%, rgba(4,8,16,0.60) 45%, transparent 100%)',
        }}
      />

      {/* Buttons row */}
      <div
        className="absolute inset-x-0 bottom-0 z-50 flex items-center justify-center gap-4"
        style={{ paddingBottom: 'max(18px, env(safe-area-inset-bottom))', paddingTop: '10px' }}
      >
        <motion.button type="button" onClick={onUndo} whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.86 }}
          className={BTN_SM}
          style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.45)' }}>
          <RotateCcw className="h-5 w-5 text-amber-400" strokeWidth={2} />
        </motion.button>

        <motion.button type="button" onClick={onSkip} whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.86 }}
          className={BTN_LG}
          style={{ background: 'rgba(244,63,94,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(244,63,94,0.45)', boxShadow: '0 4px 24px rgba(244,63,94,0.25)' }}>
          <X className="h-[26px] w-[26px] text-[#F43F5E]" strokeWidth={2.5} />
        </motion.button>

        <motion.button type="button" onClick={onSave} whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.86 }}
          className={BTN_SM}
          style={{ background: 'rgba(251,191,36,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(251,191,36,0.35)', boxShadow: '0 4px 20px rgba(0,0,0,0.45)' }}>
          <Star className="h-5 w-5 text-amber-400" strokeWidth={2} />
        </motion.button>

        <motion.button type="button" onClick={onLike} whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.86 }}
          className={BTN_LG}
          style={{ background: 'rgba(34,197,94,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(34,197,94,0.42)', boxShadow: '0 4px 24px rgba(34,197,94,0.22)' }}>
          <Heart className="h-[24px] w-[24px] text-emerald-400" strokeWidth={2} />
        </motion.button>

        <motion.button type="button" onClick={onViewProfile} whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.86 }}
          className={BTN_SM}
          style={{ background: 'rgba(74,159,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(74,159,255,0.32)', boxShadow: '0 4px 20px rgba(0,0,0,0.45)' }}>
          <ArrowUp className="h-5 w-5 text-[#4A9FFF]" strokeWidth={2} />
        </motion.button>
      </div>
    </>
  );
}

export default ActionButtons;
