import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles, Zap, Crown, Star, BookOpen, Bot, LifeBuoy,
  ChevronRight, Check, X, Lock, Shield,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    tagline: 'Para comenzar',
    accentColor: '#64748B',
    quickFeatures: ['Matches limitados', 'Visualización básica', 'Métricas básicas'],
    features: ['Matches limitados', 'Visualización básica', 'Guardar empresas', 'Métricas básicas'],
    cta: 'Plan actual',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 29,
    tagline: 'Más elegido',
    accentColor: '#1871D8',
    badge: 'Popular',
    quickFeatures: ['Matches ilimitados', 'Filtros avanzados', '1 Boost mensual'],
    features: [
      'Matches ilimitados',
      'Ver interés en tu empresa',
      'Pitch rápido',
      'Prioridad en visibilidad',
      'Filtros avanzados',
      '1 Boost mensual',
      'Métricas avanzadas',
    ],
    cta: 'Multiplicar conexiones',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 79,
    tagline: 'Liderazgo total',
    accentColor: '#F59E0B',
    quickFeatures: ['Todo Growth +', 'IA sugerencias', 'Soporte prioritario'],
    features: [
      'Todo lo de Growth',
      'Mensaje sin match',
      'Prioridad máxima',
      'Boosts ilimitados',
      'IA sugerencias',
      'Insights de mercado',
      'Soporte prioritario',
    ],
    cta: 'Liderar tu categoría',
  },
];

const PLAN_ICONS = {
  starter: Sparkles,
  growth: Zap,
  scale: Crown,
};

const DISTANCE_VALUES = [5, 10, 25, 50, 100, null];

const ACCOUNT_TYPES = [
  'Retail', 'Gastronomía', 'Tecnología', 'Startups', 'E-commerce',
  'Servicios', 'Marketing', 'Inversiones', 'Indumentaria', 'Belleza',
  'Bienestar', 'Educación',
];

// ---------------------------------------------------------------------------
// HELPERS / PRIMITIVES
// ---------------------------------------------------------------------------

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative flex h-[26px] w-[46px] shrink-0 items-center rounded-full transition-colors duration-200"
      style={{ background: checked ? '#1871D8' : '#E2E8F0' }}
    >
      <span
        className="absolute h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function SettingRow({ label, description, children, noBorder }) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 ${noBorder ? '' : 'border-b border-slate-100'}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1A1A1A]">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] leading-4 text-slate-400 pr-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
      {text}
    </p>
  );
}

// ---------------------------------------------------------------------------
// PLAN CARD
// ---------------------------------------------------------------------------

function PlanCard({ plan, isCurrent, onExpand }) {
  const Icon = PLAN_ICONS[plan.id];

  const containerStyle = {
    background: isCurrent
      ? 'linear-gradient(135deg, rgba(16,32,72,0.95), rgba(24,55,130,0.90))'
      : 'linear-gradient(135deg, rgba(12,18,38,0.90), rgba(18,26,54,0.85))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: isCurrent
      ? '1px solid rgba(24,113,216,0.35)'
      : '1px solid rgba(255,255,255,0.08)',
    boxShadow: isCurrent
      ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 28px rgba(24,113,216,0.20)'
      : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.22)',
  };

  return (
    <div
      className="w-[176px] shrink-0 rounded-[22px] overflow-hidden cursor-pointer"
      style={containerStyle}
      onClick={() => onExpand(plan.id)}
    >
      <div className="p-4">
        {/* Top row: icon + badge */}
        <div className="flex items-center justify-between">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: `${plan.accentColor}33` }}
          >
            <Icon size={15} style={{ color: plan.accentColor }} />
          </div>
          {plan.badge && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
              style={{
                background: `${plan.accentColor}22`,
                color: plan.accentColor,
                border: `1px solid ${plan.accentColor}44`,
              }}
            >
              {plan.badge}
            </span>
          )}
        </div>

        {/* Name */}
        <p className="mt-3 font-['Space_Grotesk'] text-lg font-bold text-white leading-tight">
          {plan.name}
        </p>

        {/* Tagline */}
        <p className="mt-0.5 text-[11px] text-white/50">{plan.tagline}</p>

        {/* Price */}
        <div className="mt-3 flex items-end gap-1">
          <span className="font-['Inter'] text-2xl font-extrabold text-white leading-none">
            {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-[11px] text-white/40 pb-1">/mes</span>
          )}
        </div>

        {/* Quick features */}
        <div className="mt-3 space-y-1.5">
          {plan.quickFeatures.map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: plan.accentColor }}
              />
              <span className="text-[11px] text-white/65 leading-tight">{f}</span>
            </div>
          ))}
        </div>

        {/* Tap hint */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-white/40">Ver detalles</span>
          <ChevronRight size={12} className="text-white/30" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PLAN DETAIL MODAL (bottom sheet)
// ---------------------------------------------------------------------------

function PlanDetailSheet({ plan, isCurrent, onClose, onCheckout }) {
  if (!plan) return null;

  const handleCta = () => {
    if (!isCurrent) {
      onCheckout(plan.id);
      onClose();
    }
  };

  const sheetStyle = {
    background: 'linear-gradient(160deg, rgba(10,15,32,0.97), rgba(8,20,46,0.96))',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderBottom: 'none',
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-[61] rounded-t-[28px]"
        style={sheetStyle}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/20" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
        >
          <X size={16} className="text-white/70" />
        </button>

        {/* Content */}
        <div className="px-6 pb-10 pt-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: `${plan.accentColor}33` }}
            >
              {(() => {
                const Icon = PLAN_ICONS[plan.id];
                return <Icon size={22} style={{ color: plan.accentColor }} />;
              })()}
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                {plan.name}
              </h2>
              <p className="text-sm text-white/50">{plan.tagline}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-end gap-1.5">
            <span className="font-['Inter'] text-4xl font-extrabold text-white leading-none">
              {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
            </span>
            {plan.price > 0 && (
              <span className="text-sm text-white/40 pb-1">/mes</span>
            )}
          </div>

          {/* Features */}
          <div className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${plan.accentColor}33` }}
                >
                  <Check size={11} style={{ color: plan.accentColor }} />
                </div>
                <span className="text-sm text-white/80">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleCta}
            disabled={isCurrent}
            className="mt-8 w-full rounded-[16px] py-4 text-sm font-bold transition-opacity active:opacity-80"
            style={{
              background: isCurrent
                ? 'rgba(255,255,255,0.08)'
                : `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}CC)`,
              color: isCurrent ? 'rgba(255,255,255,0.35)' : '#fff',
              cursor: isCurrent ? 'not-allowed' : 'pointer',
            }}
          >
            {isCurrent ? 'Plan actual' : plan.cta}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// EXTRAS SECTION
// ---------------------------------------------------------------------------

function ExtrasSection() {
  const cardStyle = (accent) => ({
    background: 'linear-gradient(135deg, rgba(12,18,38,0.90), rgba(18,26,54,0.85))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.22)',
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Super Likes */}
      <div className="rounded-[22px] p-4" style={cardStyle()}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: 'rgba(245,158,11,0.20)' }}
        >
          <Star size={17} style={{ color: '#F59E0B' }} />
        </div>
        <p className="mt-3 font-['Space_Grotesk'] text-base font-bold text-white leading-tight">
          0 Super Likes
        </p>
        <p className="mt-1 text-[11px] text-white/50 leading-tight">
          Conseguí hasta 3× más matches
        </p>
        <button
          className="mt-3 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-opacity active:opacity-70"
          style={{
            background: 'rgba(245,158,11,0.18)',
            color: '#F59E0B',
            border: '1px solid rgba(245,158,11,0.30)',
          }}
        >
          Obtener
        </button>
      </div>

      {/* Boosts */}
      <div className="rounded-[22px] p-4" style={cardStyle()}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: 'rgba(139,92,246,0.20)' }}
        >
          <Zap size={17} style={{ color: '#8B5CF6' }} />
        </div>
        <p className="mt-3 font-['Space_Grotesk'] text-base font-bold text-white leading-tight">
          Mis Boosts
        </p>
        <p className="mt-1 text-[11px] text-white/50 leading-tight">
          Impulsa tu visibilidad por 30min
        </p>
        <button
          className="mt-3 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-opacity active:opacity-70"
          style={{
            background: 'rgba(139,92,246,0.18)',
            color: '#8B5CF6',
            border: '1px solid rgba(139,92,246,0.30)',
          }}
        >
          Activar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ACCOUNT SETTINGS SECTION
// ---------------------------------------------------------------------------

function AccountSection() {
  const rows = [
    { label: 'Email', value: 'agustin@topwhite.com', icon: <ChevronRight size={16} className="text-slate-300" /> },
    { label: 'Teléfono', value: '+54 9 11 xxxx-xxxx', icon: <ChevronRight size={16} className="text-slate-300" /> },
    { label: 'Contraseña', value: '●●●●●●●●', icon: <ChevronRight size={16} className="text-slate-300" /> },
    { label: 'Empresa', value: 'Top White', icon: <Lock size={15} className="text-slate-300" /> },
  ];

  return (
    <div className="rounded-[24px] overflow-hidden bg-white ring-1 ring-inset ring-slate-200">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center px-5 py-4 ${i < rows.length - 1 ? 'border-b border-slate-100' : ''}`}
        >
          <span className="min-w-[100px] text-sm text-slate-500">{row.label}</span>
          <span className="flex-1 text-sm font-semibold text-[#1A1A1A]">{row.value}</span>
          {row.icon}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EXPLORATION SECTION
// ---------------------------------------------------------------------------

function ExplorationSection({ currentPlan }) {
  const [explorationActive, setExplorationActive] = useState(true);
  const [distanceIdx, setDistanceIdx] = useState(2);
  const [selectedTypes, setSelectedTypes] = useState(['Tecnología', 'Startups', 'E-commerce']);
  const [balancedRecs, setBalancedRecs] = useState(true);
  const [recentActivity, setRecentActivity] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visibility, setVisibility] = useState('normal');

  const isIncognitoLocked = currentPlan === 'starter';

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-3">
      {/* Main exploration card */}
      <div className="rounded-[24px] overflow-hidden bg-white ring-1 ring-inset ring-slate-200">
        {/* Toggle row */}
        <div
          className={`flex items-start gap-3 px-5 py-4 border-b border-slate-100 transition-colors ${!explorationActive ? 'bg-slate-50' : ''}`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#1A1A1A]">Exploración activa</p>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-400 pr-4">
              Si se desactiva, tu perfil quedará oculto y solo aparecerá para empresas que te dieron like
            </p>
          </div>
          <Toggle checked={explorationActive} onChange={setExplorationActive} />
        </div>

        {/* Distance */}
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#1A1A1A]">Distancia máxima</p>
            <span className="text-sm font-bold text-[#1871D8]">
              {distanceIdx === 5 ? 'Ilimitado' : `${DISTANCE_VALUES[distanceIdx]} km`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={distanceIdx}
            onChange={(e) => setDistanceIdx(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#1871D8' }}
          />
          <div className="flex justify-between mt-1.5">
            {['5km', '10km', '25km', '50km', '100km', '∞'].map((label) => (
              <span key={label} className="text-[9px] text-slate-400">
                {label}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Las empresas fuera de este rango no aparecerán en exploración
          </p>
        </div>

        {/* Account types */}
        <div className="px-5 py-4">
          <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Con qué tipo conectar</p>
          <div className="flex flex-wrap gap-2">
            {ACCOUNT_TYPES.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium transition"
                  style={
                    active
                      ? { background: '#1871D8', color: '#fff', border: '1px solid #1871D8' }
                      : { background: '#fff', color: '#475569', border: '1px solid #E2E8F0' }
                  }
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* More toggles card */}
      <div className="rounded-[24px] overflow-hidden bg-white ring-1 ring-inset ring-slate-200">
        <SettingRow label="Recomendaciones equilibradas">
          <Toggle checked={balancedRecs} onChange={setBalancedRecs} />
        </SettingRow>
        <SettingRow label="Actividad reciente">
          <Toggle checked={recentActivity} onChange={setRecentActivity} />
        </SettingRow>
        <SettingRow
          label="Solo chats verificados"
          description="Reduce spam y mejora la calidad de conexiones"
          noBorder
        >
          <Toggle checked={verifiedOnly} onChange={setVerifiedOnly} />
        </SettingRow>
      </div>

      {/* Visibility card */}
      <div className="rounded-[24px] overflow-hidden bg-white ring-1 ring-inset ring-slate-200 px-5 py-4">
        <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Control de visibilidad</p>
        <div className="rounded-[14px] overflow-hidden flex ring-1 ring-slate-200">
          <button
            onClick={() => setVisibility('normal')}
            className="flex-1 py-2 text-sm font-semibold transition-colors"
            style={{
              background: visibility === 'normal' ? '#1871D8' : '#fff',
              color: visibility === 'normal' ? '#fff' : '#64748B',
            }}
          >
            Normal
          </button>
          <button
            onClick={() => !isIncognitoLocked && setVisibility('incognito')}
            className="flex-1 py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            style={{
              background: visibility === 'incognito' ? '#1871D8' : '#fff',
              color: isIncognitoLocked
                ? '#CBD5E1'
                : visibility === 'incognito'
                ? '#fff'
                : '#64748B',
              cursor: isIncognitoLocked ? 'not-allowed' : 'pointer',
            }}
          >
            {isIncognitoLocked && <Lock size={12} />}
            Incógnito 🔒
            {isIncognitoLocked && (
              <span className="text-[10px] text-slate-400 ml-1">Solo Growth+</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HELP SECTION
// ---------------------------------------------------------------------------

const HELP_ROWS = [
  {
    id: 'how',
    icon: BookOpen,
    label: 'Cómo funciona',
    description: 'Cuatro pasos para pasar de descubrir empresas a cerrar acuerdos con fit real.',
  },
  {
    id: 'best',
    icon: Sparkles,
    label: 'Buenas prácticas',
    description: 'Pequeños hábitos que mejoran conversión y velocidad de cierre.',
  },
  {
    id: 'ai',
    icon: Bot,
    label: 'Asesor IA',
    isAI: true,
  },
  {
    id: 'support',
    icon: LifeBuoy,
    label: 'Soporte Data Plus',
    description: 'Escalamos bloqueos funcionales o comerciales dentro del producto.',
  },
];

function HelpSection({ onNavigateToChat }) {
  const [expandedHelp, setExpandedHelp] = useState(null);

  const toggle = (id) => {
    setExpandedHelp((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-[24px] overflow-hidden bg-white ring-1 ring-inset ring-slate-200">
      {HELP_ROWS.map((row, i) => {
        const Icon = row.icon;
        const isLast = i === HELP_ROWS.length - 1;
        const isExpanded = expandedHelp === row.id;

        return (
          <div key={row.id} className={isLast ? '' : 'border-b border-slate-100'}>
            <div
              className="flex items-center gap-3 px-5 py-4 cursor-pointer"
              onClick={() => !row.isAI && toggle(row.id)}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Icon size={15} className="text-slate-500" />
              </div>
              <span className="flex-1 text-sm font-semibold text-[#1A1A1A]">{row.label}</span>
              {row.isAI ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToChat();
                  }}
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity active:opacity-70"
                  style={{ background: '#1871D8' }}
                >
                  Abrir
                </button>
              ) : (
                <ChevronRight
                  size={16}
                  className="text-slate-300 transition-transform"
                  style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                />
              )}
            </div>
            {!row.isAI && isExpanded && row.description && (
              <div className="px-5 pb-4">
                <p className="text-[12px] leading-5 text-slate-500">{row.description}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LEGAL SECTION
// ---------------------------------------------------------------------------

function LegalSection() {
  const links = [
    'Política de cookies',
    'Política de privacidad',
    'Condiciones del servicio',
  ];

  return (
    <div className="space-y-1 px-1">
      {links.map((link) => (
        <div key={link}>
          <button
            className="text-sm text-slate-400 underline underline-offset-2 decoration-slate-300"
          >
            {link}
          </button>
        </div>
      ))}
      <p className="pt-3 text-center text-[11px] text-slate-300">
        Data Plus v1.2.0 · © 2026
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

function SettingsView({ currentPlan = 'starter', onCheckoutSuccess = () => {}, onNavigateToChat = () => {} }) {
  const [expandedPlan, setExpandedPlan] = useState(null);

  const expandedPlanData = PLANS.find((p) => p.id === expandedPlan) ?? null;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: 'linear-gradient(160deg, #0A0F1E 0%, #141E30 100%)' }}
    >
      {/* Header */}
      <div className="px-5 pb-4 pt-12">
        <h1
          className="font-['Space_Grotesk'] text-2xl font-bold text-white"
        >
          Configuración
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Gestioná tu cuenta y preferencias
        </p>
      </div>

      {/* Scrollable content */}
      <div className="px-5 pb-16 space-y-8">

        {/* ── PLANES ── */}
        <section>
          <SectionLabel text="PLANES" />
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={plan.id === currentPlan}
                onExpand={setExpandedPlan}
              />
            ))}
          </div>
        </section>

        {/* ── EXTRAS ── */}
        <section>
          <SectionLabel text="EXTRAS" />
          <ExtrasSection />
        </section>

        {/* ── CUENTA ── */}
        <section>
          <SectionLabel text="CUENTA" />
          <AccountSection />
        </section>

        {/* ── EXPLORACIÓN ── */}
        <section>
          <SectionLabel text="EXPLORACIÓN" />
          <ExplorationSection currentPlan={currentPlan} />
        </section>

        {/* ── AYUDA ── */}
        <section>
          <SectionLabel text="AYUDA" />
          <HelpSection onNavigateToChat={onNavigateToChat} />
        </section>

        {/* ── PRIVACIDAD ── */}
        <section>
          <SectionLabel text="PRIVACIDAD" />
          <LegalSection />
        </section>

      </div>

      {/* Plan detail bottom sheet */}
      <AnimatePresence>
        {expandedPlan && (
          <PlanDetailSheet
            key="plan-sheet"
            plan={expandedPlanData}
            isCurrent={expandedPlanData?.id === currentPlan}
            onClose={() => setExpandedPlan(null)}
            onCheckout={onCheckoutSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SettingsView;
