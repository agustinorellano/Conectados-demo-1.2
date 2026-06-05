import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart2, Calendar, Check, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Compass, Crown, Folder, Globe, Lightbulb, Lock, MessageSquare,
  Mic, MicOff, Plus, Search, Send, Sparkles, Star, Target, TrendingUp,
  Users, Wand2, X, Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { buildAssistantReply, createWelcomeMessage } from '../../utils/assistant';

/* ─────────────────────────────────────────────────────────
   IA MODES
───────────────────────────────────────────────────────── */
const IA_MODES = [
  {
    key: 'analytics',
    label: 'Analítico',
    Icon: BarChart2,
    tagline: 'Datos, métricas y patrones',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.30)',
    gradient: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
    welcomeHint: 'Listo para analizar tus datos y detectar patrones de crecimiento.',
  },
  {
    key: 'strategic',
    label: 'Estratégico',
    Icon: Compass,
    tagline: 'Crecimiento y partnerships',
    color: '#141E30',
    glow: 'rgba(20,30,48,0.28)',
    gradient: 'linear-gradient(135deg, #0D1526 0%, #35577D 100%)',
    welcomeHint: 'Enfocado en expansión, alianzas de alto valor y decisiones de negocio.',
  },
  {
    key: 'creative',
    label: 'Creativo',
    Icon: Wand2,
    tagline: 'Ideas, branding y campañas',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.30)',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 100%)',
    welcomeHint: 'Pensando fuera de la caja en contenido, campañas y narrativa de marca.',
  },
];

/* ─────────────────────────────────────────────────────────
   QUICK PROMPTS per mode
───────────────────────────────────────────────────────── */
const QUICK_PROMPTS = {
  analytics: [
    { Icon: TrendingUp,    text: 'Rendimiento de mis alianzas activas' },
    { Icon: Activity,      text: 'Detectá cuellos de botella operativos' },
    { Icon: BarChart2,     text: '¿Cuáles son mis KPIs más críticos?' },
    { Icon: Target,        text: 'Métricas de conversión del último mes' },
  ],
  strategic: [
    { Icon: Globe,         text: 'Oportunidades de expansión para mi marca' },
    { Icon: Users,         text: '¿Qué alianzas debería priorizar?' },
    { Icon: Zap,           text: 'Plan de crecimiento a 90 días' },
    { Icon: Target,        text: 'Potencial de mis partners actuales' },
  ],
  creative: [
    { Icon: Sparkles,      text: 'Ideas para campaña de co-branding' },
    { Icon: MessageSquare, text: 'Contenido para redes sociales' },
    { Icon: Wand2,         text: 'Naming para la alianza con Bloom Florería' },
    { Icon: Globe,         text: 'Narrativa de marca para el partnership' },
  ],
};

/* ─────────────────────────────────────────────────────────
   SIDEBAR DATA
───────────────────────────────────────────────────────── */
const FOLDERS = [
  { id: 'marketing', label: 'Marketing',   Icon: TrendingUp },
  { id: 'growth',    label: 'Growth',      Icon: Zap        },
  { id: 'alianzas',  label: 'Alianzas',    Icon: Users      },
  { id: 'ops',       label: 'Operaciones', Icon: Activity   },
  { id: 'ideas',     label: 'Ideas IA',    Icon: Lightbulb  },
];

const MOCK_CONVS = [
  { id: 'c1', title: 'Campaña bundle primavera', folder: 'marketing', date: 'Hoy',   preview: 'Plan co-branding florería × moda', pinned: true  },
  { id: 'c2', title: 'Análisis métricas mayo',    folder: 'growth',   date: 'Ayer',  preview: 'Revenue y conversiones del mes',  pinned: false },
  { id: 'c3', title: 'Partnership Bloom',         folder: 'alianzas', date: '5 May', preview: 'Condiciones del acuerdo...',       pinned: true  },
  { id: 'c4', title: 'Optimizar embudo ventas',   folder: 'growth',   date: '3 May', preview: 'Bottleneck identificado en...',    pinned: false },
  { id: 'c5', title: 'Propuesta Luna Beauty',     folder: 'alianzas', date: '1 May', preview: 'Bundle wellness + moda...',        pinned: false },
];

/* ─────────────────────────────────────────────────────────
   VOICE MOCK TRANSCRIPTIONS (cycling)
───────────────────────────────────────────────────────── */
const VOICE_TEXTS = [
  '¿Cuáles son mis alianzas con más potencial de crecimiento este trimestre?',
  'Generá un plan de campaña co-branded con Bloom Florería para el mes que viene.',
  '¿Qué métricas debería revisar antes de cerrar el deal con Digital Craft?',
];

/* ─────────────────────────────────────────────────────────
   ACTION DETECTION
───────────────────────────────────────────────────────── */
function detectAction(text, matches = []) {
  const t = text.toLowerCase();

  // Detect partner name from text or use first match
  const partnerFromMatches = matches[0]?.name || 'Partner';
  const mentionedPartner = ['bloom', 'luna', 'sushi', 'core', 'digital', 'café', 'cafe']
    .find(p => t.includes(p));

  const partnerMap = {
    bloom: 'Bloom Florería',
    luna: 'Luna Beauty',
    sushi: 'Sushi Nakama',
    core: 'Core Wellness',
    digital: 'Digital Craft',
    café: 'Café Patio',
    cafe: 'Café Patio',
  };
  const partner = mentionedPartner ? partnerMap[mentionedPartner] : partnerFromMatches;

  if ((t.includes('crear') || t.includes('nueva') || t.includes('asigna') || t.includes('agregar')) && t.includes('tarea')) {
    return {
      type: 'task',
      label: 'Nueva tarea',
      description: text.slice(0, 80),
      partner,
      priority: 'media',
      participants: ['Agustín O.'],
      due: 'Esta semana',
      Icon: CheckCircle2,
      color: '#059669',
      // Workplace opportunity shape
      opportunity: {
        title: text.slice(0, 60),
        partnerName: partner,
        partnerColorKey: 'emerald',
        type: 'colaboración',
        status: 'backlog',
        priority: 'media',
        estimatedValue: 0,
        area: 'general',
      },
    };
  }

  if (t.includes('reuni') || t.includes('meeting') || t.includes('agenda') || t.includes('cita')) {
    return {
      type: 'meeting',
      label: 'Agendar reunión',
      description: `Meeting con ${partner} — propuesto por IA`,
      partner,
      priority: 'alta',
      participants: ['Agustín O.', partner],
      due: 'Próxima semana',
      Icon: Calendar,
      color: '#1871D8',
      opportunity: {
        title: `Meeting con ${partner}`,
        partnerName: partner,
        partnerColorKey: 'blue',
        type: 'evento',
        status: 'backlog',
        priority: 'alta',
        estimatedValue: 0,
        area: 'general',
      },
    };
  }

  if (t.includes('campaña') || t.includes('campaign') || t.includes('bundle') || t.includes('co-brand') || t.includes('cobrand')) {
    const title = mentionedPartner
      ? `Campaña co-branded × ${partner}`
      : 'Nueva campaña co-branded';
    return {
      type: 'campaign',
      label: 'Crear campaña',
      description: title,
      partner,
      priority: 'alta',
      participants: ['Agustín O.'],
      due: 'Este mes',
      Icon: Sparkles,
      color: '#7C3AED',
      opportunity: {
        title,
        partnerName: partner,
        partnerColorKey: 'violet',
        type: 'colaboración',
        status: 'backlog',
        priority: 'alta',
        estimatedValue: 50000,
        area: 'marketing',
      },
    };
  }

  if (t.includes('oportunidad') || t.includes('proyecto') || t.includes('alianza') || t.includes('acuerdo')) {
    return {
      type: 'opportunity',
      label: 'Nueva oportunidad',
      description: text.slice(0, 80),
      partner,
      priority: 'media',
      participants: ['Agustín O.'],
      due: 'Sin fecha',
      Icon: Zap,
      color: '#F59E0B',
      opportunity: {
        title: text.slice(0, 60),
        partnerName: partner,
        partnerColorKey: 'amber',
        type: 'colaboración',
        status: 'backlog',
        priority: 'media',
        estimatedValue: 30000,
        area: 'ventas',
      },
    };
  }

  return null;
}

/* ─────────────────────────────────────────────────────────
   IA AVATAR
───────────────────────────────────────────────────────── */
function IaAvatar({ mode = IA_MODES[1], compact = false, pulse = false }) {
  const size = compact ? 28 : 40;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: mode.glow }}
        />
      )}
      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{ background: mode.gradient, boxShadow: `0 2px 10px ${mode.glow}` }}
      >
        <mode.Icon className="text-white" style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={1.8} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODE PICKER
───────────────────────────────────────────────────────── */
function IaModePicker({ mode, setMode }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 pt-2 [scrollbar-width:none] shrink-0">
      {IA_MODES.map((m) => {
        const active = mode.key === m.key;
        return (
          <motion.button
            key={m.key}
            type="button"
            onClick={() => setMode(m)}
            whileTap={{ scale: 0.94 }}
            className="flex shrink-0 items-center gap-2 rounded-[14px] px-3.5 py-2 text-[12px] font-semibold transition-all"
            style={{
              background: active ? m.gradient : 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: active ? 'white' : '#64748B',
              boxShadow: active
                ? `0 4px 16px ${m.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`
                : '0 1px 4px rgba(20,30,48,0.07)',
              border: active ? 'none' : '1px solid rgba(20,30,48,0.08)',
            }}
          >
            <m.Icon className="h-3.5 w-3.5 shrink-0" />
            {m.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   QUICK PROMPT GRID
───────────────────────────────────────────────────────── */
function QuickPromptGrid({ mode, onSelect }) {
  const prompts = QUICK_PROMPTS[mode.key] || QUICK_PROMPTS.strategic;
  return (
    <motion.div
      key={mode.key}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-2 gap-2.5 px-4 pb-4"
    >
      {prompts.map(({ Icon, text }) => (
        <motion.button
          key={text}
          type="button"
          onClick={() => onSelect(text)}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          className="flex flex-col gap-2 rounded-[16px] p-3.5 text-left transition-all"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(20,30,48,0.07)',
            boxShadow: '0 2px 10px rgba(20,30,48,0.06)',
          }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: `${mode.color}12` }}
          >
            <Icon className="h-4 w-4" style={{ color: mode.color }} strokeWidth={1.8} />
          </div>
          <p className="text-[12px] font-medium leading-snug text-slate-600">{text}</p>
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   WORKPLACE NAV PILL — shown after action confirmed
───────────────────────────────────────────────────────── */
function WorkplaceNavPill({ onNavigate }) {
  return (
    <motion.button
      type="button"
      onClick={onNavigate}
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', damping: 22, stiffness: 340 }}
      className="mx-4 mb-1 flex items-center gap-2.5 rounded-[16px] px-4 py-3 text-left"
      style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(5,150,105,0.06) 100%)',
        border: '1px solid rgba(16,185,129,0.22)',
        boxShadow: '0 2px 12px rgba(16,185,129,0.10)',
      }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'rgba(16,185,129,0.14)' }}
      >
        <ArrowRight className="h-4 w-4 text-emerald-600" strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-emerald-700">Creado en Workplace</p>
        <p className="text-[11px] text-emerald-600/70">Tocá para verlo y gestionar →</p>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────
   ACTION CONFIRM CARD
───────────────────────────────────────────────────────── */
function ActionConfirmCard({ action, onConfirm, onCancel }) {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded-[18px] px-4 py-3"
        style={{
          background: 'rgba(5,150,105,0.08)',
          border: '1px solid rgba(5,150,105,0.20)',
        }}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-[13px] font-semibold text-emerald-700">
          {action.label} enviado al Workplace ✓
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 24, stiffness: 340 }}
      className="overflow-hidden rounded-[20px]"
      style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(20,30,48,0.09)',
        boxShadow: '0 8px 32px rgba(20,30,48,0.12)',
      }}
    >
      {/* Header strip */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ background: `${action.color}0d`, borderBottom: `1px solid ${action.color}18` }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: `${action.color}18` }}
        >
          <action.Icon className="h-4 w-4" style={{ color: action.color }} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Acción propuesta</p>
          <p className="font-['Space_Grotesk'] text-[15px] font-bold text-[#141E30]">{action.label}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-4 py-3.5 text-[12px]">
        {[
          { label: 'Descripción',   value: action.description },
          { label: 'Prioridad',     value: action.priority,    accent: action.color },
          { label: 'Participantes', value: action.participants.join(', ') },
          { label: 'Plazo',         value: action.due },
        ].map(({ label, value, accent }) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-0.5 font-semibold" style={{ color: accent || '#374151' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
        <button
          type="button"
          onClick={() => { setConfirmed(true); onConfirm(action); }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[13px] font-semibold text-white transition active:scale-95"
          style={{ background: action.color, boxShadow: `0 4px 16px ${action.color}40` }}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> Confirmar y enviar al Workplace
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-slate-500 transition hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   SCALE PLAN CTA
───────────────────────────────────────────────────────── */
function ScalePlanCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-4 my-3 overflow-hidden rounded-[20px]"
      style={{
        background: 'linear-gradient(135deg, rgba(10,15,32,0.92) 0%, rgba(24,113,216,0.18) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(24,113,216,0.22)',
        boxShadow: '0 8px 32px rgba(24,113,216,0.15)',
      }}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl"
        style={{ background: 'rgba(24,113,216,0.25)' }} />
      <div className="relative flex items-start gap-4 p-5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: 'rgba(24,113,216,0.20)', border: '1px solid rgba(24,113,216,0.30)' }}
        >
          <Sparkles className="h-5 w-5 text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-400">IA Avanzada</p>
          <p className="mt-0.5 font-['Space_Grotesk'] text-[15px] font-bold text-white">Accedé a inteligencia avanzada</p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/55">
            Sugerencias de mercado, análisis predictivo y workflows automáticos disponibles en el plan Scale.
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Lock className="h-3.5 w-3.5 text-white/50" />
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-white/8 px-5 py-3">
        <Crown className="h-3.5 w-3.5 text-amber-400" />
        <p className="flex-1 text-[11px] text-white/50">Plan Scale desbloquea todas las funciones</p>
        <button
          type="button"
          className="rounded-[10px] px-3 py-1.5 text-[11px] font-bold text-white transition hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 12px rgba(24,113,216,0.40)' }}
        >
          Ver planes
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────────────────────── */
function MessageBubble({ message, mode, onConfirm, onCancelAction, onNavigateToWorkplace }) {
  if (message.type === 'action_card') {
    return (
      <div className="px-4 py-1">
        <ActionConfirmCard action={message.action} onConfirm={onConfirm} onCancel={onCancelAction} />
      </div>
    );
  }

  if (message.type === 'workplace_nav') {
    return (
      <WorkplaceNavPill onNavigate={onNavigateToWorkplace} />
    );
  }

  const isUser = message.role === 'user';
  const blocks = (message.content || '').split('\n').filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex items-end gap-2.5 px-4 py-1 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && <IaAvatar mode={mode} compact />}

      <div
        className="max-w-[80%] rounded-[18px] px-4 py-3 text-[13px] leading-relaxed"
        style={isUser ? {
          background: 'linear-gradient(135deg, #141E30 0%, #1D3557 100%)',
          color: 'white',
          borderBottomRightRadius: 4,
          boxShadow: '0 3px 12px rgba(20,30,48,0.25)',
        } : {
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(20,30,48,0.07)',
          color: '#1E293B',
          borderBottomLeftRadius: 4,
          boxShadow: '0 2px 10px rgba(20,30,48,0.07)',
        }}
      >
        {blocks.map((b, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{b}</p>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   TYPING INDICATOR
───────────────────────────────────────────────────────── */
function TypingIndicator({ mode }) {
  return (
    <div className="flex items-end gap-2.5 px-4 py-1">
      <IaAvatar mode={mode} compact />
      <div
        className="flex items-center gap-1.5 rounded-[18px] px-4 py-3.5"
        style={{
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(20,30,48,0.07)',
          borderBottomLeftRadius: 4,
          boxShadow: '0 2px 10px rgba(20,30,48,0.07)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: mode.color }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────── */
function ConversationSidebar({ open, onClose, onNewChat, currentId, onSelect }) {
  const [search, setSearch] = useState('');
  const [openFolder, setOpenFolder] = useState('alianzas');

  const filtered = MOCK_CONVS.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 260 : 0, opacity: open ? 1 : 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className="flex flex-col shrink-0 overflow-hidden rounded-[22px]"
      style={{
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: open ? '1px solid rgba(20,30,48,0.08)' : 'none',
        boxShadow: open ? '0 4px 24px rgba(20,30,48,0.09)' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <p className="font-['Space_Grotesk'] text-[14px] font-bold text-[#141E30]">Historial</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNewChat}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 md:hidden"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mx-3 mb-3 shrink-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar conversaciones…"
          className="h-8 w-full rounded-[10px] bg-slate-100 pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:bg-slate-200"
        />
      </div>

      {/* Folders */}
      <div className="px-3 pb-2 shrink-0">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Carpetas</p>
        <div className="flex flex-wrap gap-1.5">
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setOpenFolder(openFolder === f.id ? null : f.id)}
              className="flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[11px] font-medium transition"
              style={{
                background: openFolder === f.id ? 'rgba(20,30,48,0.08)' : 'rgba(20,30,48,0.04)',
                color: openFolder === f.id ? '#141E30' : '#64748B',
              }}
            >
              <f.Icon className="h-3 w-3" />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4 [scrollbar-width:none]">
        {pinned.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1.5">
              <Star className="h-2.5 w-2.5" /> Fijadas
            </p>
            <div className="space-y-1">
              {pinned.map((c) => (
                <ConvItem key={c.id} conv={c} active={currentId === c.id} onSelect={onSelect} />
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1.5">
            <Clock className="h-2.5 w-2.5" /> Recientes
          </p>
          <div className="space-y-1">
            {recent.filter((c) => !openFolder || c.folder === openFolder).map((c) => (
              <ConvItem key={c.id} conv={c} active={currentId === c.id} onSelect={onSelect} />
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function ConvItem({ conv, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conv.id)}
      className="flex w-full flex-col gap-0.5 rounded-[12px] px-3 py-2.5 text-left transition"
      style={{ background: active ? 'rgba(20,30,48,0.08)' : 'transparent' }}
    >
      <div className="flex items-center justify-between">
        <p className={`truncate text-[12px] font-semibold ${active ? 'text-[#141E30]' : 'text-slate-600'}`}>
          {conv.title}
        </p>
        <span className="ml-2 shrink-0 text-[10px] text-slate-400">{conv.date}</span>
      </div>
      <p className="truncate text-[11px] text-slate-400">{conv.preview}</p>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN VIEW
───────────────────────────────────────────────────────── */
function AssistantView({
  aiEnabled = false,
  company,
  matches,
  recommendations,
  recommendedCompanies,
  actionItems,
  opportunities = [],
  onCreateOpportunity,
  onNavigateToWorkplace,
}) {
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [mode,         setMode]         = useState(IA_MODES[1]); // Estratégico by default
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [recording,    setRecording]    = useState(false);
  const [activeConvId, setActiveConvId] = useState('c1');
  const [voiceIdx,     setVoiceIdx]     = useState(0);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Init welcome message
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `${createWelcomeMessage(company.name)}\n\n${mode.welcomeHint}`,
    }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-greet on mode change (only if just welcome)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{
          role: 'assistant',
          content: `${createWelcomeMessage(company.name)}\n\n${mode.welcomeHint}`,
        }];
      }
      return prev;
    });
  }, [mode, company.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = (text) => {
    const txt = (text || input).trim();
    if (!txt || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: txt };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    window.setTimeout(() => {
      const reply = buildAssistantReply({
        input: txt, company, actions: actionItems,
        recommendations, recommendedCompanies, matches,
        opportunities,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);

      // Maybe append action card
      const action = detectAction(txt, matches);
      if (action) {
        window.setTimeout(() => {
          setMessages((prev) => [...prev, { type: 'action_card', action }]);
        }, 350);
      }
    }, 750);
  };

  const handleConfirmAction = (action) => {
    // Build workplace opportunity object
    const now = new Date();
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]}`;

    const partnerColorKeys = {
      'Bloom Florería': 'pink',
      'Luna Beauty': 'rose',
      'Sushi Nakama': 'brown',
      'Core Wellness': 'amber',
      'Digital Craft': 'bronze',
      'Café Patio': 'coffee',
    };

    const opp = action.opportunity || {};
    const partnerName = opp.partnerName || action.partner || 'Partner';
    const colorKey = opp.partnerColorKey || partnerColorKeys[partnerName] || 'emerald';

    const newOpportunity = {
      id: `ai-${Date.now()}`,
      title: opp.title || action.description,
      partner: {
        name: partnerName,
        initials: partnerName.slice(0, 2).toUpperCase(),
        colorKey,
      },
      type: opp.type || 'colaboración',
      status: opp.status || 'backlog',
      commercialStatus: 'negociación',
      priority: opp.priority || action.priority || 'media',
      estimatedValue: opp.estimatedValue || 0,
      valueScale: 2,
      assignees: [{ name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }],
      dueDate: dateStr,
      isHighValue: (opp.estimatedValue || 0) >= 50000,
      fromMeeting: null,
      description: action.description || '',
      subtasks: [],
      activity: [{
        id: `ai-act-${Date.now()}`,
        user: 'IA',
        action: 'creó la oportunidad desde el copiloto IA',
        time: 'Ahora',
      }],
      comments: [],
      results: { leads: 0, conversions: 0, revenue: 0 },
      area: opp.area || 'general',
      companyName: partnerName,
      fromAI: true,
    };

    if (onCreateOpportunity) {
      onCreateOpportunity(newOpportunity);
    }

    // Append workplace nav pill after a brief delay
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'workplace_nav' }]);
    }, 400);
  };

  const handleCancelAction = () => {
    setMessages((prev) => prev.filter((m) => m.type !== 'action_card'));
  };

  const handleVoice = () => {
    if (recording) return;
    setRecording(true);
    window.setTimeout(() => {
      const txt = VOICE_TEXTS[voiceIdx % VOICE_TEXTS.length];
      setVoiceIdx((i) => i + 1);
      setInput(txt);
      setRecording(false);
      inputRef.current?.focus();
    }, 1800);
  };

  const handleNewChat = () => {
    setMessages([{
      role: 'assistant',
      content: `${createWelcomeMessage(company.name)}\n\n${mode.welcomeHint}`,
    }]);
    setInput('');
  };

  const showEmpty = messages.length <= 1;

  return (
    <div className="flex h-full gap-3 overflow-hidden">

      {/* ── Sidebar (desktop always, mobile overlay) ── */}
      <div className="hidden md:flex">
        <ConversationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          currentId={activeConvId}
          onSelect={(id) => setActiveConvId(id)}
        />
      </div>

      {/* ── Chat column ── */}
      <div
        className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[22px]"
        style={{
          background: 'linear-gradient(170deg, rgba(248,250,252,0.97) 0%, rgba(241,245,249,0.97) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(20,30,48,0.08)',
          boxShadow: '0 4px 24px rgba(20,30,48,0.08)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-white hover:shadow-sm"
            >
              {sidebarOpen
                ? <ChevronLeft className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />}
            </button>
            <IaAvatar mode={mode} pulse />
            <div>
              <p className="font-['Space_Grotesk'] text-[15px] font-bold text-[#141E30]">Copiloto IA</p>
              <p className="text-[11px] text-slate-400">{mode.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Workplace shortcut */}
            {onNavigateToWorkplace && (
              <motion.button
                type="button"
                onClick={onNavigateToWorkplace}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[12px] font-semibold transition"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  color: '#059669',
                  border: '1px solid rgba(16,185,129,0.18)',
                }}
              >
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                Workplace
              </motion.button>
            )}
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-1.5 rounded-[10px] bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:shadow"
            >
              <Plus className="h-3.5 w-3.5" /> Nuevo
            </button>
          </div>
        </div>

        {/* ── Mode picker ── */}
        <IaModePicker mode={mode} setMode={setMode} />

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto py-3 [scrollbar-width:none]">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                mode={mode}
                onConfirm={handleConfirmAction}
                onCancelAction={handleCancelAction}
                onNavigateToWorkplace={onNavigateToWorkplace}
              />
            ))}
          </AnimatePresence>

          {loading && <TypingIndicator mode={mode} />}

          {/* Quick prompts — only when just welcome */}
          {showEmpty && !loading && (
            <QuickPromptGrid mode={mode} onSelect={sendMessage} />
          )}

          {/* Scale plan CTA — shown when not aiEnabled */}
          {!aiEnabled && showEmpty && <ScalePlanCard />}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="shrink-0 px-3 pb-3 pt-2">
          <div
            className="flex items-end gap-2 rounded-[20px] px-3 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(20,30,48,0.10)',
              boxShadow: '0 2px 12px rgba(20,30,48,0.08)',
            }}
          >
            {/* Voice button */}
            <motion.button
              type="button"
              onClick={handleVoice}
              disabled={loading}
              whileTap={{ scale: 0.9 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition"
              style={{
                background: recording ? 'rgba(239,68,68,0.12)' : 'rgba(20,30,48,0.05)',
                color: recording ? '#EF4444' : '#94A3B8',
              }}
            >
              <AnimatePresence mode="wait">
                {recording ? (
                  <motion.div key="rec" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                      <MicOff className="h-3.5 w-3.5" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Mic className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={recording ? '● Grabando…' : input}
              onChange={(e) => !recording && setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
              }}
              disabled={loading || recording}
              placeholder={`Escribí a tu copiloto ${mode.label.toLowerCase()}…`}
              rows={1}
              className="flex-1 resize-none bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              style={{ maxHeight: 120, lineHeight: '1.5' }}
            />

            {/* Send button */}
            <motion.button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || recording}
              whileTap={{ scale: 0.88 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition"
              style={{
                background: input.trim() && !loading
                  ? mode.gradient
                  : 'rgba(20,30,48,0.06)',
                boxShadow: input.trim() && !loading ? `0 4px 12px ${mode.glow}` : 'none',
                color: input.trim() && !loading ? 'white' : '#94A3B8',
              }}
            >
              <Send className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          {/* Mode hint */}
          <p className="mt-1.5 text-center text-[10px] text-slate-400">
            Modo <span className="font-semibold" style={{ color: mode.color }}>{mode.label}</span>
            {recording && <span className="ml-1.5 text-red-400">· Transcribiendo voz…</span>}
          </p>
        </div>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <ConversationSidebar
                open={true}
                onClose={() => setSidebarOpen(false)}
                onNewChat={() => { handleNewChat(); setSidebarOpen(false); }}
                currentId={activeConvId}
                onSelect={(id) => { setActiveConvId(id); setSidebarOpen(false); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AssistantView;
