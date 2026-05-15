import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, MapPin, Share2, Star, X } from 'lucide-react';
import { useRef } from 'react';
import { InstagramFeedModal } from '../shared/InstagramFeedPreview';

/* ── Brand gradients per sector ─────────────────────────── */
const industryBg = {
  Indumentaria:      'radial-gradient(ellipse at 60% 0%, #9B8EC4 0%, #7B6BA8 40%, #C4A882 100%)',
  Belleza:           'radial-gradient(ellipse at 50% 0%, #E8C5D0 0%, #D4909A 45%, #B06070 100%)',
  Cafeteria:         'radial-gradient(ellipse at 30% 10%, #A07850 0%, #6B4228 50%, #3D2510 100%)',
  Gastronomia:       'radial-gradient(ellipse at 50% 0%, #4A7A3C 0%, #2D5522 50%, #1A3310 100%)',
  Gimnasio:          'radial-gradient(ellipse at 70% 0%, #2C3E6B 0%, #1A2644 50%, #0D1425 100%)',
  Tecnologia:        'radial-gradient(ellipse at 60% 10%, #2D1B69 0%, #1A0F42 50%, #0A0820 100%)',
  Floreria:          'radial-gradient(ellipse at 40% 0%, #C8D8B0 0%, #8FB87A 40%, #5A8A44 100%)',
  Moda:              'radial-gradient(ellipse at 50% 10%, #D4C0A8 0%, #B09070 45%, #806040 100%)',
  Bienestar:         'radial-gradient(ellipse at 60% 0%, #A8C8D8 0%, #78A8C0 40%, #4A7890 100%)',
  'Marketing Digital':'radial-gradient(ellipse at 60% 0%, #4A2080 0%, #2C1050 50%, #100820 100%)',
};

/* ── Pill chip ───────────────────────────────────────────── */
function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate:   'bg-slate-100  text-slate-600',
    blue:    'bg-blue-50    text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* ── Score pill ─────────────────────────────────────────── */
function ScorePill({ score }) {
  const pct = Math.round(score || 0);
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

/* ── Main component ─────────────────────────────────────── */
function CompanyDetailModal({ company, onClose, onLike }) {
  if (!company) return null;

  const bg       = industryBg[company.sector] || industryBg.Tecnologia;
  const hasImage = Boolean(company.gallery?.[0]);

  const offersArr   = company.offersArr   || company.offer?.split(', ')    || [];
  const needsArr    = company.needsArr    || company.seeking?.split(', ')   || [];
  const segments    = company.segments    || [];

  /* ── Swipe-to-close drag ── */
  const y          = useMotionValue(0);
  const bgOpacity  = useTransform(y, [0, 260], [0.60, 0]);
  const sheetScale = useTransform(y, [0, 260], [1, 0.96]);
  const contentRef = useRef(null);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 110 || info.velocity.y > 700) onClose();
    else y.set(0);
  };

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{ backgroundColor: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* ── Sheet ── */}
      <motion.div
        key="sheet"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.22 }}
        onDragEnd={handleDragEnd}
        style={{
          y,
          scale: sheetScale,
          height: 'calc(100dvh - 48px)',
          borderRadius: '28px 28px 0 0',
          background: '#FFFFFF',
          boxShadow: '0 -8px 48px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 360, mass: 0.9 }}
        className="fixed inset-x-0 bottom-0 z-[70] flex flex-col sm:inset-x-auto sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Pull handle ── */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 sm:hidden">
          <div className="h-[4px] w-[36px] rounded-full bg-black/12" />
        </div>

        {/* ═══════════════════════════════════
            STICKY HEADER — always visible
        ═══════════════════════════════════ */}
        <div
          className="sticky top-0 z-30 shrink-0 flex items-center justify-between gap-3 px-4 pb-3"
          style={{
            paddingTop: 'max(20px, calc(env(safe-area-inset-top) + 12px))',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {/* Close — always top-left */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ background: 'rgba(0,0,0,0.07)' }}
            aria-label="Cerrar"
          >
            <X className="h-4.5 w-4.5 text-[#141E30]" strokeWidth={2.2} />
          </button>

          {/* Name + sector */}
          <div className="flex-1 min-w-0">
            <p className="truncate font-['Space_Grotesk'] text-[15px] font-bold text-[#141E30]">
              {company.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">{company.sector}</p>
          </div>

          {/* Match score + share */}
          <div className="flex items-center gap-2 shrink-0">
            {company.score != null && <ScorePill score={company.score} />}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              <Share2 className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════
            SCROLLABLE CONTENT
        ═══════════════════════════════════ */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none]"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Hero image / gradient */}
          <div className="relative h-[220px] w-full shrink-0 overflow-hidden" style={{ background: bg }}>
            {hasImage && (
              <img
                alt={company.name}
                className="absolute inset-0 h-full w-full object-cover"
                src={company.gallery[0]}
              />
            )}
            {/* ambient glow blobs for gradient variant */}
            {!hasImage && (
              <>
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-35 blur-3xl bg-white/10" />
                <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full opacity-20 blur-3xl bg-white/10" />
              </>
            )}
            {hasImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            )}
            {/* Location pill */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md">
              <MapPin className="h-3 w-3 text-white/80" />
              <span className="text-[11px] font-medium text-white/90">{company.location}</span>
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-6 px-5 py-5">

            {/* Instagram feed */}
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
              <p className="text-[14px] leading-[1.65] text-slate-600">
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
                    <p className="mb-1.5 text-[11px] font-semibold text-slate-500">Qué ofrece</p>
                    <div className="flex flex-wrap gap-1.5">
                      {offersArr.map((tag) => <Chip key={tag} tone="emerald">{tag}</Chip>)}
                    </div>
                  </div>
                )}

                {needsArr.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-[11px] font-semibold text-slate-500">Qué busca</p>
                    <div className="flex flex-wrap gap-1.5">
                      {needsArr.map((tag) => <Chip key={tag} tone="blue">{tag}</Chip>)}
                    </div>
                  </div>
                )}

                {segments.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold text-slate-500">Segmentos clave</p>
                    <div className="flex flex-wrap gap-1.5">
                      {segments.map((tag) => <Chip key={tag}>{tag}</Chip>)}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Stats row */}
            {(company.capacityScore || company.score) && (
              <section className="rounded-[20px] bg-slate-50/80 px-4 py-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Indicadores
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Match', value: `${Math.round(company.score || 0)}%` },
                    { label: 'Capacidad', value: `${company.capacityScore || 72}%` },
                    { label: 'Afinidad', value: company.size === 'Mediana' ? 'Alta' : 'Media' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="font-['Space_Grotesk'] text-[18px] font-bold text-[#141E30]">{value}</p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Spacer for CTA overlap */}
            <div className="h-4" />
          </div>
        </div>

        {/* ═══════════════════════════════════
            STICKY FOOTER CTA
        ═══════════════════════════════════ */}
        <div
          className="shrink-0 px-4 pb-4 pt-3"
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex gap-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => { onLike(); onClose(); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-[18px] py-4 text-[14px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #141E30 0%, #1D3557 100%)',
                boxShadow: '0 6px 24px rgba(20,30,48,0.30)',
              }}
            >
              <Heart className="h-4 w-4 fill-current" />
              Dar LIKE
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="flex items-center justify-center rounded-[18px] px-5 py-4 text-[14px] font-semibold text-slate-600"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              Cerrar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CompanyDetailModal;
