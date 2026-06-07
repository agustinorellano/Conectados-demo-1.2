import { motion } from 'framer-motion';
import { ArrowUp, MapPin } from 'lucide-react';
import { InstagramFeedCompact } from '../shared/InstagramFeedPreview';

/* ── Per-sector gradient backgrounds ─────────────────── */
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

const industryAccent = {
  Indumentaria:       'rgba(155,142,196,0.55)',
  Belleza:            'rgba(232,197,208,0.55)',
  Cafeteria:          'rgba(160,120,80,0.55)',
  Gastronomia:        'rgba(74,122,60,0.55)',
  Gimnasio:           'rgba(44,62,107,0.55)',
  Tecnologia:         'rgba(45,27,105,0.55)',
  Floreria:           'rgba(200,216,176,0.55)',
  Moda:               'rgba(212,192,168,0.55)',
  Bienestar:          'rgba(168,200,216,0.55)',
  'Marketing Digital':'rgba(74,32,128,0.55)',
};

/* ─────────────────────────────────────────────────────────
   CompanyCard — Tinder-style full-height card
───────────────────────────────────────────────────────── */
function CompanyCard({ company, onViewProfile }) {
  const bg       = industryBg[company.sector]     || industryBg.Tecnologia;
  const accent   = industryAccent[company.sector] || 'rgba(24,113,216,0.55)';
  const hasImage = Boolean(company.gallery?.[0]);

  return (
    <article
      className="relative h-full w-full overflow-hidden"
      style={{
        boxShadow:
          '0 28px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.20)',
      }}
    >
      {/* ── Background ── */}
      {hasImage ? (
        <img
          alt={company.name}
          className="absolute inset-0 h-full w-full object-cover"
          src={company.gallery[0]}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: bg }}>
          <div
            className="absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl"
            style={{ background: accent, opacity: 0.38 }}
          />
          <div
            className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full blur-3xl"
            style={{ background: accent, opacity: 0.25 }}
          />
          {/* Giant logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="select-none font-['Space_Grotesk'] font-black text-white"
              style={{ fontSize: 'clamp(80px, 22vw, 140px)', opacity: 0.055, lineHeight: 1 }}
            >
              {company.logo}
            </span>
          </div>
        </div>
      )}

      {/* ── Gradient overlays ── */}
      {/* Top vignette — makes sector badge readable */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 100%)' }}
      />
      {/* Bottom gradient — heavy for text readability (Tinder-style) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '62%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.08) 70%, transparent 100%)',
        }}
      />

      {/* ── Sector badge — below floating header ── */}
      <div
        className="absolute left-4 top-[68px] z-10 rounded-full px-3.5 py-1.5"
        style={{
          background: 'rgba(0,0,0,0.30)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-white/90">
          {company.sector}
        </span>
      </div>

      {/* ── Bottom info overlay — Tinder-style ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pt-8">

        {/* Name + score + arrow button */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">

            {/* Company name inline with match score (like "Nombre  Edad" in Tinder) */}
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h3
                className="font-['Space_Grotesk'] text-[26px] font-bold leading-tight tracking-tight text-white"
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}
              >
                {company.name}
              </h3>
              {company.score != null && (
                <span className="text-[22px] font-semibold text-white/60">
                  {Math.round(company.score)}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-white/55" />
              <span className="text-[13px] font-medium text-white/55">{company.location}</span>
            </div>

            {/* Segment pills */}
            {company.segments?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {company.segments.slice(0, 3).map((seg) => (
                  <span
                    key={seg}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium capitalize text-white/80"
                    style={{
                      background: 'rgba(255,255,255,0.13)',
                      border: '1px solid rgba(255,255,255,0.13)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {seg}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* View-profile arrow — only on the active card (prop present) */}
          {onViewProfile && (
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.90 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.45)' }}
            >
              <ArrowUp className="h-5 w-5 text-[#141E30]" strokeWidth={2.5} />
            </motion.button>
          )}
        </div>

        {/* Instagram compact feed (if available) */}
        <InstagramFeedCompact data={company.instagramData} />
      </div>
    </article>
  );
}

export default CompanyCard;
