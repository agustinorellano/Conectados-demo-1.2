import { AnimatePresence, motion } from 'framer-motion';
import CompanyCard from './CompanyCard';

function CardStack({
  activeCompany, nextCompany, thirdCompany,
  x, y, rotate,
  likeOpacity, nopeOpacity,
  nextScale, nextOpacity, nextTranslateY,
  thirdScale, thirdOpacity,
  exitState,
  onDragEnd,
  onViewProfile,
  onOpenFilters,
}) {
  return (
    <div className="absolute inset-0">

      {/* Third card (farthest back) */}
      {thirdCompany && (
        <motion.div
          className="absolute inset-0 z-[10] w-full"
          style={{ scale: thirdScale, opacity: thirdOpacity, translateY: 22 }}
        >
          <CompanyCard company={thirdCompany} />
        </motion.div>
      )}

      {/* Next card (middle layer) */}
      {nextCompany && (
        <motion.div
          className="absolute inset-0 z-[20] w-full"
          style={{ scale: nextScale, opacity: nextOpacity, translateY: nextTranslateY }}
        >
          <CompanyCard company={nextCompany} />
        </motion.div>
      )}

      {/* Active card */}
      <AnimatePresence initial={false} mode="wait">
        {activeCompany ? (
          <motion.div
            key={activeCompany.id}
            className="absolute inset-0 z-[30] w-full cursor-grab active:cursor-grabbing"
            style={{ x, y, rotate }}
            drag="x"
            dragConstraints={{ left: -600, right: 600 }}
            dragElastic={0}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              x: exitState.x,
              y: exitState.y,
              rotate: exitState.x > 0 ? 12 : -12,
              transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
            }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onDragEnd={onDragEnd}
          >
            {/* Green tint — like */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ opacity: likeOpacity, background: 'rgba(34,197,94,0.22)' }}
            />
            {/* Red tint — nope */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ opacity: nopeOpacity, background: 'rgba(244,63,94,0.22)' }}
            />

            {/* LIKE stamp */}
            <motion.div
              className="pointer-events-none absolute left-5 top-24 z-40 rotate-[-18deg]"
              style={{ opacity: likeOpacity }}
            >
              <div className="rounded-2xl px-5 py-2"
                style={{ border: '3px solid #22C55E', background: 'rgba(34,197,94,0.12)', backdropFilter: 'blur(8px)' }}>
                <span className="font-['Space_Grotesk'] text-[28px] font-black tracking-[0.12em] text-[#22C55E] drop-shadow-[0_2px_8px_rgba(34,197,94,0.7)]">
                  LIKE
                </span>
              </div>
            </motion.div>

            {/* NOPE stamp */}
            <motion.div
              className="pointer-events-none absolute right-5 top-24 z-40 rotate-[18deg]"
              style={{ opacity: nopeOpacity }}
            >
              <div className="rounded-2xl px-5 py-2"
                style={{ border: '3px solid #F43F5E', background: 'rgba(244,63,94,0.12)', backdropFilter: 'blur(8px)' }}>
                <span className="font-['Space_Grotesk'] text-[28px] font-black tracking-[0.12em] text-[#F43F5E] drop-shadow-[0_2px_8px_rgba(244,63,94,0.7)]">
                  NOPE
                </span>
              </div>
            </motion.div>

            <CompanyCard company={activeCompany} onViewProfile={onViewProfile} />
          </motion.div>
        ) : (
          /* Empty deck */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex w-full items-center justify-center rounded-[28px] p-10 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.09)' }}
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
              <button
                type="button"
                onClick={onOpenFilters}
                className="mt-5 rounded-full bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white/70 transition hover:bg-white/15"
              >
                Ajustar filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CardStack;
