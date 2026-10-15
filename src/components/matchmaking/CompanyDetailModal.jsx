import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, MapPin, Share2, Star, X } from 'lucide-react';
import { useRef } from 'react';
import { InstagramFeedModal } from '../shared/InstagramFeedPreview';

/* ── Brand gradients per sector ─────────────────────────── */
const industryBg = {
  Indumentaria:       'radial-gradient(ellipse at 60% 0%, #9B8EC4 0%, #7B6BA8 40%, #C4A882 100%)',
  Belleza:            'radial-gradient(ellipse at 50% 0%, #E8C5D0 0%, #D4909A 45%, #B06070 100%)',
  Cafeteria:          'radial-gradient(ellipse at 30% 10%, #A07850 0%, #6B4228 50%, #3D2510 100%)',
  Gastronomia:        'radial-gradient(ellipse at 50% 0%, #4A7A3C 0%, #2D5522 50%, #1A3310 100%)',
  Gimnasio:           'radial-gradient(ellipse at 70% 0%, #2C3E6B 0%, #1A2644 50%, #0D1425 100%)',
  Tecnologia:         'radial-gradient(ellipse at 60% 10%, #2D1B69 0%, #1A0F42 50%, #0A0820 100%)',
  Floreria:           'radial-gradient(ellipse at 40% 0%, #C8D8B0 0%, #8FB87A 40%, #5A8A44 100%)',
  Moda:               'radial-gradient(ellipse at 50% 10%, #D4C0A8 0%, #B09070 45%, #806040 100%)',
  Bienestar:          'radial-gradient(ellipse at 60% 0%, #A8C8D8 0%, #78A8C0 40%, #4A7890 100%)',
  'Marketing Digital':'radial-gradient(ellipse at 60% 0%, #4A2080 0%, #2C1050 50%, #100820 100%)',
};

/* ── Pill chip ───────────────────────────────────────────── */
function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate:   'bg-white/10 text-white/75',
    blue:    'bg-blue-400/15 text-blue-300',
    emerald: 'bg-emerald-400/15 text-emerald-300',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* ── Score pill ─────────────────────────────────────────── */
function ScorePill({ score }) {
  const pct   = Math.round(score || 0);
  const color = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#94A3B8';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
      style={{ background: `${color}20`, color }}
    >
      <Star className="h-3 w-3 fill-current" />
      {pct}% match
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
   All hooks are declared at the top — no early returns before them
───────────────────────────────────────────────────────── */
function CompanyDetailModal({ company, onClose, onLike }) {
  /* ── ALL hooks first (Rules of Hooks) ── */
  const dragY      = useMotionValue(0);
  const sheetScale = useTransform(dragY, [0, 280], [1, 0.94]);
  const overlayOp  = useTransform(dragY, [0, 280], [1,    0]);
  const contentRef = useRef(null);

  /* Guard — component is only mounted when company exists, but just in case */
  if (!company) return null;

  const bg       = industryBg[company.sector] || industryBg.Tecnologia;
  const hasImage = Boolean(company.gallery?.[0]);

  const offersArr  = company.offersArr   || company.offer?.split(', ')    || [];
  const needsArr   = company.needsArr    || company.seeking?.split(', ')  || [];
  const segments   = company.segments    || [];

  const handleDragEnd = (_, info) => {
    /* Close if dragged down enough or fast enough */
    if (info.offset.y > 100 || info.velocity.y > 600) {
      onClose();
    } else {
      dragY.set(0);
    }
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <motion.div
        className="fixed inset-0 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.20 }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.58)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: overlayOp,  // dims as you drag the sheet down
        }}
        onClick={onClose}
      />

      {/* ── Bottom sheet ── */}
      <motion.div
        /* Slide up from bottom — using initial/animate (no style.y conflict) */
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340, mass: 0.85 }}
        /* Swipe-down-to-close: drag is handled SEPARATELY from the slide animation */
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.18 }}
        dragMomentum={false}
        onDrag={(_, info) => dragY.set(Math.max(0, info.offset.y))}
        onDragEnd={handleDragEnd}
        className="fixed inset-x-2 z-[70] mx-auto flex max-w-lg flex-col overflow-hidden"
        style={{
          scale: sheetScale,
          bottom: 'max(8px, env(safe-area-inset-bottom))',
          height: 'calc(100dvh - 64px)',
          borderRadius: 32,
          background: 'linear-gradient(180deg, #151C30 0%, #0C1122 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle */}
        <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2">
          <div className="h-[4px] w-[38px] rounded-full bg-white/25" />
        </div>

        {/* ══════════════════════════════════
            STICKY HEADER — always visible
        ══════════════════════════════════ */}
        <div
          className="sticky top-0 z-30 shrink-0 flex items-center gap-3 px-4 pb-3"
          style={{
            paddingTop: 'max(20px, calc(env(safe-area-inset-top) + 12px))',
            background: 'rgba(21,28,48,0.92)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Close — always visible */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ background: 'rgba(255,255,255,0.10)' }}
          >
            <X className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
          </button>

          {/* Name + sector */}
          <div className="flex-1 min-w-0">
            <p className="truncate font-['Space_Grotesk'] text-[15px] font-bold text-white">
              {company.name}
            </p>
            <p className="text-[11px] font-medium text-white/50">{company.sector}</p>
          </div>

          {/* Score + share */}
          <div className="flex items-center gap-2 shrink-0">
            {company.score != null && <ScorePill score={company.score} />}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Share2 className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════
            SCROLLABLE CONTENT
        ══════════════════════════════════ */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto [scrollbar-width:none]"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Hero */}
          <div
            className="relative h-[210px] w-full shrink-0 overflow-hidden"
            style={{ background: bg }}
          >
            {hasImage && (
              <img
                alt={company.name}
                className="absolute inset-0 h-full w-full object-cover"
                src={company.gallery[0]}
              />
            )}
            {!hasImage && (
              <>
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-30 blur-3xl bg-white/10" />
                <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full opacity-20 blur-3xl bg-white/10" />
              </>
            )}
            {hasImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            )}
            {/* Location */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md">
              <MapPin className="h-3 w-3 text-white/80" />
              <span className="text-[11px] font-medium text-white/90">{company.location}</span>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6 px-5 py-5">

            {/* Instagram */}
            {company.instagramData && (
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Feed Instagram
                </p>
                <InstagramFeedModal data={company.instagramData} />
              </section>
            )}

            {/* Company profile */}
            <section>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Perfil de Empresa
              </p>
              <p className="text-[14px] leading-[1.65] text-white/70">
                {company.description || company.culture || company.headline}
              </p>
              {(company.size || company.businessType) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.size && <Chip>{company.size}</Chip>}
                  {company.businessType && <Chip>{company.businessType}</Chip>}
                </div>
              )}
            </section>

            {/* Alliance profile */}
            {(offersArr.length > 0 || needsArr.length > 0 || segments.length > 0) && (
              <section>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Perfil de Alianza
                </p>
                {offersArr.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-[11px] font-semibold text-white/55">Qué ofrece</p>
                    <div className="flex flex-wrap gap-1.5">
                      {offersArr.map((t) => <Chip key={t} tone="emerald">{t}</Chip>)}
                    </div>
                  </div>
                )}
                {needsArr.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-[11px] font-semibold text-white/55">Qué busca</p>
                    <div className="flex flex-wrap gap-1.5">
                      {needsArr.map((t) => <Chip key={t} tone="blue">{t}</Chip>)}
                    </div>
                  </div>
                )}
                {segments.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold text-white/55">Segmentos clave</p>
                    <div className="flex flex-wrap gap-1.5">
                      {segments.map((t) => <Chip key={t}>{t}</Chip>)}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Stats */}
            {(company.capacityScore || company.score) && (
              <section className="rounded-[20px] bg-white/[0.06] px-4 py-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Indicadores
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Match',      value: `${Math.round(company.score || 0)}%` },
                    { label: 'Capacidad',  value: `${company.capacityScore || 72}%` },
                    { label: 'Afinidad',   value: company.size === 'Mediana' ? 'Alta' : 'Media' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="font-['Space_Grotesk'] text-[18px] font-bold text-white">{value}</p>
                      <p className="mt-0.5 text-[10px] font-medium text-white/45">{label}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="h-4" />
          </div>
        </div>

        {/* ══════════════════════════════════
            STICKY FOOTER CTA
        ══════════════════════════════════ */}
        <div
          className="shrink-0 px-4 pt-3"
          style={{
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            background: 'rgba(12,17,34,0.94)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex gap-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => { onLike(); onClose(); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-[18px] py-4 text-[14px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 8px 24px rgba(37,99,235,0.40)',
              }}
            >
              <Heart className="h-4 w-4 fill-current" />
              Dar LIKE
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="flex items-center justify-center rounded-[18px] px-5 py-4 text-[14px] font-semibold text-white/75"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              Cerrar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default CompanyDetailModal;
