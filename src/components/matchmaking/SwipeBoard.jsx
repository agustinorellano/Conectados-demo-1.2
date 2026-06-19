import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Heart, MapPin, RotateCcw,
  SlidersHorizontal, Star, Users, X, Zap,
} from 'lucide-react';
import CompanyDetailModal from './CompanyDetailModal';
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

/* ── Desktop right panel — company detail ───────────────────── */
const COMMON_CONNECTIONS = ['Bloom Florería', 'Luna Beauty'];

function DesktopDetailPanel({ company, score, onSkip, onLike, onSave }) {
  if (!company) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-white/20">Seleccioná una empresa para ver el detalle</p>
      </div>
    );
  }

  const offerTags = parseTags(company.offer || '');
  const seekTags  = parseTags(company.seeking || '');

  return (
    <div className="flex flex-1 flex-col h-full overflow-y-auto px-8 py-7 [scrollbar-width:none]">

      {/* Company header */}
      <div className="flex items-start gap-4 mb-7">
        <div className="h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center font-['Space_Grotesk'] text-xl font-black text-white"
          style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
          {typeof company.logo === 'string' ? company.logo.slice(0, 2) : company.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white leading-tight">{company.name}</h2>
          <p className="text-white/50 text-sm mt-1">{company.sector}</p>
          {company.distance != null && (
            <p className="flex items-center gap-1 text-white/30 text-xs mt-1.5">
              <MapPin size={10} /> {company.distance} km de distancia
            </p>
          )}
        </div>
      </div>

      {/* Compatibility score */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Compatibilidad</span>
          <span className="font-['Space_Grotesk'] text-2xl font-black" style={{ color: '#4A9FFF' }}>{score}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #1871D8, #4A9FFF)' }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>

      {/* What they offer */}
      {offerTags.length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-3">Ofrece</p>
          <div className="flex flex-wrap gap-2">
            {offerTags.map(t => (
              <span key={t} className="rounded-full px-3 py-1.5 text-xs font-medium text-[#4A9FFF]"
                style={{ background: 'rgba(74,159,255,0.10)', border: '1px solid rgba(74,159,255,0.22)' }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* What they seek */}
      {seekTags.length > 0 && (
        <div className="mb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-3">Busca</p>
          <div className="flex flex-wrap gap-2">
            {seekTags.map(t => (
              <span key={t} className="rounded-full px-3 py-1.5 text-xs font-medium text-white/55"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Conexiones en común */}
      <div className="mb-8 rounded-[18px] p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Users size={13} style={{ color: '#4A9FFF' }} />
          <span className="text-xs font-semibold text-white/50">{COMMON_CONNECTIONS.length} conexiones en común</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_CONNECTIONS.map(c => (
            <span key={c} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white/55"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
                {c.slice(0, 1)}
              </div>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Action CTAs */}
      <div className="mt-auto grid grid-cols-2 gap-3">
        <motion.button type="button" onClick={onSkip}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-[16px] py-4 text-[14px] font-semibold transition"
          style={{ border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
          <X size={16} strokeWidth={2.5} />
          Pasar
        </motion.button>
        <motion.button type="button" onClick={onLike}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-[16px] py-4 text-[14px] font-bold text-white transition"
          style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 20px rgba(24,113,216,0.35)' }}>
          <Heart size={16} strokeWidth={2} />
          Conectar
        </motion.button>
      </div>

      {/* Keyboard hints */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5 text-[11px] text-white/20">
          <kbd className="rounded px-1.5 py-0.5 font-mono text-[10px]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>←</kbd>
          Pasar
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1.5 text-[11px] text-white/20">
          Conectar
          <kbd className="rounded px-1.5 py-0.5 font-mono text-[10px]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>→</kbd>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SWIPE BOARD — main component
══════════════════════════════════════════════════════════════ */
function SwipeBoard({ companies, dailyMatchCount, onMatch, onOpenPricing, userPlan }) {
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
      showFlash(`¡Match con ${activeCompany.name}!`);
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
        <div className="flex h-full" style={{ background: BG }}>

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

                {/* Drag affordance hint */}
                <div className="flex items-center justify-center gap-2 py-3 shrink-0">
                  <ArrowLeft size={12} className="text-white/20" />
                  <span className="text-[11px] text-white/20">Arrastrá la card o usá las teclas</span>
                  <ArrowRight size={12} className="text-white/20" />
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
            onSkip={handleSkip}
            onLike={handleLike}
            onSave={handleSave}
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
        </div>

        {/* Shared modals */}
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
