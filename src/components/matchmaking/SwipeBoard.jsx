import {
  Bookmark,
  Heart,
  Search,
  X
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';
import CompanyCard from './CompanyCard';
import CompanyDetailModal from './CompanyDetailModal';
import { calculateMatchScore, shouldRevealCompany, willCreateMatch } from '../../utils/matchmaking';

const SWIPE_THRESHOLD_X = 110;

function SwipeBoard({ companies, dailyMatchCount, onMatch, onOpenPricing, userPlan }) {
  const deck = useMemo(
    () =>
      companies
        .map((company) => ({ ...company, score: calculateMatchScore(company) }))
        .filter((company) => shouldRevealCompany(company.score)),
    [companies]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);
  const [exitState, setExitState] = useState({ x: 0, y: 0 });
  const [viewingCompany, setViewingCompany] = useState(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const nextScale = useTransform(x, [-180, 0, 180], [0.95, 0.97, 0.95]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -110], [0, 1]);

  const activeCompany = deck[activeIndex];
  const nextCompany = deck[activeIndex + 1];
  const matchLimitReached = userPlan === 'starter' && dailyMatchCount >= 10;

  const showFlash = (message) => {
    setFlashMessage(message);
    window.clearTimeout(showFlash.timeoutId);
    showFlash.timeoutId = window.setTimeout(() => setFlashMessage(null), 1300);
  };

  const queueNextCompany = (state) => {
    if (!activeCompany) return;
    setHistory((current) => [...current, { index: activeIndex }]);
    setExitState(state);
    window.setTimeout(() => {
      x.set(0);
      y.set(0);
      setActiveIndex((current) => current + 1);
    }, 180);
  };

  const handleSkip = () => {
    showFlash('Descartada.');
    queueNextCompany({ x: -180, y: 18 });
  };

  const handleLike = () => {
    if (!activeCompany) return;
    if (matchLimitReached) {
      showFlash('Limite diario alcanzado.');
      return;
    }
    if (willCreateMatch(activeCompany, activeCompany.score)) {
      onMatch?.(activeCompany);
      showFlash(`Match con ${activeCompany.name}!`);
    } else {
      showFlash('Like enviado.');
    }
    queueNextCompany({ x: 180, y: -18 });
  };

  const handleSave = () => {
    if (!activeCompany) return;
    showFlash(`${activeCompany.name} guardada.`);
  };

  const handleViewProfile = () => {
    if (!activeCompany) return;
    setViewingCompany(activeCompany);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD_X) {
      handleSkip();
      return;
    }
    if (info.offset.x > SWIPE_THRESHOLD_X) {
      handleLike();
      return;
    }
    x.set(0);
    y.set(0);
  };

  return (
    <>
      {/* ── Dark navy full-height match container ── */}
      <div
        className="flex h-[calc(100svh-158px)] flex-col overflow-hidden rounded-[24px]"
        style={{ background: 'linear-gradient(160deg, #0A0F1E 0%, #141E30 100%)' }}
      >
        {/* Card area — fills all remaining height */}
        <div className="relative mx-auto w-full max-w-md flex-1 px-4 pt-4">
          {/* Next card (background) */}
          {nextCompany ? (
            <motion.div
              className="absolute inset-x-8 top-8 z-10"
              style={{ scale: nextScale, opacity: 0.4 }}
            >
              <CompanyCard company={nextCompany} />
            </motion.div>
          ) : null}

          <AnimatePresence initial={false} mode="wait">
            {activeCompany ? (
              <motion.div
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                exit={{ opacity: 0, x: exitState.x, y: exitState.y, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                key={activeCompany.id}
                onDragEnd={handleDragEnd}
                style={{ x, y, rotate }}
                transition={{ duration: 0.2 }}
              >
                {/* LIKE stamp */}
                <motion.div
                  className="pointer-events-none absolute left-5 top-5 z-30 rotate-[-16deg]"
                  style={{ opacity: likeOpacity }}
                >
                  <div className="rounded-xl border-[3px] border-[#22c55e] bg-[#22c55e]/10 px-4 py-1.5 backdrop-blur-sm">
                    <span className="font-['Space_Grotesk'] text-2xl font-black tracking-wider text-[#22c55e]">
                      LIKE
                    </span>
                  </div>
                </motion.div>

                {/* NOPE stamp */}
                <motion.div
                  className="pointer-events-none absolute right-5 top-5 z-30 rotate-[16deg]"
                  style={{ opacity: nopeOpacity }}
                >
                  <div className="rounded-xl border-[3px] border-rose-500 bg-rose-500/10 px-4 py-1.5 backdrop-blur-sm">
                    <span className="font-['Space_Grotesk'] text-2xl font-black tracking-wider text-rose-500">
                      NOPE
                    </span>
                  </div>
                </motion.div>

                <CompanyCard company={activeCompany} />
              </motion.div>
            ) : (
              /* Empty deck state */
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-[24px] p-10 text-center"
                initial={{ opacity: 0 }}
                key="empty"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#4A9FFF]">
                    Deck completo
                  </p>
                  <h3 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white/90">
                    No hay mas empresas por evaluar
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Flash toast */}
        <AnimatePresence>
          {flashMessage && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-1 rounded-[18px] px-5 py-2.5 text-center text-sm font-medium text-white/90"
              exit={{ opacity: 0, y: 4 }}
              initial={{ opacity: 0, y: 8 }}
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.14)'
              }}
            >
              {flashMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match limit warning */}
        {matchLimitReached && (
          <div className="mx-4 mb-2 rounded-[16px] border border-amber-400/20 bg-amber-400/8 p-3.5 text-center text-sm leading-6 text-amber-200">
            Llegaste al limite diario del plan Starter.
            <button
              className="mt-2 inline-flex rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
              onClick={onOpenPricing}
              type="button"
            >
              Ver planes
            </button>
          </div>
        )}

        {/* ── Action buttons — always visible at bottom ── */}
        <div className="shrink-0 flex items-center justify-center gap-[18px] pb-7 pt-3">
          {/* Skip / X */}
          <motion.button
            className="inline-flex h-[56px] w-[56px] items-center justify-center rounded-full"
            onClick={handleSkip}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.14)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
            }}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
          >
            <X className="h-5 w-5 text-white/65" />
          </motion.button>

          {/* Save / Bookmark (secondary, smaller) */}
          <motion.button
            className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full"
            onClick={handleSave}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1.5px solid rgba(255,255,255,0.11)',
              boxShadow: '0 3px 14px rgba(0,0,0,0.28)'
            }}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
          >
            <Bookmark className="h-4 w-4 text-white/55" />
          </motion.button>

          {/* View Profile — center hero, DataPlus blue */}
          <motion.button
            className="inline-flex h-[68px] w-[68px] items-center justify-center rounded-full"
            onClick={handleViewProfile}
            style={{
              background: 'linear-gradient(135deg, #1E7FF0 0%, #1459B0 100%)',
              boxShadow: '0 0 28px rgba(24,113,216,0.6), 0 6px 24px rgba(0,0,0,0.45)'
            }}
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <Search className="h-6 w-6 text-white" />
          </motion.button>

          {/* Like / Heart */}
          <motion.button
            className="inline-flex h-[56px] w-[56px] items-center justify-center rounded-full"
            onClick={handleLike}
            style={{
              background: 'rgba(34,197,94,0.11)',
              border: '1.5px solid rgba(34,197,94,0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
            }}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
          >
            <Heart className="h-5 w-5 text-emerald-400" />
          </motion.button>
        </div>
      </div>

      {viewingCompany && (
        <CompanyDetailModal
          company={viewingCompany}
          onClose={() => setViewingCompany(null)}
          onLike={handleLike}
        />
      )}
    </>
  );
}

export default SwipeBoard;
