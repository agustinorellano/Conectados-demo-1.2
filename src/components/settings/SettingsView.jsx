import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen, Bot, ChevronDown, ChevronRight, Check, Crown,
  ExternalLink, LifeBuoy, Lock, MessageSquare, Moon, Shield, Sparkles, Star, Sun, X, Zap,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Data ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'starter', name: 'Starter', price: 0, tagline: 'Para comenzar',
    accentColor: '#64748B',
    quickFeatures: ['Matches limitados', 'Visualización básica', 'Métricas básicas'],
    features: ['Matches limitados', 'Visualización básica', 'Guardar empresas', 'Métricas básicas'],
    cta: 'Plan actual',
  },
  {
    id: 'growth', name: 'Growth', price: 29, tagline: 'Más elegido',
    accentColor: '#1871D8', badge: 'Popular',
    quickFeatures: ['Matches ilimitados', 'Filtros avanzados', '1 Boost mensual'],
    features: [
      'Matches ilimitados', 'Ver interés en tu empresa', 'Pitch rápido',
      'Prioridad en visibilidad', 'Filtros avanzados', '1 Boost mensual', 'Métricas avanzadas',
    ],
    cta: 'Multiplicar conexiones',
  },
  {
    id: 'scale', name: 'Scale', price: 79, tagline: 'Liderazgo total',
    accentColor: '#F59E0B',
    quickFeatures: ['Todo Growth +', 'IA sugerencias', 'Soporte prioritario'],
    features: [
      'Todo lo de Growth', 'Mensaje sin match', 'Prioridad máxima',
      'Boosts ilimitados', 'IA sugerencias', 'Insights de mercado', 'Soporte prioritario',
    ],
    cta: 'Liderar tu categoría',
  },
];

const PLAN_ICONS = { starter: Sparkles, growth: Zap, scale: Crown };

const DISTANCE_VALUES = [5, 10, 25, 50, 100, null];

const ACCOUNT_TYPES = [
  'Retail', 'Gastronomía', 'Tecnología', 'Startups', 'E-commerce',
  'Servicios', 'Marketing', 'Inversiones', 'Indumentaria', 'Belleza', 'Bienestar', 'Educación',
];

// Help content — same content as HelpCenterView, adapted for dark settings
const HELP_SECTIONS = [
  {
    id: 'how',
    label: 'Cómo funciona',
    icon: BookOpen,
    intro: 'Cuatro pasos concretos para pasar de descubrir empresas a cerrar acuerdos.',
    items: [
      { title: 'Descubrí empresas', detail: 'Explorá perfiles con score comercial y detectá oportunidades con verdadero fit de negocio.' },
      { title: 'Hacé match', detail: 'Decidí rápido con swipe y priorizá empresas que pueden mover ventas reales.' },
      { title: 'Enviá propuesta', detail: 'Activá una conversación con copy guiado y foco comercial claro desde el primer mensaje.' },
      { title: 'Cerrá acuerdos', detail: 'Llevá la oportunidad a tareas y seguimiento dentro de Workplace.' },
    ],
  },
  {
    id: 'practice',
    label: 'Buenas prácticas',
    icon: Sparkles,
    intro: 'Pequeños hábitos que mejoran conversión y velocidad de cierre.',
    items: [
      { title: 'Pitches concretos', detail: 'Hablá de valor económico, audiencia y canales antes que de afinidad general.' },
      { title: 'Seguimiento rápido', detail: 'Convertí cada interés en tarea dentro del mismo día para no perder el momentum.' },
      { title: 'Brief visible', detail: 'Compartí objetivos, ticket y alcance esperado desde el primer mensaje.' },
    ],
  },
  {
    id: 'ai',
    label: 'Asesor IA',
    icon: Bot,
    isAI: true,
  },
  {
    id: 'support',
    label: 'Soporte Conectados',
    icon: LifeBuoy,
    intro: 'Respuestas rápidas para dudas operativas y comerciales.',
    items: [
      { title: 'Asesor IA', detail: 'Pedí ayuda para redactar propuestas, priorizar aliados y ordenar ejecución.', hasAICta: true },
      { title: 'Equipo Conectados', detail: 'Escalamos bloqueos funcionales o comerciales dentro del producto.' },
      { title: 'Centro de ayuda', detail: 'Documentación viva con casos de uso, mejores prácticas y novedades del producto.' },
    ],
  },
];

// ─── Shared dark glass style ─────────────────────────────────────────────────

const CARD_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
};

const DIVIDER = { borderBottom: '1px solid rgba(255,255,255,0.07)' };

// ─── Primitives ──────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative flex h-[26px] w-[46px] shrink-0 items-center rounded-full transition-colors duration-200"
      style={{ background: checked ? '#1871D8' : 'rgba(255,255,255,0.14)' }}
    >
      <span
        className="absolute h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function DarkRow({ label, description, children, noBorder }) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 ${!noBorder ? '' : ''}`}
      style={noBorder ? {} : DIVIDER}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white/90">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] leading-4 text-white/40 pr-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
      {text}
    </p>
  );
}

// ─── Plan Card ───────────────────────────────────────────────────────────────

function PlanCard({ plan, isCurrent, onExpand }) {
  const Icon = PLAN_ICONS[plan.id];
  return (
    <motion.div
      className="w-[176px] shrink-0 cursor-pointer overflow-hidden rounded-[22px]"
      style={
        isCurrent
          ? {
              background: 'linear-gradient(135deg, rgba(16,32,72,0.95), rgba(24,55,130,0.90))',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(24,113,216,0.35)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 28px rgba(24,113,216,0.20)',
            }
          : {
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.22)',
            }
      }
      whileTap={{ scale: 0.97 }}
      onClick={() => onExpand(plan.id)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: `${plan.accentColor}30` }}
          >
            <Icon size={15} style={{ color: plan.accentColor }} />
          </div>
          {plan.badge && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
              style={{ background: `${plan.accentColor}22`, color: plan.accentColor, border: `1px solid ${plan.accentColor}44` }}
            >
              {plan.badge}
            </span>
          )}
        </div>
        <p className="mt-3 font-['Space_Grotesk'] text-lg font-bold leading-tight text-white">{plan.name}</p>
        <p className="mt-0.5 text-[11px] text-white/50">{plan.tagline}</p>
        <div className="mt-3 flex items-end gap-1">
          <span className="font-['Inter'] text-2xl font-extrabold leading-none text-white">
            {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
          </span>
          {plan.price > 0 && <span className="pb-1 text-[11px] text-white/40">/mes</span>}
        </div>
        <div className="mt-3 space-y-1.5">
          {plan.quickFeatures.map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: plan.accentColor }} />
              <span className="text-[11px] leading-tight text-white/65">{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-white/40">Ver detalles</span>
          <ChevronRight size={12} className="text-white/30" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Plan Detail Sheet ───────────────────────────────────────────────────────

function PlanDetailSheet({ plan, isCurrent, onClose, onCheckout }) {
  if (!plan) return null;
  const Icon = PLAN_ICONS[plan.id];
  return (
    <>
      <motion.div
        key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-[61] rounded-t-[28px]"
        style={{
          background: 'linear-gradient(160deg, rgba(10,15,32,0.98), rgba(8,20,46,0.97))',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.09)', borderBottom: 'none',
        }}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/20" />
        <button
          onClick={onClose}
          className="absolute right-5 top-4 flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        >
          <X size={16} className="text-white/70" />
        </button>
        <div className="px-6 pb-12 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: `${plan.accentColor}30` }}>
              <Icon size={22} style={{ color: plan.accentColor }} />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">{plan.name}</h2>
              <p className="text-sm text-white/50">{plan.tagline}</p>
            </div>
          </div>
          <div className="mt-5 flex items-end gap-1.5">
            <span className="font-['Inter'] text-4xl font-extrabold leading-none text-white">
              {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
            </span>
            {plan.price > 0 && <span className="pb-1 text-sm text-white/40">/mes</span>}
          </div>
          <div className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${plan.accentColor}30` }}>
                  <Check size={11} style={{ color: plan.accentColor }} />
                </div>
                <span className="text-sm text-white/80">{f}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { if (!isCurrent) { onCheckout(plan.id); onClose(); } }}
            disabled={isCurrent}
            className="mt-8 w-full rounded-[16px] py-4 text-sm font-bold transition active:opacity-80"
            style={{
              background: isCurrent ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}CC)`,
              color: isCurrent ? 'rgba(255,255,255,0.30)' : '#fff',
              cursor: isCurrent ? 'not-allowed' : 'pointer',
            }}
          >
            {isCurrent ? '✓ Plan actual' : plan.cta}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Extras Section ──────────────────────────────────────────────────────────

function ExtrasSection() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: '0 Super Likes', sub: 'Conseguí hasta 3× más matches', cta: 'Obtener', accent: '#F59E0B', Icon: Star },
        { label: 'Mis Boosts', sub: 'Impulsa tu visibilidad por 30min', cta: 'Activar', accent: '#8B5CF6', Icon: Zap },
      ].map(({ label, sub, cta, accent, Icon }) => (
        <div key={label} className="rounded-[22px] p-4" style={CARD_STYLE}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: `${accent}20` }}>
            <Icon size={17} style={{ color: accent }} />
          </div>
          <p className="mt-3 font-['Space_Grotesk'] text-base font-bold leading-tight text-white">{label}</p>
          <p className="mt-1 text-[11px] leading-tight text-white/45">{sub}</p>
          <button
            className="mt-3 rounded-full px-3 py-1.5 text-[11px] font-semibold transition active:opacity-70"
            style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}
          >
            {cta}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Account Section ─────────────────────────────────────────────────────────

function AccountSection() {
  const rows = [
    { label: 'Email', value: 'agustin@topwhite.com', chevron: true },
    { label: 'Teléfono', value: '+54 9 11 xxxx-xxxx', chevron: true },
    { label: 'Contraseña', value: '●●●●●●●●', chevron: true },
    { label: 'Empresa', value: 'Top White', locked: true },
  ];
  return (
    <div className="overflow-hidden rounded-[24px]" style={CARD_STYLE}>
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center px-5 py-4"
          style={i < rows.length - 1 ? DIVIDER : {}}>
          <span className="min-w-[100px] text-sm text-white/45">{row.label}</span>
          <span className="flex-1 text-sm font-semibold text-white/85">{row.value}</span>
          {row.locked
            ? <Lock size={14} className="text-white/25" />
            : <ChevronRight size={16} className="text-white/25" />}
        </div>
      ))}
    </div>
  );
}

// ─── Exploration Section ─────────────────────────────────────────────────────

function ExplorationSection({ currentPlan }) {
  const [explorationActive, setExplorationActive] = useState(true);
  const [distanceIdx, setDistanceIdx] = useState(2);
  const [selectedTypes, setSelectedTypes] = useState(['Tecnología', 'Startups', 'E-commerce']);
  const [balancedRecs, setBalancedRecs] = useState(true);
  const [recentActivity, setRecentActivity] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visibility, setVisibility] = useState('normal');
  const isIncognitoLocked = currentPlan === 'starter';

  const toggleType = (type) =>
    setSelectedTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);

  return (
    <div className="space-y-3">
      {/* Main exploration card */}
      <div className="overflow-hidden rounded-[24px]" style={CARD_STYLE}>
        {/* Exploration toggle */}
        <div className="flex items-start gap-3 px-5 py-4" style={DIVIDER}>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white/90">Exploración activa</p>
            <p className="mt-0.5 text-[11px] leading-4 text-white/40 pr-4">
              Si se desactiva, tu perfil quedará oculto y solo aparecerá para empresas que te dieron like
            </p>
          </div>
          <Toggle checked={explorationActive} onChange={setExplorationActive} />
        </div>

        {/* Distance */}
        <div className="px-5 py-4" style={DIVIDER}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white/90">Distancia máxima</p>
            <span className="text-sm font-bold text-[#4A9FFF]">
              {distanceIdx === 5 ? 'Ilimitado' : `${DISTANCE_VALUES[distanceIdx]} km`}
            </span>
          </div>
          <input
            type="range" min={0} max={5} step={1} value={distanceIdx}
            onChange={(e) => setDistanceIdx(Number(e.target.value))}
            className="w-full h-1.5 cursor-pointer appearance-none rounded-full"
            style={{ accentColor: '#1871D8' }}
          />
          <div className="mt-1.5 flex justify-between">
            {['5km', '10km', '25km', '50km', '100km', '∞'].map((l) => (
              <span key={l} className="text-[9px] text-white/30">{l}</span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-white/35">
            Las empresas fuera de este rango no aparecerán en exploración
          </p>
        </div>

        {/* Account types */}
        <div className="px-5 py-4">
          <p className="mb-3 text-sm font-semibold text-white/90">Con qué tipo conectar</p>
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
                      ? { background: '#1871D8', color: '#fff', border: '1px solid rgba(24,113,216,0.6)' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.60)', border: '1px solid rgba(255,255,255,0.10)' }
                  }
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* More toggles */}
      <div className="overflow-hidden rounded-[24px]" style={CARD_STYLE}>
        <DarkRow label="Recomendaciones equilibradas">
          <Toggle checked={balancedRecs} onChange={setBalancedRecs} />
        </DarkRow>
        <DarkRow label="Actividad reciente">
          <Toggle checked={recentActivity} onChange={setRecentActivity} />
        </DarkRow>
        <DarkRow
          label="Solo chats verificados"
          description="Reduce spam y mejora la calidad de conexiones"
          noBorder
        >
          <Toggle checked={verifiedOnly} onChange={setVerifiedOnly} />
        </DarkRow>
      </div>

      {/* Visibility control */}
      <div className="overflow-hidden rounded-[24px] px-5 py-4" style={CARD_STYLE}>
        <p className="mb-3 text-sm font-semibold text-white/90">Control de visibilidad</p>
        <div className="flex overflow-hidden rounded-[12px]" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
          <button
            onClick={() => setVisibility('normal')}
            className="flex-1 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: visibility === 'normal' ? '#1871D8' : 'rgba(255,255,255,0.04)',
              color: visibility === 'normal' ? '#fff' : 'rgba(255,255,255,0.50)',
            }}
          >
            Normal
          </button>
          <button
            onClick={() => !isIncognitoLocked && setVisibility('incognito')}
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: visibility === 'incognito' ? '#1871D8' : 'rgba(255,255,255,0.04)',
              color: isIncognitoLocked ? 'rgba(255,255,255,0.25)' : visibility === 'incognito' ? '#fff' : 'rgba(255,255,255,0.50)',
              cursor: isIncognitoLocked ? 'not-allowed' : 'pointer',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {isIncognitoLocked && <Lock size={11} />}
            Incógnito
            {isIncognitoLocked && (
              <span className="text-[9px] text-white/25">Growth+</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Help Section ────────────────────────────────────────────────────────────

function HelpSection({ onNavigateToChat }) {
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="overflow-hidden rounded-[24px]" style={CARD_STYLE}>
      {HELP_SECTIONS.map((section, si) => {
        const Icon = section.icon;
        const isLast = si === HELP_SECTIONS.length - 1;
        const isOpen = expanded === section.id;

        return (
          <div key={section.id} style={isLast ? {} : DIVIDER}>
            {/* Row header */}
            <button
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition"
              style={{ background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}
              onClick={() => section.isAI ? onNavigateToChat() : toggle(section.id)}
              type="button"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <Icon size={15} className="text-white/60" />
              </div>
              <span className="flex-1 text-sm font-semibold text-white/90">{section.label}</span>
              {section.isAI ? (
                <span
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 2px 10px rgba(24,113,216,0.3)' }}
                >
                  Abrir
                </span>
              ) : (
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronRight size={16} className="text-white/25" />
                </motion.div>
              )}
            </button>

            {/* Expanded content */}
            <AnimatePresence initial={false}>
              {!section.isAI && isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  {section.intro && (
                    <p className="px-5 pb-3 text-[12px] leading-5 text-white/45">{section.intro}</p>
                  )}
                  <div className="space-y-px px-4 pb-4">
                    {section.items?.map((item, ii) => (
                      <div
                        key={item.title}
                        className="rounded-[14px] px-4 py-3.5"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                            style={{ background: 'rgba(24,113,216,0.20)', color: '#4A9FFF' }}
                          >
                            {ii + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white/90">{item.title}</p>
                            <p className="mt-0.5 text-[12px] leading-5 text-white/50">{item.detail}</p>
                            {item.hasAICta && (
                              <button
                                onClick={onNavigateToChat}
                                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)' }}
                                type="button"
                              >
                                <MessageSquare size={11} />
                                Abrir chat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Legal Section ───────────────────────────────────────────────────────────

const LEGAL_LINKS = [
  { label: 'Política de cookies', icon: Shield },
  { label: 'Política de privacidad', icon: Lock },
  { label: 'Condiciones del servicio', icon: ExternalLink },
];

function LegalSection() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[24px]" style={CARD_STYLE}>
        {LEGAL_LINKS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:opacity-70"
              style={i < LEGAL_LINKS.length - 1 ? DIVIDER : {}}
              type="button"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <Icon size={14} className="text-white/50" />
              </div>
              <span className="flex-1 text-sm font-semibold text-white/75">{item.label}</span>
              <ChevronRight size={14} className="text-white/20" />
            </button>
          );
        })}
      </div>

      {/* Version + brand */}
      <div className="flex flex-col items-center gap-1 py-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-black text-white"
            style={{ background: 'linear-gradient(135deg, #243B55, #35577D)' }}
          >
            DP
          </div>
          <span className="text-[11px] font-semibold text-white/35">Conectados</span>
        </div>
        <p className="text-[10px] text-white/25">v1.2.0 · © 2026</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function SettingsView({ currentPlan = 'starter', onCheckoutSuccess = () => {}, onNavigateToChat = () => {} }) {
  const { t, theme, toggleTheme } = useTheme();
  const [expandedPlan, setExpandedPlan] = useState(null);
  const expandedPlanData = PLANS.find((p) => p.id === expandedPlan) ?? null;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: t.bg, transition: 'background 0.3s ease' }}
    >
      {/* Page header */}
      <div className="px-5 pb-4 pt-8">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold" style={{ color: t.text1 }}>Configuración</h1>
        <p className="mt-1 text-sm" style={{ color: t.text3 }}>Gestioná tu cuenta y preferencias</p>
      </div>

      {/* Content */}
      <div className="space-y-7 px-5 pb-20">

        <section>
          <SectionLabel text="PLANES" />
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === currentPlan} onExpand={setExpandedPlan} />
            ))}
          </div>
        </section>

        <section>
          <SectionLabel text="APARIENCIA" />
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-[16px] px-4 py-4 transition-all active:scale-[0.98]"
            style={{ background: t.surface, border: `1px solid ${t.surfaceBorder}` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px]" style={{ background: t.surface2 }}>
                <motion.div key={theme} initial={{ scale: 0.7, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 0.22 }}>
                  {theme === 'dark' ? <Sun size={18} style={{ color: t.accentMid }} /> : <Moon size={18} style={{ color: t.accent }} />}
                </motion.div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: t.text1 }}>
                  {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: t.text3 }}>
                  {theme === 'dark' ? 'Cambiar a interfaz clara' : 'Cambiar a interfaz oscura'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="relative h-6 w-11 rounded-full transition-all duration-300"
                style={{ background: theme === 'dark' ? t.surface2 : t.accent }}
              >
                <motion.div
                  className="absolute top-0.5 h-5 w-5 rounded-full shadow-sm"
                  style={{ background: '#FFFFFF' }}
                  animate={{ x: theme === 'dark' ? 2 : 22 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </button>
        </section>

        <section>
          <SectionLabel text="EXTRAS" />
          <ExtrasSection />
        </section>

        <section>
          <SectionLabel text="CUENTA" />
          <AccountSection />
        </section>

        <section>
          <SectionLabel text="EXPLORACIÓN" />
          <ExplorationSection currentPlan={currentPlan} />
        </section>

        <section>
          <SectionLabel text="AYUDA" />
          <HelpSection onNavigateToChat={onNavigateToChat} />
        </section>

        <section>
          <SectionLabel text="PRIVACIDAD Y LEGALES" />
          <LegalSection />
        </section>

      </div>

      {/* Plan detail sheet */}
      <AnimatePresence>
        {expandedPlan && (
          <PlanDetailSheet
            key="sheet"
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
