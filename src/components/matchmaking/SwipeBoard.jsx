import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Bookmark, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Heart, MapPin, RotateCcw,
  Search, Share2, SlidersHorizontal, Star, Store, Tag, Users, UsersRound, X, Zap,
} from 'lucide-react';
import CompanyDetailModal from './CompanyDetailModal';
import MatchOverlay from './MatchOverlay';
import SwipeHeader from './SwipeHeader';
import CompanyCard from './CompanyCard';
import ActionButtons from './ActionButtons';
import { useTheme } from '../../context/ThemeContext';
import { calculateMatchScore, shouldRevealCompany, willCreateMatch } from '../../utils/matchmaking';


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

/* ── Filtros en escritorio: panel lateral flotante (en el teléfono se mantiene la hoja inferior) ───── */
function FilterSection({ title, aside, c, children }) {
  return (
    <section className="py-6" style={{ borderTop: `1px solid ${c.divider}` }}>
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: c.label, fontFamily: APPLE_FONT }}>{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function FiltersDrawer({ filters, onApply, onClose, p }) {
  const [local, setLocal] = useState(filters);
  const upd = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));
  const dark = p.isDark;
  const ACCENT = '#455BE8';

  const c = dark
    ? { panel: 'linear-gradient(180deg, #151C30 0%, #0C1122 100%)', border: 'rgba(255,255,255,0.09)', text: '#FFFFFF', body: 'rgba(255,255,255,0.68)',
        label: 'rgba(255,255,255,0.42)', chip: 'rgba(255,255,255,0.07)', chipText: 'rgba(255,255,255,0.78)', chipBorder: 'rgba(255,255,255,0.10)',
        field: 'rgba(255,255,255,0.06)', divider: 'rgba(255,255,255,0.08)', track: 'rgba(255,255,255,0.18)', closeBg: 'rgba(255,255,255,0.08)', shadow: '0 30px 80px rgba(0,0,0,0.6)' }
    : { panel: '#FFFFFF', border: 'rgba(15,23,42,0.08)', text: '#1D1D1F', body: '#515257',
        label: '#86868B', chip: '#F2F3F8', chipText: '#515257', chipBorder: 'transparent',
        field: '#F5F6FA', divider: 'rgba(15,23,42,0.08)', track: 'rgba(15,23,42,0.14)', closeBg: 'rgba(15,23,42,0.06)', shadow: '0 30px 80px rgba(15,23,42,0.28)' };

  const activeCount =
    (local.location ? 1 : 0) + (local.maxDistance !== DEFAULT_FILTERS.maxDistance ? 1 : 0) +
    local.segments.length + local.offering.length + local.seeking.length +
    (local.minFollowers ? 1 : 0) + (local.hasWebsite ? 1 : 0) + (local.minLocales > 1 ? 1 : 0);

  // Esc cierra; mientras está abierto, las flechas no deben pasar/conectar empresas del feed
  useEffect(() => {
    document.body.dataset.lightbox = '1';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { delete document.body.dataset.lightbox; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const chip = (selected) => ({
    fontSize: 13, fontWeight: 500, lineHeight: 1.2, fontFamily: APPLE_FONT,
    background: selected ? ACCENT : c.chip,
    color: selected ? '#FFFFFF' : c.chipText,
    border: `1px solid ${selected ? ACCENT : c.chipBorder}`,
    boxShadow: selected ? '0 4px 12px rgba(69,91,232,0.30)' : 'none',
  });

  const toggleIn = (key, opt) =>
    upd(key, local[key].includes(opt) ? local[key].filter(v => v !== opt) : [...local[key], opt]);

  const groups = [
    { key: 'segments', title: 'Segmentos clave', options: SEGMENT_OPTIONS },
    { key: 'offering', title: 'Qué ofrezco',     options: OFFERING_OPTIONS },
    { key: 'seeking',  title: 'Qué busco',       options: SEEKING_OPTIONS },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(8,12,24,0.40)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
        onClick={onClose} />

      <motion.aside
        initial={{ x: '108%' }} animate={{ x: 0 }} exit={{ x: '108%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320, mass: 0.9 }}
        role="dialog" aria-label="Filtros de búsqueda"
        className="fixed bottom-4 right-4 top-4 z-[70] flex w-[min(480px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px]"
        style={{ background: c.panel, border: `1px solid ${c.border}`, boxShadow: c.shadow, fontFamily: APPLE_FONT }}
        onClick={e => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex shrink-0 items-start justify-between px-7 pb-5 pt-7">
          <div>
            <h2 className="text-[26px] font-bold leading-tight" style={{ color: c.text, letterSpacing: '-0.03em', fontFamily: APPLE_FONT }}>Filtros</h2>
            <p className="mt-1 text-[14px]" style={{ color: c.body }}>
              {activeCount === 0 ? 'Sin filtros activos' : `${activeCount} ${activeCount === 1 ? 'filtro activo' : 'filtros activos'}`}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar filtros"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:opacity-70"
            style={{ background: c.closeBg, color: c.body }}>
            <X size={17} />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="min-h-0 flex-1 overflow-y-auto px-7 [scrollbar-width:none]">
          <FilterSection title="Ubicación" c={c}>
            <input type="text" value={local.location} onChange={e => upd('location', e.target.value)}
              placeholder="Ej: Buenos Aires, Córdoba…"
              className="h-12 w-full rounded-2xl px-4 text-[15px] outline-none transition focus:ring-2"
              style={{ background: c.field, color: c.text, border: `1px solid ${c.divider}`, '--tw-ring-color': 'rgba(69,91,232,0.45)' }} />
          </FilterSection>

          <FilterSection title="Distancia máxima" c={c}
            aside={<span className="rounded-full px-2.5 py-0.5 text-[13px] font-semibold" style={{ background: 'rgba(69,91,232,0.14)', color: dark ? '#9FB0FF' : ACCENT }}>{local.maxDistance} km</span>}>
            <input type="range" min={1} max={200} step={1} value={local.maxDistance}
              onChange={e => upd('maxDistance', Number(e.target.value))} aria-label="Distancia máxima en kilómetros"
              className="w-full" style={{ accentColor: ACCENT }} />
            <div className="mt-1 flex justify-between text-[12px]" style={{ color: c.label }}><span>1 km</span><span>200 km</span></div>
          </FilterSection>

          {groups.map(({ key, title, options }) => (
            <FilterSection key={key} title={title} c={c}
              aside={local[key].length > 0 && <span className="text-[12px] font-medium" style={{ color: dark ? '#9FB0FF' : ACCENT }}>{local[key].length} seleccionados</span>}>
              <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                  <button key={opt} type="button" onClick={() => toggleIn(key, opt)} aria-pressed={local[key].includes(opt)}
                    className="rounded-full px-3.5 py-2 transition" style={chip(local[key].includes(opt))}>{opt}</button>
                ))}
              </div>
            </FilterSection>
          ))}

          <FilterSection title="Seguidores mínimos" c={c}>
            <div className="flex flex-wrap gap-2">
              {FOLLOWERS_OPTIONS.map(opt => (
                <button key={opt.value} type="button" onClick={() => upd('minFollowers', opt.value)} aria-pressed={local.minFollowers === opt.value}
                  className="rounded-full px-3.5 py-2 transition" style={chip(local.minFollowers === opt.value)}>{opt.label}</button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Cantidad de locales" c={c}>
            <div className="grid grid-cols-4 gap-2">
              {LOCALES_OPTIONS.map(opt => (
                <button key={opt.value} type="button" onClick={() => upd('minLocales', opt.value)} aria-pressed={local.minLocales === opt.value}
                  className="rounded-2xl py-2.5 transition" style={{ ...chip(local.minLocales === opt.value), fontWeight: 600 }}>{opt.label}</button>
              ))}
            </div>
          </FilterSection>

          <section className="flex items-center justify-between gap-4 py-6" style={{ borderTop: `1px solid ${c.divider}` }}>
            <div>
              <p className="text-[15px] font-semibold" style={{ color: c.text }}>Tiene página web</p>
              <p className="mt-0.5 text-[13px]" style={{ color: c.body }}>Solo comercios con web propia</p>
            </div>
            <button type="button" role="switch" aria-checked={local.hasWebsite} aria-label="Solo comercios con página web"
              onClick={() => upd('hasWebsite', !local.hasWebsite)}
              className="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200"
              style={{ background: local.hasWebsite ? ACCENT : c.track }}>
              <span className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: local.hasWebsite ? 'translateX(24px)' : 'translateX(4px)' }} />
            </button>
          </section>
        </div>

        {/* Pie fijo */}
        <div className="flex shrink-0 items-center gap-3 px-7 py-5" style={{ borderTop: `1px solid ${c.divider}` }}>
          <button type="button" onClick={() => setLocal(DEFAULT_FILTERS)} disabled={activeCount === 0}
            className="h-12 rounded-2xl px-5 transition hover:opacity-70 disabled:opacity-40"
            style={{ background: 'transparent', color: c.body, fontSize: 14, fontWeight: 600, fontFamily: APPLE_FONT }}>
            Limpiar
          </button>
          <button type="button" onClick={() => { onApply(local); onClose(); }}
            className="h-12 flex-1 rounded-2xl text-white transition hover:brightness-110 active:scale-[0.99]"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #2F43C8)`, boxShadow: '0 10px 24px rgba(69,91,232,0.38)', fontSize: 15, fontWeight: 600, fontFamily: APPLE_FONT }}>
            Aplicar filtros
          </button>
        </div>
      </motion.aside>
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

function SavedGrid({ companies, onView, p = EXPLORE_PALETTE.dark }) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: p.pillBg }}>
          <Star className="h-6 w-6" style={{ color: p.label }} />
        </div>
        <div>
          <p className="text-[14px] font-semibold" style={{ color: p.body }}>Sin guardados todavía</p>
          <p className="mt-1 text-[12px]" style={{ color: p.meta }}>Usá ★ para guardar comercios interesantes</p>
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

/* ── Desktop palette — oscuro (original) y claro (Conectado Flow / Apple) ── */
const EXPLORE_PALETTE = {
  dark: {
    isDark: true,
    bg: 'linear-gradient(160deg, #070C18 0%, #0F1828 55%, #141E30 100%)',
    name: '#FFFFFF', body: 'rgba(255,255,255,0.55)', meta: 'rgba(255,255,255,0.40)', label: 'rgba(255,255,255,0.30)',
    avatarRing: '#0D1424', avatarShadow: '0 10px 28px rgba(0,0,0,0.45)',
    pillBg: 'rgba(255,255,255,0.08)', pillText: 'rgba(255,255,255,0.70)',
    cardBg: 'rgba(255,255,255,0.03)', cardBorder: '1px solid rgba(255,255,255,0.07)', cardShadow: 'none',
    chipBg: 'rgba(255,255,255,0.05)', chipBorder: '1px solid rgba(255,255,255,0.08)', chipText: 'rgba(255,255,255,0.45)',
    offer:   { color: '#4A9FFF', bg: 'rgba(74,159,255,0.10)', border: '1px solid rgba(74,159,255,0.18)' },
    seek:    { color: '#6EE7B7', bg: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.20)' },
    segment: { color: '#D8B4FE', bg: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.20)' },
    accent: '#4A9FFF',
    tabsBg: 'rgba(0,0,0,0.28)', tabsBorder: '1px solid rgba(255,255,255,0.10)',
    tabActiveBg: '#FFFFFF', tabActiveText: '#141E30', tabIdle: 'rgba(255,255,255,0.55)', tabCount: 'rgba(255,255,255,0.35)',
    btnBg: 'rgba(255,255,255,0.07)', btnBorder: '1.5px solid rgba(255,255,255,0.12)', btnText: 'rgba(255,255,255,0.70)',
    floatBg: 'rgba(10,16,30,0.70)', floatBorder: '1px solid rgba(255,255,255,0.10)', floatShadow: '0 20px 50px rgba(0,0,0,0.5)',
    undoBg: 'rgba(255,255,255,0.07)', undoBorder: '1.5px solid rgba(255,255,255,0.14)', undoIcon: 'rgba(255,255,255,0.45)',
    toastBg: 'rgba(255,255,255,0.10)', toastBorder: '1px solid rgba(255,255,255,0.15)', toastText: 'rgba(255,255,255,0.90)',
    empty: 'rgba(255,255,255,0.20)',
    divider: 'rgba(255,255,255,0.09)',
  },
  light: {
    isDark: false,
    bg: '#F5F6FA',
    name: '#1D1D1F', body: '#515257', meta: '#86868B', label: '#86868B',
    avatarRing: '#FFFFFF', avatarShadow: '0 8px 24px rgba(15,23,42,0.14)',
    pillBg: 'rgba(15,23,42,0.06)', pillText: '#515257',
    cardBg: '#FFFFFF', cardBorder: '1px solid rgba(15,23,42,0.07)', cardShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.05)',
    chipBg: '#F5F6FA', chipBorder: '1px solid rgba(15,23,42,0.07)', chipText: '#515257',
    offer:   { color: '#3446C9', bg: 'rgba(69,91,232,0.09)', border: '1px solid rgba(69,91,232,0.16)' },
    seek:    { color: '#16794A', bg: 'rgba(34,160,98,0.10)', border: '1px solid rgba(34,160,98,0.20)' },
    segment: { color: '#7A3FC2', bg: 'rgba(139,92,246,0.09)', border: '1px solid rgba(139,92,246,0.18)' },
    accent: '#455BE8',
    tabsBg: 'rgba(15,23,42,0.06)', tabsBorder: '1px solid transparent',
    tabActiveBg: '#FFFFFF', tabActiveText: '#1D1D1F', tabIdle: '#515257', tabCount: '#86868B',
    btnBg: '#FFFFFF', btnBorder: '1px solid rgba(15,23,42,0.09)', btnText: '#1D1D1F',
    floatBg: 'rgba(255,255,255,0.82)', floatBorder: '1px solid rgba(15,23,42,0.08)', floatShadow: '0 20px 50px rgba(15,23,42,0.16)',
    undoBg: '#F5F6FA', undoBorder: '1px solid rgba(15,23,42,0.09)', undoIcon: '#86868B',
    toastBg: 'rgba(29,29,31,0.88)', toastBorder: '1px solid rgba(255,255,255,0.08)', toastText: '#FFFFFF',
    empty: '#A1A1A6',
    divider: 'rgba(15,23,42,0.09)',
  },
};

/* ── Desktop: ficha de empresa — galería (mosaico) + panel de datos con acciones propias ───── */
const COMMON_CONNECTIONS = ['Bloom Florería', 'Sushi Nakama'];

// Tipografía del sistema Apple (SF Pro en dispositivos Apple, Inter como respaldo en el resto)
const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', system-ui, sans-serif";

/* Visor de fotos a pantalla completa (Esc cierra, ← → navegan) */
function Lightbox({ photos, index, name, onClose, onChange }) {
  useEffect(() => {
    document.body.dataset.lightbox = '1';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      delete document.body.dataset.lightbox;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, photos.length, onClose, onChange]);

  const nav = 'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:bg-white/25';
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md" onClick={onClose} role="dialog" aria-label={`Fotos de ${name}`}>
      <img src={photos[index]} alt={`${name} ${index + 1}`} onClick={(e) => e.stopPropagation()}
        className="max-h-[86vh] max-w-[88vw] rounded-[20px] object-contain shadow-2xl" />
      <button type="button" aria-label="Cerrar" onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
        <X size={18} />
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="Anterior" className={`${nav} left-5 bg-white/15`}
            onClick={(e) => { e.stopPropagation(); onChange((index - 1 + photos.length) % photos.length); }}>
            <ArrowLeft size={20} />
          </button>
          <button type="button" aria-label="Siguiente" className={`${nav} right-5 bg-white/15`}
            onClick={(e) => { e.stopPropagation(); onChange((index + 1) % photos.length); }}>
            <ArrowRight size={20} />
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white">
            {index + 1} / {photos.length}
          </span>
        </>
      )}
    </div>,
    document.body
  );
}

/* ── Reseñas de alianzas (datos de ejemplo: se generan de forma estable a partir de cada empresa) ───── */
const REVIEWER_POOL = [
  { name: 'Bloom Florería', sector: 'Floreria' },
  { name: 'Luna Beauty',    sector: 'Belleza' },
  { name: 'Sushi Nakama',   sector: 'Gastronomia' },
  { name: 'Fit Studio',     sector: 'Gimnasio' },
  { name: 'Core Wellness',  sector: 'Bienestar' },
  { name: 'Digital Craft',  sector: 'Tecnologia' },
  { name: 'Verde Market',   sector: 'Moda' },
  { name: 'Aether Studio',  sector: 'Marketing Digital' },
  { name: 'Nomad Co.',      sector: 'Indumentaria' },
  { name: 'Café Patio',     sector: 'Cafeteria' },
];
const REVIEW_TEXTS = [
  { text: 'Armamos un cupón cruzado y en dos semanas duplicamos el tráfico al local. Muy profesionales.', type: 'Cupón cruzado' },
  { text: 'Respondieron rápido y cumplieron todo lo acordado. Volveríamos a hacer una alianza.', type: 'Co-marketing' },
  { text: 'El evento conjunto trajo clientes nuevos para las dos marcas. Excelente comunicación.', type: 'Evento conjunto' },
  { text: 'Buena coordinación y comunicación clara. La campaña salió mejor de lo esperado.', type: 'Campaña conjunta' },
  { text: 'Cumplen los plazos y cuidan la imagen de la marca. Totalmente recomendables.', type: 'Co-branding' },
  { text: 'Una alianza simple y con resultados desde el primer mes.', type: 'Cross-selling' },
  { text: 'Muy buena onda y ganas de hacer cosas distintas. Nos presentaron clientes nuevos.', type: 'Networking' },
  { text: 'Tuvimos que ajustar algunos tiempos, pero el resultado final valió la pena.', type: 'Campaña conjunta' },
];
const REVIEW_DATES = ['Hace 2 semanas', 'Hace 1 mes', 'Hace 1 mes', 'Hace 2 meses', 'Hace 3 meses', 'Hace 3 meses', 'Hace 4 meses', 'Hace 5 meses'];
const REVIEW_RATINGS = [5, 5, 4.5, 5, 4, 5, 4.5, 5];

const normalizeName = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const hashString = (s = '') => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);

function getAllianceReviews(company) {
  const seed = hashString(company.id || company.name);
  const pool = REVIEWER_POOL.filter(r => normalizeName(r.name) !== normalizeName(company.name));
  const items = Array.from({ length: 8 }, (_, i) => {
    const reviewer = pool[(seed + i) % pool.length];
    const t = REVIEW_TEXTS[(seed + i * 3) % REVIEW_TEXTS.length];
    return { id: `${seed}-${i}`, reviewer, text: t.text, type: t.type, rating: REVIEW_RATINGS[(seed + i) % REVIEW_RATINGS.length], date: REVIEW_DATES[i] };
  });
  const average = Math.round((items.reduce((sum, r) => sum + r.rating, 0) / items.length) * 10) / 10;
  return { items, average, total: 14 + (seed % 90) };
}

function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} strokeWidth={1.6} style={{ color: '#F5B301', opacity: 0.35 }} />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} fill="#F5B301" strokeWidth={1.6} style={{ color: '#F5B301' }} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function ReviewerAvatar({ reviewer, size = 44 }) {
  const initials = reviewer.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <span className="flex shrink-0 items-center justify-center text-white"
      style={{
        width: size, height: size, borderRadius: size * 0.32, fontWeight: 700, fontSize: size * 0.34,
        background: sectorBg[reviewer.sector] || 'linear-gradient(135deg, #455BE8, #2F43C8)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
      }}>
      {initials}
    </span>
  );
}

function ReviewCard({ review, p, compact = false, dense = false }) {
  const bg = p.isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF';
  const border = p.isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.06)';

  if (dense) {
    return (
      <article className="min-w-0 rounded-[16px] p-3" style={{ background: bg, border }}>
        <div className="flex items-center gap-2.5">
          <ReviewerAvatar reviewer={review.reviewer} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight" style={{ color: p.name }}>{review.reviewer.name}</p>
            <div className="mt-0.5"><Stars value={review.rating} size={12} /></div>
          </div>
          <span className="shrink-0 self-start text-[11px]" style={{ color: p.label }}>{review.date}</span>
        </div>
        <p className="mt-1.5 line-clamp-1 text-[12.5px] leading-[1.4]" style={{ color: p.body }}>“{review.text}”</p>
      </article>
    );
  }

  return (
    <article className="min-w-0 rounded-[18px] p-4" style={{ background: bg, border }}>
      <div className="flex items-center gap-3">
        <ReviewerAvatar reviewer={review.reviewer} size={compact ? 40 : 44} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-tight" style={{ color: p.name }}>{review.reviewer.name}</p>
          <div className="mt-1"><Stars value={review.rating} size={13} /></div>
        </div>
      </div>
      <p className={`mt-3 text-[13px] leading-[1.5] ${compact ? 'line-clamp-2' : ''}`} style={{ color: p.body }}>“{review.text}”</p>
      <p className="mt-2 text-[12px]" style={{ color: p.label }}>{review.date} · Alianza: {review.type}</p>
    </article>
  );
}

/* Diálogo con todas las reseñas */
function ReviewsDialog({ company, reviews, p, onClose }) {
  useEffect(() => {
    document.body.dataset.lightbox = '1';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { delete document.body.dataset.lightbox; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-label={`Reseñas de alianzas de ${company.name}`} onClick={e => e.stopPropagation()}
        className="flex max-h-[82vh] w-full max-w-[680px] flex-col overflow-hidden rounded-[28px]"
        style={{
          background: p.isDark ? 'linear-gradient(180deg, #151C30 0%, #0C1122 100%)' : '#FFFFFF',
          border: p.isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(15,23,42,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)', fontFamily: APPLE_FONT,
        }}>
        <div className="flex items-start justify-between gap-4 px-7 pb-4 pt-7">
          <div>
            <h3 className="text-[24px] font-bold leading-tight" style={{ color: p.name, letterSpacing: '-0.03em', fontFamily: APPLE_FONT }}>Reseñas de alianzas</h3>
            <p className="mt-1 text-[14px]" style={{ color: p.body }}>Opiniones de empresas que se aliaron con {company.name}</p>
            <div className="mt-3 flex items-center gap-2.5">
              <span className="text-[28px] font-bold leading-none" style={{ color: p.name, letterSpacing: '-0.02em' }}>{reviews.average.toFixed(1)}</span>
              <Stars value={reviews.average} size={17} />
              <span className="text-[13px]" style={{ color: p.meta }}>({reviews.total} reseñas)</span>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar reseñas"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:opacity-70"
            style={{ background: p.pillBg, color: p.body }}>
            <X size={17} />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-7 pb-7 [scrollbar-width:none]">
          {reviews.items.map(r => <ReviewCard key={r.id} review={r} p={p} />)}
          <p className="pt-1 text-center text-[12px]" style={{ color: p.label }}>
            Mostrando las {reviews.items.length} más recientes de {reviews.total}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* Galería: foto principal (se desliza o se pasa con flechas) + miniaturas que la controlan */
function ProfileGallery({ photos, company, heroBg, onOpen, p, compact = false }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const initials = (company.logo || company.name.slice(0, 2)).toString().slice(0, 3).toUpperCase();

  const goTo = (i) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };
  const handleScroll = () => {
    const el = ref.current;
    if (el?.clientWidth) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const showThumbs = count > 1;
  const maxThumbs = 4;
  const thumbs = count > maxThumbs + 1 ? photos.slice(0, maxThumbs) : photos;
  const extra = count - thumbs.length;
  const arrow = 'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#1D1D1F] opacity-0 shadow-lg transition group-hover:opacity-100 hover:scale-105 focus-visible:opacity-100';

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div className="group relative min-h-0 flex-1 overflow-hidden rounded-[22px]" style={{ background: heroBg }}>
        {count > 0 ? (
          <div ref={ref} onScroll={handleScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]">
            {photos.map((src, i) => (
              <button key={src} type="button" onClick={() => onOpen(i)} aria-label={`Ver foto ${i + 1} de ${count}`}
                className="relative h-full w-full shrink-0 cursor-zoom-in snap-center snap-always">
                <img src={src} alt={`${company.name} ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} draggable={false}
                  className="absolute inset-0 h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[96px] font-black text-white/30">{initials}</span>
        )}

        {/* Identidad de la empresa sobre la foto */}
        <div className="pointer-events-none absolute bottom-4 left-4 flex h-[72px] w-[72px] items-center justify-center rounded-full text-white"
          style={{ background: heroBg, border: '4px solid rgba(255,255,255,0.92)', boxShadow: '0 10px 26px rgba(0,0,0,0.30)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
          {initials}
        </div>

        {count > 1 && (
          <>
            <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-[12px] font-semibold tabular-nums text-white"
              style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
              {index + 1}/{count}
            </span>
            {index > 0 && (
              <button type="button" aria-label="Foto anterior" onClick={() => goTo(index - 1)}
                className={`${arrow} left-4`} style={{ background: 'rgba(255,255,255,0.92)' }}>
                <ChevronLeft size={20} />
              </button>
            )}
            {index < count - 1 && (
              <button type="button" aria-label="Foto siguiente" onClick={() => goTo(index + 1)}
                className={`${arrow} right-4`} style={{ background: 'rgba(255,255,255,0.92)' }}>
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
      </div>

      {showThumbs && (
        <div className="grid shrink-0 gap-2.5" style={{ gridTemplateColumns: `repeat(${thumbs.length + (extra > 0 ? 1 : 0)}, minmax(0, 1fr))` }}>
          {thumbs.map((src, i) => (
            <button key={src} type="button" onClick={() => goTo(i)} aria-label={`Ir a la foto ${i + 1}`} aria-current={i === index}
              className="relative overflow-hidden rounded-[14px] transition"
              style={{ height: compact ? 52 : 68, outline: i === index ? '2px solid #455BE8' : '2px solid transparent', outlineOffset: 2, opacity: i === index ? 1 : 0.85 }}>
              <img src={src} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
            </button>
          ))}
          {extra > 0 && (
            <button type="button" onClick={() => onOpen(thumbs.length)} aria-label={`Ver ${extra} fotos más`}
              className="flex items-center justify-center rounded-[14px] transition hover:opacity-85"
              style={{ height: compact ? 52 : 68, background: p.isDark ? 'rgba(255,255,255,0.10)' : '#1D1D1F', color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>
              +{extra}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Pantallas de poca altura (notebooks): el perfil pasa a un modo compacto para seguir entrando sin scroll */
function useCompactHeight(max = 830) {
  const query = `(max-height: ${max}px)`;
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const fn = () => setCompact(m.matches);
    fn();
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, [query]);
  return compact;
}

function ExploreProfileCard({ company, p, actions, saved }) {
  const [lightbox, setLightbox] = useState(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const reviews = useMemo(() => (company ? getAllianceReviews(company) : null), [company]);
  const compact = useCompactHeight();
  const tight = useCompactHeight(760); // notebooks muy bajos: se afina un poco más

  if (!company) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: p.empty }}>Seleccioná una empresa para ver el detalle</p>
      </div>
    );
  }

  const dark      = p.isDark;
  const offerTags = parseTags(company.offer || '');
  const seekTags  = parseTags(company.seeking || '');
  const segments  = company.segments || [];
  const heroBg    = industryBg[company.sector] || 'linear-gradient(135deg, #1871D8 0%, #0A3D7A 100%)';
  const followers = company.instagramData?.followers ?? null;
  const about     = company.description || company.culture || company.headline;
  const photos    = [...new Set([
    company.gallery?.[0],
    ...(company.instagramData?.feed || []),
    ...(company.gallery?.slice(1) || []),
  ].filter(Boolean))].slice(0, 8);

  // La sinergia no se muestra en el perfil de la web (se decidió mantenerlo limpio)
  const metrics = [
    company.distance != null && { icon: MapPin, value: `${company.distance} km`, label: 'Distancia' },
    followers != null && { icon: Users, value: followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : String(followers), label: 'Seguidores' },
    company.size && { icon: UsersRound, value: String(company.size).replace(' personas', ''), label: 'Equipo' },
  ].filter(Boolean);

  const peach = dark
    ? { color: '#FDBA74', bg: 'rgba(251,146,60,0.14)', border: '1px solid rgba(251,146,60,0.28)' }
    : { color: '#B45309', bg: 'rgba(251,146,60,0.14)', border: '1px solid rgba(251,146,60,0.30)' };
  const infoBlocks = [
    { title: 'Qué ofrece', icon: Store,  tags: offerTags, tone: p.offer },
    { title: 'Qué busca',  icon: Search, tags: seekTags,  tone: p.seek },
    { title: 'Segmentos',  icon: Tag,    tags: segments,  tone: peach },
  ].filter(b => b.tags.length > 0);

  // Acciones en cuadrados redondeados, siempre visibles arriba a la derecha (el tamaño de letra va en línea por la regla global de "button")
  const tones = dark
    ? {
        pass:  { color: '#E5484D', background: '#FFFFFF', border: '1px solid transparent' },
        save:  { color: '#D97706', background: '#FFFFFF', border: '1px solid transparent' },
        saved: { color: '#B45309', background: '#FEF3C7', border: '1px solid #F59E0B' },
        share: { color: '#0284C7', background: '#FFFFFF', border: '1px solid transparent' },
      }
    : {
        pass:  { color: '#E5484D', background: 'rgba(229,72,77,0.10)',  border: '1px solid rgba(229,72,77,0.26)' },
        save:  { color: '#D97706', background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.10)' },
        saved: { color: '#B45309', background: 'rgba(245,158,11,0.20)', border: '1px solid rgba(245,158,11,0.50)' },
        share: { color: '#0284C7', background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.10)' },
      };
  const sq = compact ? 44 : 52;
  const square = 'flex shrink-0 items-center justify-center rounded-[16px] transition hover:-translate-y-0.5 active:scale-95';
  const tileBg = dark ? 'rgba(255,255,255,0.05)' : '#F5F6FA';
  const stripBg = dark ? 'rgba(255,255,255,0.04)' : '#F5F6FA';

  return (
    <div className="mx-auto h-full max-w-[1320px] px-8" style={{ fontFamily: APPLE_FONT }}>
      <div className={`flex h-full flex-col rounded-[28px] ${compact ? 'gap-2.5 p-3' : 'gap-4 p-5'}`}
        style={{ background: p.cardBg, border: p.cardBorder, boxShadow: p.cardShadow }}>

        <div className={`grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] ${compact ? 'gap-5' : 'gap-8'}`}>
          {/* ── Galería ── */}
          <ProfileGallery photos={photos} company={company} heroBg={heroBg} p={p} onOpen={setLightbox} compact={compact} />

          {/* ── Perfil comercial ── */}
          <div className="min-h-0 overflow-y-auto pr-1 [scrollbar-width:none]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: p.meta }}>
                  {[company.sector, company.location].filter(Boolean).join(' · ')}
                </p>
                <div className={`flex items-center gap-2.5 ${compact ? 'mt-1' : 'mt-2'}`}>
                  <h2 className="truncate font-bold leading-[1.05] tracking-[-0.03em]" style={{ color: p.name, fontFamily: APPLE_FONT, fontSize: compact ? 30 : 38 }}>{company.name}</h2>
                  <BadgeCheck size={24} className="shrink-0 text-emerald-500" aria-label="Empresa verificada" />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <button type="button" onClick={actions.onPass} className={square} style={{ ...tones.pass, width: sq, height: sq }} aria-label="Pasar" title="Pasar (←)">
                  <X size={22} strokeWidth={2.4} />
                </button>
                <button type="button" onClick={actions.onSave} className={square} style={{ ...(saved ? tones.saved : tones.save), width: sq, height: sq }}
                  aria-label={saved ? 'Guardada' : 'Guardar'} title="Guardar (S)">
                  <Bookmark size={21} fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button type="button" onClick={actions.onShare} className={square} style={{ ...tones.share, width: sq, height: sq }} aria-label="Compartir" title="Compartir">
                  <Share2 size={20} />
                </button>
                <button type="button" onClick={actions.onLike} title="Conectar (→)"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-[16px] px-5 text-white transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                  style={{ height: sq, background: 'linear-gradient(135deg, #455BE8, #2F43C8)', boxShadow: '0 10px 22px rgba(69,91,232,0.38)', fontSize: 15, fontWeight: 600, fontFamily: APPLE_FONT }}>
                  <Heart size={20} strokeWidth={2.2} /> Conectar
                </button>
              </div>
            </div>

            {about && (
              <p className={`leading-[1.55] ${compact ? 'mt-3 line-clamp-2 text-[15px]' : 'mt-4 line-clamp-3 text-[16px]'}`} style={{ color: p.body }}>{about}</p>
            )}

            {metrics.length > 0 && (
              compact ? (
                <div className={`flex items-center gap-6 ${tight ? 'mt-2' : 'mt-3'}`}>
                  {metrics.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex items-center gap-1.5" title={label}>
                      <Icon size={16} strokeWidth={1.9} style={{ color: p.meta }} />
                      <span className="text-[15px] font-semibold leading-none tracking-[-0.01em]" style={{ color: p.name }}>{value}</span>
                      <span className="text-[12px]" style={{ color: p.meta }}>{label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}>
                  {metrics.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex flex-col items-center rounded-[16px] px-3 py-2.5" style={{ background: tileBg }}>
                      <div className="flex items-center gap-2" style={{ color: p.name }}>
                        <Icon size={19} strokeWidth={1.9} style={{ color: p.meta }} />
                        <span className="text-[21px] font-semibold leading-none tracking-[-0.02em]">{value}</span>
                      </div>
                      <span className="mt-1.5 text-[12px]" style={{ color: p.meta }}>{label}</span>
                    </div>
                  ))}
                </div>
              )
            )}

            {infoBlocks.length > 0 && (
              <div className={`grid border-y ${compact ? (tight ? 'mt-2.5 py-2.5' : 'mt-3 py-3') : 'mt-4 py-4'}`} style={{ borderColor: p.divider, gridTemplateColumns: `repeat(${infoBlocks.length}, minmax(0, 1fr))` }}>
                {infoBlocks.map(({ title, icon: Icon, tags, tone }, i) => (
                  <div key={title} className="min-w-0 px-4 first:pl-0 last:pr-0" style={i > 0 ? { borderLeft: `1px solid ${p.divider}` } : undefined}>
                    <p className={`flex items-center gap-2 font-semibold ${compact ? 'mb-2 text-[14px]' : 'mb-3 text-[15px]'}`} style={{ color: p.name }}>
                      <Icon size={18} strokeWidth={1.9} style={{ color: p.meta }} /> {title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, compact ? 3 : tags.length).map(tag => (
                        <span key={tag} className={`rounded-full font-medium ${compact ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[13px]'}`}
                          style={{ color: tone.color, background: tone.bg, border: tone.border }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={`flex items-center justify-between gap-4 ${compact ? (tight ? 'mt-2.5 pb-0' : 'mt-3 pb-1') : 'mt-4 pb-1'}`}>
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex shrink-0 items-center">
                  {COMMON_CONNECTIONS.map((c, i) => (
                    <span key={c} className="flex items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{ width: compact ? 34 : 40, height: compact ? 34 : 40, marginLeft: i ? -10 : 0, background: 'linear-gradient(135deg, #455BE8, #2F43C8)', border: `2px solid ${dark ? '#151C30' : '#FFFFFF'}` }}>
                      {c.slice(0, 1)}
                    </span>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-tight" style={{ color: p.name }}>{COMMON_CONNECTIONS.length} conexiones en común</p>
                  {!tight && <p className="mt-0.5 truncate text-[13px]" style={{ color: p.meta }}>{COMMON_CONNECTIONS.join(' · ')}</p>}
                </div>
              </div>
              <button type="button" onClick={actions.onViewProfile}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-4 transition hover:opacity-70"
                style={{ height: compact ? 36 : 40, background: p.btnBg, border: p.btnBorder, color: p.btnText, fontSize: 13, fontWeight: 600, fontFamily: APPLE_FONT }}>
                Perfil completo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Reseñas de alianzas ── */}
        <section className={`shrink-0 rounded-[20px] ${compact ? 'p-3' : 'p-4'}`} style={{ background: stripBg }} aria-label="Reseñas de alianzas">
          <div className={`flex items-center justify-between gap-4 ${compact ? 'mb-2' : 'mb-3'}`}>
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-[18px] font-semibold leading-none tracking-[-0.02em]" style={{ color: p.name, fontFamily: APPLE_FONT }}>Reseñas de alianzas</h3>
              <div className="flex items-center gap-2">
                <Stars value={reviews.average} size={15} />
                <span className="text-[15px] font-semibold" style={{ color: p.name }}>{reviews.average.toFixed(1)}</span>
                <span className="text-[13px]" style={{ color: p.meta }}>({reviews.total} reseñas)</span>
              </div>
              <span className="hidden text-[13px] min-[1500px]:inline" style={{ color: p.meta }}>· De empresas que se aliaron con {company.name}</span>
            </div>
            <button type="button" onClick={() => setReviewsOpen(true)}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 transition hover:opacity-70"
              style={{ background: p.btnBg, border: p.btnBorder, color: p.btnText, fontSize: 13, fontWeight: 600, fontFamily: APPLE_FONT }}>
              Ver todas las reseñas <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {reviews.items.slice(0, 3).map(r => <ReviewCard key={r.id} review={r} p={p} compact dense={compact} />)}
          </div>
        </section>
      </div>

      {lightbox !== null && (
        <Lightbox photos={photos} index={lightbox} name={company.name} onClose={() => setLightbox(null)} onChange={setLightbox} />
      )}
      {reviewsOpen && (
        <ReviewsDialog company={company} reviews={reviews} p={p} onClose={() => setReviewsOpen(false)} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEED — una empresa por pantalla, el scroll "encaja" en cada una
══════════════════════════════════════════════════════════════ */
const EXIT_MS = 280;
// Espacio que deja libre el nav flotante de la app móvil (alto de la isla + margen + aire)
const MOBILE_NAV_CLEARANCE = 'calc(env(safe-area-inset-bottom, 0px) + 96px)';

function EndOfFeed({ dark, p, onOpenFilters }) {
  return (
    <div className="flex h-full items-center justify-center px-8 text-center">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: dark ? '#4A9FFF' : p.accent }}>
          Llegaste al final
        </p>
        <h3 className="mt-3 font-['Space_Grotesk'] text-[22px] font-bold tracking-tight" style={{ color: dark ? 'rgba(255,255,255,0.9)' : p.name }}>
          No hay más empresas por evaluar
        </h3>
        <p className="mt-2 text-[13px]" style={{ color: dark ? 'rgba(255,255,255,0.45)' : p.meta }}>
          Volvé más tarde o ajustá tus filtros
        </p>
        <button type="button" onClick={onOpenFilters}
          className="mt-5 rounded-full px-5 py-2.5 text-[13px] font-semibold transition hover:opacity-80"
          style={{ background: dark ? 'rgba(255,255,255,0.10)' : p.btnBg, color: dark ? 'rgba(255,255,255,0.75)' : p.btnText, border: dark ? 'none' : p.btnBorder }}>
          Ajustar filtros
        </button>
      </div>
    </div>
  );
}

/* Riel de puntos en el borde derecho: muestra dónde estás dentro del feed */
function FeedRail({ count, index, color, activeColor }) {
  if (count < 2) return null;
  const visible = Math.min(count, 7);
  const active = Math.min(index, visible - 1);
  return (
    <div className="pointer-events-none absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: visible }).map((_, i) => (
        <span key={i} className="block w-1 rounded-full transition-all duration-200"
          style={{ height: i === active ? 18 : 5, background: i === active ? activeColor : color }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SWIPE BOARD — main component (ahora es un feed vertical con scroll)
══════════════════════════════════════════════════════════════ */
function SwipeBoard({ companies, dailyMatchCount, onMatch, onOpenPricing, userPlan, myCompany }) {
  const { theme } = useTheme();
  const p = EXPLORE_PALETTE[theme] ?? EXPLORE_PALETTE.dark;
  const shortScreen = useCompactHeight();
  const baseDeck = useMemo(
    () => companies
      .map(c => ({ ...c, score: calculateMatchScore(c) }))
      .filter(c => shouldRevealCompany(c.score)),
    [companies]
  );

  /* ── Feed state ──
     decided: historial de empresas resueltas (conectar / pasar), sirve para deshacer.
     leaving: empresa que está saliendo con animación antes de quitarse del feed. */
  const [decided,        setDecided]        = useState([]);
  const [leaving,        setLeaving]        = useState(null);
  const [restoreId,      setRestoreId]      = useState(null);
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [flashMessage,   setFlashMessage]   = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);
  const feedRef = useRef(null);

  /* ── UI state ── */
  const [matchedCompany, setMatchedCompany] = useState(null);
  const [activeTab,   setActiveTab]   = useState('paraTi');
  const [showFilters, setShowFilters] = useState(false);
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);
  const [savedIds,    setSavedIds]    = useState(() => new Set());
  const [isDesktop,   setIsDesktop]   = useState(() => window.innerWidth >= 1024);

  const decidedIds = useMemo(() => new Set(decided.map(d => d.id)), [decided]);
  const deck = useMemo(() => baseDeck.filter(c => !decidedIds.has(c.id)), [baseDeck, decidedIds]);
  const activeCompany = deck[Math.min(activeIndex, deck.length - 1)] ?? null;
  const matchLimitReached = userPlan === 'starter' && dailyMatchCount >= 10;

  const savedCompanies = useMemo(() => baseDeck.filter(c => savedIds.has(c.id)), [baseDeck, savedIds]);

  /* ── Resize listener ── */
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  /* ── Flash toast (con "Deshacer" opcional) ── */
  const showFlash = (text, { undo = false } = {}) => {
    setFlashMessage({ text, undo });
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlashMessage(null), undo ? 5000 : 1300);
  };

  /* ── Scroll del feed ── */
  const handleScroll = () => {
    const el = feedRef.current;
    if (!el || !el.clientHeight) return;
    setActiveIndex(Math.round(el.scrollTop / el.clientHeight));
  };

  const scrollPage = (dir) => {
    const el = feedRef.current;
    if (el) el.scrollBy({ top: dir * el.clientHeight, behavior: 'smooth' });
  };

  // Al deshacer, volvemos a la empresa restaurada
  useEffect(() => {
    if (!restoreId) return;
    const idx = deck.findIndex(c => c.id === restoreId);
    const el = feedRef.current;
    if (idx >= 0 && el) {
      el.scrollTo({ top: idx * el.clientHeight, behavior: 'auto' });
      setActiveIndex(idx);
    }
    setRestoreId(null);
  }, [restoreId, deck]);

  /* ── Acciones ── */
  const resolveCompany = (company, type) => {
    setLeaving({ id: company.id, type });
    window.setTimeout(() => {
      setDecided(curr => [...curr, { id: company.id, type }]);
      setLeaving(null);
    }, EXIT_MS);
  };

  const handlePass = () => {
    if (!activeCompany || leaving) return;
    showFlash('Empresa descartada', { undo: true });
    resolveCompany(activeCompany, 'pass');
  };

  const handleLike = () => {
    if (!activeCompany || leaving) return;
    if (matchLimitReached) { showFlash('Límite diario alcanzado'); return; }
    if (willCreateMatch(activeCompany, activeCompany.score)) {
      onMatch?.(activeCompany);
      setMatchedCompany(activeCompany);
    } else {
      showFlash('Like enviado');
    }
    resolveCompany(activeCompany, 'like');
  };

  const handleUndo = () => {
    if (decided.length === 0 || leaving) return;
    const last = decided[decided.length - 1];
    setDecided(curr => curr.slice(0, -1));
    setRestoreId(last.id);
    showFlash('Deshecho');
  };

  const handleSave = () => {
    if (!activeCompany) return;
    setSavedIds(prev => new Set([...prev, activeCompany.id]));
    showFlash(`${activeCompany.name} guardada ★`);
  };

  const handleShare = () => {
    if (!activeCompany) return;
    const shareData = {
      title: activeCompany.name,
      text: `Mirá ${activeCompany.name} en Conectados`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(() => showFlash('Enlace copiado')).catch(() => {});
    } else {
      showFlash('Compartido');
    }
  };

  const handleViewProfile = () => {
    if (!activeCompany) return;
    setViewingCompany({ ...activeCompany });
  };

  /* ── Teclado (escritorio): ← pasar · → conectar · ↑/↓ navegar · S guardar ── */
  const actionsRef = useRef({});
  useEffect(() => {
    actionsRef.current = { handlePass, handleLike, handleSave, scrollPage };
  });

  useEffect(() => {
    if (!isDesktop) return;
    const fn = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)) return;
      if (document.body.dataset.lightbox) return; // el visor de fotos usa las flechas
      const a = actionsRef.current;
      if (e.key === 'ArrowLeft')  a.handlePass();
      if (e.key === 'ArrowRight') a.handleLike();
      if (e.key === 'ArrowDown') { e.preventDefault(); a.scrollPage(1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); a.scrollPage(-1); }
      if (e.key === 's' || e.key === 'S') a.handleSave();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isDesktop]);

  /* ── Feed compartido: cada empresa es una "página" que ocupa todo el alto ── */
  const renderFeed = (renderPage, endProps) => (
    <div
      ref={feedRef}
      onScroll={handleScroll}
      className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]"
    >
      {deck.map((company) => {
        const isLeaving = leaving?.id === company.id;
        const dx = leaving?.type === 'like' ? 56 : -56;
        return (
          <section key={company.id} className="h-full snap-start snap-always">
            <div
              className="h-full"
              style={{
                transition: `opacity ${EXIT_MS}ms ease-out, transform ${EXIT_MS}ms ease-out`,
                opacity: isLeaving ? 0 : 1,
                transform: isLeaving ? `translateX(${dx}px) scale(0.98)` : 'none',
              }}
            >
              {renderPage(company)}
            </div>
          </section>
        );
      })}
      <section className="h-full snap-start">
        <EndOfFeed {...endProps} onOpenFilters={() => setShowFilters(true)} />
      </section>
    </div>
  );

  const BG = 'linear-gradient(160deg, #070C18 0%, #0F1828 55%, #141E30 100%)';

  const toast = (cls, style) => (
    <AnimatePresence>
      {flashMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className={`absolute z-[60] flex items-center gap-3 text-[13px] font-semibold ${cls} ${flashMessage.undo ? '' : 'pointer-events-none'}`}
          style={style}>
          <span>{flashMessage.text}</span>
          {flashMessage.undo && (
            <button type="button" onClick={handleUndo} className="rounded-full bg-white/20 px-2.5 py-0.5 text-[12px] font-bold text-white transition hover:bg-white/30">
              Deshacer
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ════════════════════════════════════════════════════════════
     DESKTOP LAYOUT
  ════════════════════════════════════════════════════════════ */
  if (isDesktop) {
    const actions = {
      onPass: handlePass, onLike: handleLike, onSave: handleSave,
      onShare: handleShare, onUndo: handleUndo, canUndo: decided.length > 0, onViewProfile: handleViewProfile,
    };
    const atStart = activeIndex <= 0;
    const atEnd = activeIndex >= deck.length;

    return (
      <>
        <div className="relative flex flex-col h-full" style={{ background: p.bg, fontFamily: APPLE_FONT }}>

          {/* ── Barra superior: alineada al ancho del contenido ── */}
          <div className={`mx-auto flex w-full max-w-[1320px] shrink-0 items-center justify-between px-8 ${shortScreen ? 'pb-2 pt-1' : 'pb-3 pt-4'}`}>
            <div className="flex items-center rounded-full p-1"
              style={{ background: p.tabsBg, border: p.tabsBorder }}>
              {[{ id: 'paraTi', label: 'Para ti' }, { id: 'guardados', label: 'Guardados' }].map(tab => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
                  style={activeTab === tab.id
                    ? { background: p.tabActiveBg, color: p.tabActiveText, boxShadow: '0 1px 3px rgba(15,23,42,0.12)' }
                    : { color: p.tabIdle }}>
                  {tab.label}
                  {tab.id === 'guardados' && savedIds.size > 0 && (
                    <span className="ml-1 text-[11px]" style={{ color: activeTab === tab.id ? p.tabActiveText : p.tabCount, opacity: 0.7 }}>({savedIds.size})</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'paraTi' && decided.length > 0 && (
                <button type="button" onClick={handleUndo}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:opacity-70"
                  style={{ color: p.accent, fontSize: 12, fontWeight: 600 }}>
                  <RotateCcw size={13} /> Deshacer
                </button>
              )}
              {activeTab === 'paraTi' && deck.length > 0 && (
                <span className="text-[12px] font-medium tabular-nums" style={{ color: p.meta }}>
                  {Math.min(activeIndex + 1, deck.length)} de {deck.length}
                </span>
              )}
              <motion.button type="button" onClick={() => setShowFilters(true)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{ background: p.btnBg, border: p.btnBorder }}>
                <SlidersHorizontal size={15} style={{ color: p.btnText }} />
                <span className="text-[13px] font-semibold" style={{ color: p.btnText }}>Filtros</span>
              </motion.button>
            </div>
          </div>

          {/* ── Contenido ── */}
          {activeTab === 'guardados' ? (
            <SavedGrid companies={savedCompanies} onView={c => setViewingCompany(c)} p={p} />
          ) : (
            <div className={`relative min-h-0 flex-1 pt-1 ${shortScreen ? 'pb-3' : 'pb-6'}`}>
              {renderFeed(
                (company) => <ExploreProfileCard company={company} p={p} actions={actions} saved={savedIds.has(company.id)} />,
                { dark: false, p }
              )}

              {/* Navegación vertical del feed: ▲ puntos ▼ */}
              {deck.length > 0 && (
                <div className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 min-[1480px]:flex">
                  <button type="button" aria-label="Empresa anterior" onClick={() => scrollPage(-1)} disabled={atStart}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-80 disabled:opacity-30"
                    style={{ background: p.btnBg, border: p.btnBorder, color: p.btnText, boxShadow: p.cardShadow }}>
                    <ChevronUp size={18} />
                  </button>
                  <button type="button" aria-label="Siguiente empresa" onClick={() => scrollPage(1)} disabled={atEnd}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-80 disabled:opacity-30"
                    style={{ background: p.btnBg, border: p.btnBorder, color: p.btnText, boxShadow: p.cardShadow }}>
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Aviso (con "Deshacer") — arriba al centro */}
          {toast(
            'left-1/2 top-5 -translate-x-1/2 rounded-[14px] px-5 py-2.5',
            { background: p.toastBg, color: p.toastText, backdropFilter: 'blur(16px)', border: p.toastBorder }
          )}
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
          {showFilters && <FiltersDrawer filters={filters} onApply={setFilters} onClose={() => setShowFilters(false)} p={p} />}
        </AnimatePresence>
      </>
    );
  }

  /* ════════════════════════════════════════════════════════════
     MOBILE LAYOUT — feed vertical a pantalla completa
  ════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="relative h-full overflow-hidden" style={{ background: BG }}>

        {activeTab === 'guardados' && (
          <div className="flex h-full flex-col" style={{ paddingBottom: MOBILE_NAV_CLEARANCE }}>
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
            <div className="absolute inset-0">
              {renderFeed(
                (company) => (
                  <div className="h-full" onDoubleClick={handleLike}>
                    <CompanyCard
                      company={company}
                      onViewProfile={() => setViewingCompany({ ...company })}
                      bottomInset={`calc(env(safe-area-inset-bottom, 0px) + 176px)`}
                    />
                  </div>
                ),
                { dark: true, p }
              )}
            </div>
            <FeedRail count={deck.length} index={activeIndex} color="rgba(255,255,255,0.35)" activeColor="#FFFFFF" />
            <SwipeHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              savedCount={savedIds.size}
              onOpenFilters={() => setShowFilters(true)}
            />
            {activeCompany && (
              <ActionButtons
                onUndo={handleUndo}
                onSkip={handlePass}
                onSave={handleSave}
                onLike={handleLike}
                onViewProfile={handleViewProfile}
                bottomOffset={MOBILE_NAV_CLEARANCE}
              />
            )}

            {toast(
              'inset-x-6 justify-center rounded-[18px] px-5 py-2.5 text-center',
              {
                bottom: 'calc(env(safe-area-inset-bottom, 0px) + 184px)',
                background: 'rgba(20,24,40,0.78)', color: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)',
              }
            )}

            {matchLimitReached && (
              <div className="absolute inset-x-4 z-[60] rounded-[16px] border border-amber-400/20 bg-amber-400/8 p-3.5 text-center text-[13px] leading-6 text-amber-200"
                style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 184px)' }}>
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
