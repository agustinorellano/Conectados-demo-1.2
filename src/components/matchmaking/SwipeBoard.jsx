import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Heart, MapPin, RotateCcw,
  SlidersHorizontal, Star, TrendingUp, Users, X, Zap,
} from 'lucide-react';
import CompanyDetailModal from './CompanyDetailModal';
import MatchOverlay from './MatchOverlay';
import { InstagramFeedCompact } from '../shared/InstagramFeedPreview';
import SwipeHeader from './SwipeHeader';
import CardStack from './CardStack';
import ActionButtons from './ActionButtons';
import { calculateMatchScore, shouldRevealCompany, willCreateMatch } from '../../utils/matchmaking';

const SWIPE_THRESHOLD_X = 100;

/* ── Filter options ─────────────────────────────────────────── */
const SEGMENT_OPTIONS = [
  'Indumentaria', 'Belleza', 'Cafetería', 'Gastronomía', 'Bienestar',
  'Tecnología', 'Retail', 'Accesorios', 'Decoración', 'Salud',
  'Perfumería', 'Bebidas',
];
const OFFERING_OPTIONS = ['Visibilidad', 'Descuentos', 'Co-marketing', 'Eventos', 'Distribución', 'Contenido digital'];
const SEEKING_OPTIONS  = ['Nuevos clientes', 'Tráfico local', 'Alcance online', 'Branding', 'Ventas directas', 'Comunidad'];
const FOLLOWERS_OPTIONS = [
  { value: 0,     label: 'Cualquiera' },
  { value: 1000,  label: '+1K' },
  { value: 5000,  label: '+5K' },
  { value: 10000, label: '+10K' },
  { value: 50000, label: '+50K' },
];
const LOCALES_OPTIONS = [
  { value: 1, label: '1+' }, { value: 2, label: '2+' },
  { value: 5, label: '5+' }, { value: 10, label: '10+' },
];
const DEFAULT_FILTERS = {
  location: '', maxDistance: 50, segments: [], offering: [],
  seeking: [], minFollowers: 0, hasWebsite: false, minLocales: 1,
};

/* ── Tag label map (offer / seeking) ────────────────────────── */
const TAG_LABEL = {
  espacio: 'Espacio físico', audiencia: 'Audiencia', producto: 'Producto',
  logistica: 'Logística', ventas: 'Ventas', visibilidad: 'Visibilidad',
  trafico: 'Tráfico', canales: 'Canales', branding: 'Branding',
  engagement: 'Engagement', clientes: 'Clientes',
};
const parseTags = (raw = '') =>
  raw.split(',').map(t => TAG_LABEL[t.trim()] || t.trim()).filter(Boolean).slice(0, 4);

/* ── Filters bottom sheet ───────────────────────────────────── */
function ChipGroup({ label, options, value, onChange }) {
  const toggle = (opt) =>
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-all ${
              value.includes(opt) ? 'bg-[#141E30] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

function FiltersPanel({ filters, onApply, onClose }) {
  const [local, setLocal] = useState(filters);
  const upd = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340, mass: 0.85 }}
        className="fixed inset-x-0 bottom-0 z-[70] flex flex-col bg-white"
        style={{ maxHeight: '90dvh', borderRadius: '24px 24px 0 0', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 pb-4 pt-2">
          <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-[#141E30]">Configurar búsqueda</h2>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
          <div className="space-y-7 px-5 py-5">
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Ubicación</p>
              <input type="text" value={local.location} onChange={e => upd('location', e.target.value)}
                placeholder="Ej: Buenos Aires, Córdoba…"
                className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-[#1A1A1A] outline-none transition focus:border-[#1871D8]/40 focus:ring-2 focus:ring-[#1871D8]/10" />
            </div>
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Distancia máxima</p>
                <span className="text-[13px] font-bold text-[#1871D8]">{local.maxDistance} km</span>
              </div>
              <input type="range" min={1} max={200} step={1} value={local.maxDistance}
                onChange={e => upd('maxDistance', Number(e.target.value))} className="w-full accent-[#141E30]" />
              <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>1 km</span><span>200 km</span></div>
            </div>
            <ChipGroup label="Segmentos clave" options={SEGMENT_OPTIONS} value={local.segments} onChange={v => upd('segments', v)} />
            <ChipGroup label="Qué ofrezco" options={OFFERING_OPTIONS} value={local.offering} onChange={v => upd('offering', v)} />
            <ChipGroup label="Qué busco" options={SEEKING_OPTIONS} value={local.seeking} onChange={v => upd('seeking', v)} />
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Seguidores mínimos</p>
              <div className="flex flex-wrap gap-2">
                {FOLLOWERS_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => upd('minFollowers', opt.value)}
                    className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-all ${
                      local.minFollowers === opt.value ? 'bg-[#141E30] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A1A]">Tiene página web</p>
                <p className="text-[12px] text-slate-400">Solo mostrar comercios con web propia</p>
              </div>
              <button type="button" onClick={() => upd('hasWebsite', !local.hasWebsite)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${local.hasWebsite ? 'bg-[#141E30]' : 'bg-slate-200'}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${local.hasWebsite ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Cantidad de locales</p>
              <div className="flex gap-2">
                {LOCALES_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => upd('minLocales', opt.value)}
                    className={`flex-1 rounded-[12px] py-2.5 text-[13px] font-semibold transition-all ${
                      local.minLocales === opt.value ? 'bg-[#141E30] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div className="h-2" />
          </div>
        </div>
        <div className="shrink-0 flex gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <button type="button" onClick={() => { setLocal(DEFAULT_FILTERS); onApply(DEFAULT_FILTERS); onClose(); }}
            className="rounded-[16px] border border-slate-200 px-5 py-3.5 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-50">
            Resetear
          </button>
          <button type="button" onClick={() => { onApply(local); onClose(); }}
            className="flex-1 rounded-[16px] bg-[#141E30] py-3.5 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#1A2C45]">
            Aplicar filtros
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ── Saved grid ─────────────────────────────────────────────── */
const sectorBg = {
  Indumentaria: 'linear-gradient(135deg, #9B8EC4, #C4A882)',
  Belleza: 'linear-gradient(135deg, #D4909A, #E8C5D0)',
  Cafeteria: 'linear-gradient(135deg, #6B4228, #A07850)',
  Gastronomia: 'linear-gradient(135deg, #2D5522, #4A7A3C)',
  Gimnasio: 'linear-gradient(135deg, #1A2644, #2C3E6B)',
  Tecnologia: 'linear-gradient(135deg, #1A0F42, #2D1B69)',
  Floreria: 'linear-gradient(135deg, #5A8A44, #8FB87A)',
  Moda: 'linear-gradient(135deg, #806040, #B09070)',
  Bienestar: 'linear-gradient(135deg, #4A7890, #78A8C0)',
  'Marketing Digital': 'linear-gradient(135deg, #2C1050, #4A2080)',
};

function SavedGrid({ companies, onView }) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <Star className="h-6 w-6 text-white/30" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white/60">Sin guardados todavía</p>
          <p className="mt-1 text-[12px] text-white/35">Usá ★ para guardar comercios interesantes</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none]">
      <div className="grid grid-cols-2 gap-3">
        {companies.map(company => (
          <motion.button key={company.id} type="button" onClick={() => onView(company)}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden rounded-[20px] text-left"
            style={{ aspectRatio: '3/4', boxShadow: '0 8px 24px rgba(0,0,0,0.45)' }}>
            {company.gallery?.[0] ? (
              <img src={company.gallery[0]} alt={company.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: sectorBg[company.sector] || 'linear-gradient(135deg, #141E30, #35577D)' }}>
                <span className="absolute inset-0 flex items-center justify-center font-['Space_Grotesk'] font-black text-white" style={{ fontSize: 48, opacity: 0.07 }}>
                  {company.logo}
                </span>
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[12px] font-bold leading-tight text-white">{company.name}</p>
              <p className="mt-0.5 text-[10px] text-white/55">{company.sector}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ── industry hero gradient ─────────────────────────────────── */
const industryBg = {
  Belleza:     'linear-gradient(135deg, #D4909A 0%, #B06070 100%)',
  Floreria:    'linear-gradient(135deg, #8FB87A 0%, #5A8A44 100%)',
  Gastronomia: 'linear-gradient(135deg, #4A7A3C 0%, #2D5522 100%)',
  Cafeteria:   'linear-gradient(135deg, #A07850 0%, #6B4228 100%)',
  Bienestar:   'linear-gradient(135deg, #78A8C0 0%, #4A7890 100%)',
  Indumentaria:'linear-gradient(135deg, #9B8EC4 0%, #7B6BA8 100%)',
  Tecnologia:  'linear-gradient(135deg, #2D1B69 0%, #1A0F42 100%)',
};

/* ── Desktop right panel — full company profile ─────────────── */
const COMMON_CONNECTIONS = ['Bloom Florería', 'Sushi Nakama'];

function ScoreRing({ score, color, size = 56 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={5} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
    </svg>
  );
}

function DesktopDetailPanel({ company, score, deckIndex, deckTotal }) {
  if (!company) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-white/20">Seleccioná una empresa para ver el detalle</p>
      </div>
    );
  }

  const offerTags  = parseTags(company.offer || '');
  const seekTags   = parseTags(company.seeking || '');
  const segments   = company.segments || [];
  const hasImage   = Boolean(company.gallery?.[0]);
  const heroBg     = industryBg[company.sector] || 'linear-gradient(135deg, #1871D8 0%, #0A3D7A 100%)';
  const followers  = company.instagramData?.followers ?? null;
  const lift       = company.stats?.conversionLift;

  /* Score tiers: green ≥80, blue ≥60, amber <60 */
  const scoreColor = score >= 80 ? '#4ADE80' : score >= 60 ? '#4A9FFF' : '#FBBF24';
  const scoreGrad  = score >= 80
    ? 'linear-gradient(90deg, #16A34A, #4ADE80)'
    : score >= 60
      ? 'linear-gradient(90deg, #1D5FD0, #4A9FFF)'
      : 'linear-gradient(90deg, #B45309, #FBBF24)';
  const scoreBg    = score >= 80
    ? 'rgba(74,222,128,0.08)'
    : score >= 60
      ? 'rgba(74,159,255,0.08)'
      : 'rgba(251,191,36,0.08)';

  return (
    <div className="flex flex-1 flex-col h-full overflow-y-auto [scrollbar-width:none]">

      {/* ── Hero image / gradient ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ height: 220, background: heroBg }}>
        {hasImage && (
          <img src={company.gallery[0]} alt={company.name}
            className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,12,24,1) 0%, rgba(7,12,24,0.15) 55%, transparent 100%)' }} />

        {/* Progress dots — bigger, more visible */}
        {deckTotal > 0 && (
          <div className="absolute top-4 right-5 flex items-center gap-1.5">
            {Array.from({ length: Math.min(deckTotal, 8) }).map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  height: 6,
                  width: i === deckIndex % 8 ? 18 : 6,
                  background: i === deckIndex % 8 ? 'white' : 'rgba(255,255,255,0.30)',
                  boxShadow: i === deckIndex % 8 ? '0 0 6px rgba(255,255,255,0.5)' : 'none',
                }} />
            ))}
          </div>
        )}

        {/* Company name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white leading-tight">{company.name}</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-white/65 text-[13px]">{company.sector}</span>
            {company.distance != null && (
              <span className="flex items-center gap-1 text-white/40 text-[11px]">
                <MapPin size={10} /> {company.distance} km
              </span>
            )}
            {followers != null && (
              <span className="flex items-center gap-1 text-white/40 text-[11px]">
                <Users size={10} /> {followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : followers} seg.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex flex-col gap-5 px-6 py-5">

        {/* Compatibility — score ring + bar (enhanced) */}
        <div className="rounded-[20px] p-5" style={{ background: scoreBg, border: `1px solid ${scoreColor}28` }}>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: 72, height: 72 }}>
              <ScoreRing score={score} color={scoreColor} size={72} />
              <div className="absolute flex flex-col items-center leading-none">
                <span className="font-['Space_Grotesk'] text-[18px] font-black" style={{ color: scoreColor }}>{score}%</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Compatibilidad</span>
                <span className="text-[13px] font-bold" style={{ color: scoreColor }}>
                  {score >= 80 ? 'Excelente' : score >= 60 ? 'Buena' : 'Moderada'}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: scoreGrad }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="font-['Space_Grotesk'] text-[15px] font-black text-white">{company.capacityScore ?? 68}%</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Capacidad</p>
                </div>
                <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div>
                  <p className="font-['Space_Grotesk'] text-[15px] font-black" style={{ color: '#4ADE80' }}>{lift ?? '+9%'}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Ventas est.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Por qué son compatibles */}
        {(company.description || company.culture || company.headline) && (
          <div className="rounded-[16px] p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#4A9FFF' }}>✦ Por qué son compatibles</p>
            <p className="text-[13px] leading-relaxed text-white/65">
              {company.description || company.culture || company.headline}
            </p>
          </div>
        )}

        {/* Instagram feed strip */}
        {company.instagramData && (
          <div className="rounded-[16px] p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <InstagramFeedCompact data={company.instagramData} />
          </div>
        )}

        {/* Alliance profile */}
        {(offerTags.length > 0 || seekTags.length > 0 || segments.length > 0) && (
          <div className="rounded-[16px] p-4 space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {offerTags.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-2">Qué ofrece</p>
                <div className="flex flex-wrap gap-1.5">
                  {offerTags.map(t => (
                    <span key={t} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-[#4A9FFF]"
                      style={{ background: 'rgba(74,159,255,0.10)', border: '1px solid rgba(74,159,255,0.18)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {seekTags.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-2">Qué busca</p>
                <div className="flex flex-wrap gap-1.5">
                  {seekTags.map(t => (
                    <span key={t} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white/50"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {segments.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-2">Segmentos</p>
                <div className="flex flex-wrap gap-1.5">
                  {segments.map(t => (
                    <span key={t} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white/40"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conexiones en común */}
        <div className="rounded-[16px] p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Users size={12} style={{ color: '#4A9FFF' }} />
            <span className="text-[11px] font-semibold text-white/35">{COMMON_CONNECTIONS.length} conexiones en común</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_CONNECTIONS.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white/45"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
                  {c.slice(0, 1)}
                </div>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SWIPE BOARD — main component
══════════════════════════════════════════════════════════════ */
function SwipeBoard({ companies, dailyMatchCount, onMatch, onOpenPricing, userPlan, myCompany }) {
  const deck = useMemo(
    () => companies
      .map(c => ({ ...c, score: calculateMatchScore(c) }))
      .filter(c => shouldRevealCompany(c.score)),
    [companies]
  );

  /* ── Deck navigation ── */
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [history,        setHistory]        = useState([]);
  const [flashMessage,   setFlashMessage]   = useState(null);
  const [exitState,      setExitState]      = useState({ x: 0, y: 0 });
  const [viewingCompany, setViewingCompany] = useState(null);

  /* ── UI state ── */
  const [matchedCompany, setMatchedCompany] = useState(null);
  const [activeTab,   setActiveTab]   = useState('paraTi');
  const [showFilters, setShowFilters] = useState(false);
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);
  const [savedIds,    setSavedIds]    = useState(() => new Set());
  const [isDesktop,   setIsDesktop]   = useState(() => window.innerWidth >= 1024);

  /* ── Drag motion values ── */
  const x      = useMotionValue(0);
  const y      = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-12, 12]);
  const flyAnimX = useRef(null);
  const flyAnimY = useRef(null);

  const likeOpacity    = useTransform(x, [20,  SWIPE_THRESHOLD_X],  [0, 1]);
  const nopeOpacity    = useTransform(x, [-20, -SWIPE_THRESHOLD_X], [0, 1]);
  const nextScale      = useTransform(x, [-200, 0, 200], [1,    0.95, 1]);
  const nextOpacity    = useTransform(x, [-200, 0, 200], [1,    0.72, 1]);
  const nextTranslateY = useTransform(x, [-200, 0, 200], [0,    14,   0]);
  const thirdScale     = useTransform(x, [-200, 0, 200], [0.915, 0.90, 0.915]);
  const thirdOpacity   = useTransform(x, [-200, 0, 200], [0.45,  0.30, 0.45]);

  const activeCompany  = deck[activeIndex];
  const nextCompany    = deck[activeIndex + 1];
  const thirdCompany   = deck[activeIndex + 2];
  const matchLimitReached = userPlan === 'starter' && dailyMatchCount >= 10;

  const savedCompanies = useMemo(() => deck.filter(c => savedIds.has(c.id)), [deck, savedIds]);

  /* ── Resize listener ── */
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  /* ── Flash toast ── */
  const showFlash = (message) => {
    setFlashMessage(message);
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlashMessage(null), 1300);
  };

  /* ── Reset drag on new card ── */
  useEffect(() => {
    flyAnimX.current?.stop();
    flyAnimY.current?.stop();
    x.set(0);
    y.set(0);
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Actions ── */
  const queueNextCompany = (state) => {
    if (!activeCompany) return;
    setHistory(curr => [...curr, { index: activeIndex }]);
    setExitState(state);
    window.setTimeout(() => setActiveIndex(curr => curr + 1), 250);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    x.set(0); y.set(0);
    setActiveIndex(prev.index);
    showFlash('Deshecho');
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
      setMatchedCompany(activeCompany);
    } else {
      showFlash('Like enviado');
    }
    queueNextCompany({ x: 220, y: -20 });
  };

  const handleSave = () => {
    if (!activeCompany) return;
    setSavedIds(prev => new Set([...prev, activeCompany.id]));
    showFlash(`${activeCompany.name} guardada ★`);
  };

  const handleViewProfile = () => {
    if (!activeCompany) return;
    setViewingCompany({ ...activeCompany });
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD_X) {
      flyAnimX.current = animate(x, -520, { duration: 0.28, ease: [0.32, 0, 0.67, 0] });
      flyAnimY.current = animate(y, 20,   { duration: 0.28 });
      handleSkip(); return;
    }
    if (info.offset.x > SWIPE_THRESHOLD_X) {
      flyAnimX.current = animate(x, 520,  { duration: 0.28, ease: [0.32, 0, 0.67, 0] });
      flyAnimY.current = animate(y, -20,  { duration: 0.28 });
      handleLike(); return;
    }
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 });
    animate(y, 0, { type: 'spring', stiffness: 500, damping: 40 });
  };

  /* ── Keyboard navigation (desktop) ── */
  const handleSkipRef = useRef(handleSkip);
  const handleLikeRef = useRef(handleLike);
  const handleSaveRef = useRef(handleSave);
  useEffect(() => { handleSkipRef.current = handleSkip; handleLikeRef.current = handleLike; handleSaveRef.current = handleSave; });

  useEffect(() => {
    if (!isDesktop) return;
    const fn = (e) => {
      if (e.key === 'ArrowLeft')  handleSkipRef.current();
      if (e.key === 'ArrowRight') handleLikeRef.current();
      if (e.key === 'ArrowUp')    handleSaveRef.current();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isDesktop]);

  /* ── Shared card stack props ── */
  const cardStackProps = {
    activeCompany, nextCompany, thirdCompany,
    x, y, rotate, likeOpacity, nopeOpacity,
    nextScale, nextOpacity, nextTranslateY,
    thirdScale, thirdOpacity, exitState,
    onDragEnd: handleDragEnd,
    onViewProfile: handleViewProfile,
    onOpenFilters: () => setShowFilters(true),
  };

  const BG = 'linear-gradient(160deg, #070C18 0%, #0F1828 55%, #141E30 100%)';

  /* ════════════════════════════════════════════════════════════
     DESKTOP LAYOUT
  ════════════════════════════════════════════════════════════ */
  if (isDesktop) {
    return (
      <>
        <div className="flex flex-col h-full" style={{ background: BG }}>

          {/* ── Banner ── */}
          <div className="shrink-0 px-6 pt-5 pb-4">
            <div className="rounded-[22px] px-6 py-5 text-white"
              style={{ background: 'linear-gradient(110deg, #1871D8 0%, #145db1 50%, #141E30 100%)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">Explorar</p>
              <h2 className="mt-1.5 font-['Space_Grotesk'] text-[20px] font-bold leading-tight tracking-tight">
                Descubrí empresas con las que crear alianzas
              </h2>
              <p className="mt-1 text-[12px] leading-5 text-white/70">
                Cada empresa fue seleccionada según tu perfil, sector y lo que buscás en una alianza.
              </p>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">

          {/* ── Left panel: card + controls ── */}
          <div className="flex w-[440px] shrink-0 flex-col h-full" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Tab header */}
            <div className="flex shrink-0 items-center justify-between px-5 py-4">
              <div className="flex items-center rounded-full p-1"
                style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {[{ id: 'paraTi', label: 'Para ti' }, { id: 'guardados', label: 'Guardados' }].map(tab => (
                  <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ${
                      activeTab === tab.id ? 'bg-white text-[#141E30] shadow-sm' : 'text-white/55 hover:text-white/80'
                    }`}>
                    {tab.label}
                    {tab.id === 'guardados' && savedIds.size > 0 && (
                      <span className={`ml-1 text-[11px] ${activeTab === tab.id ? 'text-[#141E30]/60' : 'text-white/35'}`}>({savedIds.size})</span>
                    )}
                  </button>
                ))}
              </div>
              <motion.button type="button" onClick={() => setShowFilters(true)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.90 }}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)' }}>
                <SlidersHorizontal size={16} className="text-white/70" />
              </motion.button>
            </div>

            {activeTab === 'guardados' ? (
              <SavedGrid companies={savedCompanies} onView={c => setViewingCompany(c)} />
            ) : (
              <div className="flex flex-1 flex-col px-5 min-h-0">

                {/* Card container — fixed height so CardStack fills it */}
                <div className="relative rounded-[24px] overflow-hidden shrink-0" style={{ height: 460 }}>
                  <CardStack {...cardStackProps} />
                </div>

                {/* Keyboard hints */}
                <div className="flex items-center justify-center gap-4 py-2.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <kbd className="rounded-[6px] px-2 py-1 font-mono text-[11px] font-semibold text-white/50"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>←</kbd>
                    <span className="text-[12px] text-white/30">Pasar</span>
                  </div>
                  <span className="text-[11px] text-white/15">·</span>
                  <span className="text-[11px] text-white/25">arrastrá</span>
                  <span className="text-[11px] text-white/15">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-white/30">Conectar</span>
                    <kbd className="rounded-[6px] px-2 py-1 font-mono text-[11px] font-semibold text-white/50"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>→</kbd>
                  </div>
                </div>

                {/* Desktop action buttons */}
                <div className="flex items-center justify-center gap-3 pb-5 shrink-0">
                  <motion.button type="button" onClick={handleUndo}
                    whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.88 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)' }}>
                    <RotateCcw size={17} className="text-amber-400" />
                  </motion.button>

                  <motion.button type="button" onClick={handleSkip}
                    whileHover={{ scale: 1.06, x: -2 }} whileTap={{ scale: 0.90 }}
                    className="flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold transition"
                    style={{ background: 'rgba(244,63,94,0.12)', border: '1.5px solid rgba(244,63,94,0.35)', color: '#F87171' }}>
                    <X size={15} strokeWidth={2.5} />
                    Pasar
                  </motion.button>

                  <motion.button type="button" onClick={handleSave}
                    whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.88 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: 'rgba(251,191,36,0.10)', border: '1.5px solid rgba(251,191,36,0.28)' }}>
                    <Star size={17} className="text-amber-400" />
                  </motion.button>

                  <motion.button type="button" onClick={handleLike}
                    whileHover={{ scale: 1.06, x: 2 }} whileTap={{ scale: 0.90 }}
                    className="flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold transition"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1.5px solid rgba(34,197,94,0.35)', color: '#4ADE80' }}>
                    <Heart size={15} strokeWidth={2} />
                    Conectar
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right panel: company detail ── */}
          <DesktopDetailPanel
            company={activeCompany}
            score={activeCompany?.score ?? 0}
            deckIndex={activeIndex}
            deckTotal={deck.length}
          />

          {/* Flash toast — top center on desktop */}
          <AnimatePresence>
            {flashMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-none absolute left-1/2 top-5 z-[60] -translate-x-1/2 rounded-[14px] px-5 py-2.5 text-[13px] font-semibold text-white/90"
                style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                {flashMessage}
              </motion.div>
            )}
          </AnimatePresence>
          </div>{/* end flex-1 panels row */}
        </div>

        {/* Shared modals */}
        <MatchOverlay
          company={matchedCompany}
          myCompany={myCompany}
          onClose={() => setMatchedCompany(null)}
          onGoToChats={() => { setMatchedCompany(null); onMatch?.(matchedCompany); }}
        />
        <AnimatePresence>
          {viewingCompany && (
            <CompanyDetailModal key={viewingCompany.id} company={viewingCompany} onClose={() => setViewingCompany(null)} onLike={handleLike} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showFilters && <FiltersPanel filters={filters} onApply={setFilters} onClose={() => setShowFilters(false)} />}
        </AnimatePresence>
      </>
    );
  }

  /* ════════════════════════════════════════════════════════════
     MOBILE LAYOUT (unchanged)
  ════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="relative h-full overflow-hidden" style={{ background: BG }}>

        {activeTab === 'guardados' && (
          <div className="flex h-full flex-col">
            <div className="shrink-0 flex items-center justify-between px-4 pb-2 pt-3">
              <motion.button type="button" onClick={() => setShowFilters(true)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.90 }}
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)' }}>
                <SlidersHorizontal className="h-[18px] w-[18px] text-white/70" />
              </motion.button>
              <div className="flex items-center rounded-full p-1" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
                {[{ id: 'paraTi', label: 'Para ti' }, { id: 'guardados', label: 'Guardados' }].map(tab => (
                  <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-[#141E30] shadow-sm' : 'text-white/50 hover:text-white/75'}`}>
                    {tab.label}
                    {tab.id === 'guardados' && savedIds.size > 0 && (
                      <span className={`ml-1 text-[11px] ${activeTab === tab.id ? 'text-[#141E30]/60' : 'text-white/35'}`}>({savedIds.size})</span>
                    )}
                  </button>
                ))}
              </div>
              <motion.button type="button" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.90 }}
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)' }}>
                <Zap className="h-[18px] w-[18px] text-[#4A9FFF]" />
              </motion.button>
            </div>
            <SavedGrid companies={savedCompanies} onView={c => setViewingCompany(c)} />
          </div>
        )}

        {activeTab !== 'guardados' && (
          <>
            <CardStack {...cardStackProps} />
            <SwipeHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              savedCount={savedIds.size}
              onOpenFilters={() => setShowFilters(true)}
            />
            <ActionButtons
              onUndo={handleUndo}
              onSkip={handleSkip}
              onSave={handleSave}
              onLike={handleLike}
              onViewProfile={handleViewProfile}
            />

            <AnimatePresence>
              {flashMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-x-6 z-[60] rounded-[18px] px-5 py-2.5 text-center text-[13px] font-semibold text-white/90"
                  style={{
                    bottom: 'calc(max(22px, env(safe-area-inset-bottom)) + 76px)',
                    background: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                  {flashMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {matchLimitReached && (
              <div className="absolute inset-x-4 z-[60] rounded-[16px] border border-amber-400/20 bg-amber-400/8 p-3.5 text-center text-[13px] leading-6 text-amber-200"
                style={{ bottom: 'calc(max(22px, env(safe-area-inset-bottom)) + 80px)' }}>
                Llegaste al límite diario del plan Starter.
                <button type="button" onClick={onOpenPricing} className="mt-2 inline-flex rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Ver planes
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <MatchOverlay
        company={matchedCompany}
        myCompany={myCompany}
        onClose={() => setMatchedCompany(null)}
        onGoToChats={() => { setMatchedCompany(null); onMatch?.(matchedCompany); }}
      />
      <AnimatePresence>
        {viewingCompany && (
          <CompanyDetailModal key={viewingCompany.id} company={viewingCompany} onClose={() => setViewingCompany(null)} onLike={handleLike} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFilters && <FiltersPanel filters={filters} onApply={setFilters} onClose={() => setShowFilters(false)} />}
      </AnimatePresence>
    </>
  );
}

export default SwipeBoard;
