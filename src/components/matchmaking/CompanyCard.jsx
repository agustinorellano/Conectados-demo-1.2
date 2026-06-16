import { motion } from 'framer-motion';
import { ArrowUp, Navigation } from 'lucide-react';

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

const TAG_LABEL = {
  espacio:     'Espacio físico',
  audiencia:   'Audiencia',
  producto:    'Producto',
  logistica:   'Logística',
  ventas:      'Ventas',
  visibilidad: 'Visibilidad',
  trafico:     'Tráfico',
  canales:     'Canales',
  branding:    'Branding',
  engagement:  'Engagement',
  clientes:    'Clientes',
};

function formatTags(raw = '') {
  return raw
    .split(',')
    .map(t => TAG_LABEL[t.trim()] || t.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function Pill({ children }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white/80"
      style={{
        background: 'rgba(255,255,255,0.11)',
        border: '1px solid rgba(255,255,255,0.13)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </span>
  );
}

function CompanyCard({ company, onViewProfile }) {
  const bg     = industryBg[company.sector]     || industryBg.Tecnologia;
  const accent = industryAccent[company.sector] || 'rgba(24,113,216,0.55)';
  const hasImage = Boolean(company.gallery?.[0]);

  const offerTags   = formatTags(company.offer);
  const seekingTags = formatTags(company.seeking);

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
        <img alt={company.name} className="absolute inset-0 h-full w-full object-cover" src={company.gallery[0]} />
      ) : (
        <div className="absolute inset-0" style={{ background: bg }}>
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl" style={{ background: accent, opacity: 0.38 }} />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full blur-3xl" style={{ background: accent, opacity: 0.25 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-['Space_Grotesk'] font-black text-white"
              style={{ fontSize: 'clamp(80px, 22vw, 140px)', opacity: 0.055, lineHeight: 1 }}>
              {company.logo}
            </span>
          </div>
        </div>
      )}

      {/* ── Gradients ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 100%)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '70%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.62) 40%, rgba(0,0,0,0.08) 68%, transparent 100%)',
        }} />

      {/* ── Name — top left, below floating header ── */}
      <div className="absolute left-4 right-16 top-[68px] z-10">
        <h3
          className="font-['Space_Grotesk'] text-[28px] font-bold leading-tight tracking-tight text-white"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
        >
          {company.name}
        </h3>
      </div>

      {/* ── Bottom info — visible without tapping ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-[92px] pt-4">

        {/* Distance + Sector + arrow */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Distance */}
            <div className="flex items-center gap-1">
              <Navigation className="h-3 w-3 shrink-0 text-white/45" strokeWidth={2} />
              <span className="text-[12px] font-medium text-white/45">{company.distance ?? '—'} km</span>
            </div>

            {/* Sector pill */}
            <div className="rounded-full px-2.5 py-1"
              style={{ background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">{company.sector}</span>
            </div>
          </div>

          {onViewProfile && (
            <motion.button type="button"
              onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.90 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.45)' }}>
              <ArrowUp className="h-4 w-4 text-[#141E30]" strokeWidth={2.5} />
            </motion.button>
          )}
        </div>

        {/* Ofrece */}
        {offerTags.length > 0 && (
          <div className="mt-2.5">
            <div className="flex flex-wrap gap-1.5">
              {offerTags.map(t => <Pill key={t}>{t}</Pill>)}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default CompanyCard;
