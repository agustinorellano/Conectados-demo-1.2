import { Bookmark, Heart, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';
import CompanyCard from './CompanyCard';
import CompanyDetailModal from './CompanyDetailModal';
import { calculateMatchScore, shouldRevealCompany, willCreateMatch } from '../../utils/matchmaking';

const SWIPE_THRESHOLD_X = 100;

/* ─────────────────────────────────────────────────────────
   SWIPE BOARD
───────────────────────────────────────────────────────── */
function SwipeBoard({ companies, dailyMatchCount, onMatch, onOpenPricing, userPlan }) {
  const deck = useMemo(
    () =>
      companies
        .map((company) => ({ ...company, score: calculateMatchScore(company) }))
        .filter((company) => shouldRevealCompany(company.score)),
    [companies]
  );

  const [activeIndex,    setActiveIndex]    = useState(0);
  const [history,        setHistory]        = useState([]);
  const [flashMessage,   setFlashMessage]   = useState(null);
  const [exitState,      setExitState]      = useState({ x: 0, y: 0 });
  const [viewingCompany, setViewingCompany] = useState(null);

  /* ── Shared drag motion values ── */
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);

  /* ── Active card transforms ── */
  const rotate  = useTransform(x, [-240, 240], [-12, 12]);

  /* ── LIKE / NOPE overlay opacity ── */
  const likeOpacity = useTransform(x, [20, SWIPE_THRESHOLD_X],        [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -SWIPE_THRESHOLD_X],      [0, 1]);

  /* ── Next card: reacts dynamically to drag ──
     At x=0 → scale=0.95, opacity=0.75, translateY=10
     At |x|=200 → scale=1, opacity=1, translateY=0          */
  const nextScale     = useTransform(x, [-200, 0, 200], [1,    0.95, 1]);
  const nextOpacity   = useTransform(x, [-200, 0, 200], [1,    0.72, 1]);
  const nextTranslateY= useTransform(x, [-200, 0, 200], [0,    12,   0]);

  /* ── Third card (barely peeking) ── */
  const thirdScale    = useTransform(x, [-200, 0, 200], [0.915, 0.90, 0.915]);
  const thirdOpacity  = useTransform(x, [-200, 0, 200], [0.45,  0.30, 0.45]);

  const activeCompany    = deck[activeIndex];
  const nextCompany      = deck[activeIndex + 1];
  const thirdCompany     = deck[activeIndex + 2];
  const matchLimitReached = userPlan === 'starter' && dailyMatchCount >= 10;

  const showFlash = (message) => {
    setFlashMessage(message);
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlashMessage(null), 1300);
  };

  const queueNextCompany = (state) => {
    if (!activeCompany) return;
    setHistory((curr) => [...curr, { index: activeIndex }]);
    setExitState(state);
    window.setTimeout(() => {
      x.set(0);
      y.set(0);
      setActiveIndex((curr) => curr + 1);
    }, 160);
  };

  const handleSkip = () => {
    showFlash('Descartada');
    queueNextCompany({ x: -220, y: 20 });
  };

  const handleLike = () => {
    if (!activeCompany) return;
    if (matchLimitReached) { showFlash('Límite diario alcanzado'); return; }
    if (willCreateMatch(activeCompany, activeCompany.score)) {
      onMatch?.(activeCompany);
      showFlash(`¡Match con ${activeCompany.name}!`);
    } else {
      showFlash('Like enviado');
    }
    queueNextCompany({ x: 220, y: -20 });
  };

  const handleSave = () => {
    if (!activeCompany) return;
    showFlash(`${activeCompany.name} guardada`);
  };

  const handleViewProfile = () => {
    if (!activeCompany) return;
    setViewingCompany({ ...activeCompany });
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD_X) { handleSkip(); return; }
    if (info.offset.x >  SWIPE_THRESHOLD_X) { handleLike(); return; }
    x.set(0);
    y.set(0);
  };

  /* ── Card width — 94vw capped at 500px ── */
  const cardW = 'w-[94vw] max-w-[500px]';

  return (
    <>
      {/* ── Dark navy full-height match container ── */}
      <div
        className="flex flex-col overflow-hidden rounded-[24px]"
        style={{
          background: 'linear-gradient(160deg, #070C18 0%, #0F1828 55%, #141E30 100%)',
          height: 'calc(100dvh - 158px)',
        }}
      >
        {/* ── Card stack area ── */}
        <div className="relative flex flex-1 items-start justify-center overflow-hidden pt-5">

          {/* ── Third card (farthest back) ── */}
          {thirdCompany && (
            <motion.div
              className={`absolute top-8 z-[10] ${cardW}`}
              style={{
                scale: thirdScale,
                opacity: thirdOpacity,
                translateY: 22,
              }}
            >
              <CompanyCard company={thirdCompany} />
            </motion.div>
          )}

          {/* ── Next card (middle layer) — reacts to drag ── */}
          {nextCompany && (
            <motion.div
              className={`absolute top-4 z-[20] ${cardW}`}
              style={{
                scale: nextScale,
                opacity: nextOpacity,
                translateY: nextTranslateY,
              }}
            >
              <CompanyCard company={nextCompany} />
            </motion.div>
          )}

          {/* ── Active card ── */}
          <AnimatePresence initial={false} mode="wait">
            {activeCompany ? (
              <motion.div
                key={activeCompany.id}
                className={`absolute top-0 z-[30] ${cardW} cursor-grab active:cursor-grabbing`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: exitState.x,
                  y: exitState.y,
                  rotate: exitState.x > 0 ? 12 : -12,
                  transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
                }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ x, y, rotate }}
                onDragEnd={handleDragEnd}
              >
                {/* LIKE stamp */}
                <motion.div
                  className="pointer-events-none absolute left-5 top-14 z-40 rotate-[-18deg]"
                  style={{ opacity: likeOpacity }}
                >
                  <div
                    className="rounded-2xl px-5 py-2"
                    style={{
                      border: '3px solid #22C55E',
                      background: 'rgba(34,197,94,0.12)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="font-['Space_Grotesk'] text-[28px] font-black tracking-[0.12em] text-[#22C55E] drop-shadow-[0_2px_8px_rgba(34,197,94,0.7)]">
                      LIKE
                    </span>
                  </div>
                </motion.div>

                {/* NOPE stamp */}
                <motion.div
                  className="pointer-events-none absolute right-5 top-14 z-40 rotate-[18deg]"
                  style={{ opacity: nopeOpacity }}
                >
                  <div
                    className="rounded-2xl px-5 py-2"
                    style={{
                      border: '3px solid #F43F5E',
                      background: 'rgba(244,63,94,0.12)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="font-['Space_Grotesk'] text-[28px] font-black tracking-[0.12em] text-[#F43F5E] drop-shadow-[0_2px_8px_rgba(244,63,94,0.7)]">
                      NOPE
                    </span>
                  </div>
                </motion.div>

                <CompanyCard company={activeCompany} />
              </motion.div>
            ) : (
              /* ── Empty deck ── */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute top-0 z-30 flex ${cardW} h-[70%] items-center justify-center rounded-[28px] p-10 text-center`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#4A9FFF]">
                    Deck completo
                  </p>
                  <h3 className="mt-3 font-['Space_Grotesk'] text-[22px] font-bold tracking-tight text-white/90">
                    No hay más empresas por evaluar
                  </h3>
                  <p className="mt-2 text-[13px] text-white/40">
                    Volvé más tarde o ajustá tus filtros
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Flash toast ── */}
        <AnimatePresence>
          {flashMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="mx-auto mb-2 shrink-0 rounded-[18px] px-5 py-2.5 text-center text-[13px] font-semibold text-white/90"
              style={{
                background: 'rgba(255,255,255,0.11)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {flashMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Match limit warning ── */}
        {matchLimitReached && (
          <div className="mx-4 mb-2 shrink-0 rounded-[16px] border border-amber-400/20 bg-amber-400/8 p-3.5 text-center text-[13px] leading-6 text-amber-200">
            Llegaste al límite diario del plan Starter.
            <button
              type="button"
              onClick={onOpenPricing}
              className="mt-2 inline-flex rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Ver planes
            </button>
          </div>
        )}

        {/* ── Action buttons ── */}
        <div
          className="shrink-0 flex items-center justify-center gap-[20px] pt-3"
          style={{ paddingBottom: 'max(28px, env(safe-area-inset-bottom))' }}
        >
          {/* Skip */}
          <motion.button
            type="button"
            onClick={handleSkip}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.86 }}
            className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.14)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.40)',
            }}
          >
            <X className="h-[22px] w-[22px] text-white/70" strokeWidth={2.2} />
          </motion.button>

          {/* Bookmark */}
          <motion.button
            type="button"
            onClick={handleSave}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.86 }}
            className="flex h-[48px] w-[48px] items-center justify-center rounded-full"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.11)',
              boxShadow: '0 3px 14px rgba(0,0,0,0.30)',
            }}
          >
            <Bookmark className="h-[18px] w-[18px] text-white/55" strokeWidth={2} />
          </motion.button>

          {/* View Profile — hero CTA */}
          <motion.button
            type="button"
            onClick={handleViewProfile}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.90 }}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(135deg, #1E7FF0 0%, #1459B0 100%)',
              boxShadow: '0 0 32px rgba(24,113,216,0.65), 0 8px 28px rgba(0,0,0,0.50)',
            }}
          >
            <Search className="h-[26px] w-[26px] text-white" strokeWidth={2} />
          </motion.button>

          {/* Like */}
          <motion.button
            type="button"
            onClick={handleLike}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.86 }}
            className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
            style={{
              background: 'rgba(34,197,94,0.12)',
              border: '1.5px solid rgba(34,197,94,0.32)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.40)',
            }}
          >
            <Heart className="h-[22px] w-[22px] text-emerald-400" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* ── Detail modal ── */}
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
