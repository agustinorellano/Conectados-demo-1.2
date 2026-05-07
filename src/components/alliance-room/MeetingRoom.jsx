import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  Brain,
  ClipboardList,
  Calendar,
  Users,
  MoreHorizontal,
  PhoneOff,
  X,
  CameraOff,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ListTodo,
  Zap,
  TrendingUp,
  Handshake,
  Disc,
  Settings,
  Image,
  Flag,
  ChevronRight,
  Plus,
} from 'lucide-react';

// ─── Demo data ──────────────────────────────────────────────────────────────
const DEMO_PARTICIPANTS = [
  {
    id: 'me',
    name: 'Agustín Orellano',
    company: 'Top White',
    role: 'Founder & CEO',
    initials: 'AO',
    gradient: 'from-emerald-900/80 to-emerald-950',
    glow: 'rgba(34,197,94,0.5)',
    border: 'border-emerald-500',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/25',
    talkPct: 42,
    isMe: true,
    camOff: false,
  },
  {
    id: 'p1',
    name: 'Valentina Cruz',
    company: 'Bloom Florería',
    role: 'Directora General',
    initials: 'VC',
    gradient: 'from-pink-900/80 to-pink-950',
    glow: 'rgba(244,114,182,0.5)',
    border: 'border-pink-500',
    textColor: 'text-pink-400',
    badgeBg: 'bg-pink-500/15 border-pink-500/25',
    talkPct: 35,
    isMe: false,
    camOff: false,
  },
  {
    id: 'p2',
    name: 'Marcos Linares',
    company: 'Bloom Florería',
    role: 'Dir. de Marketing',
    initials: 'ML',
    gradient: 'from-blue-900/80 to-blue-950',
    glow: 'rgba(96,165,250,0.5)',
    border: 'border-blue-500',
    textColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/15 border-blue-500/25',
    talkPct: 23,
    isMe: false,
    camOff: true,
  },
];

const DEMO_AI_INSIGHTS = [
  { id: 1, type: 'opportunity', Icon: Lightbulb, text: 'Alta sinergia detectada en campaña cápsula. Potencial de co-inversión.', time: '03:22', color: 'emerald' },
  { id: 2, type: 'alert', Icon: AlertTriangle, text: 'Presupuesto mencionado 2 veces sin cifras concretas. Definir antes del cierre.', time: '08:44', color: 'amber' },
  { id: 3, type: 'agreement', Icon: Handshake, text: 'Acuerdo detectado: Presentar branding el lunes próximo.', time: '12:10', color: 'blue' },
  { id: 4, type: 'keyword', Icon: MessageSquare, text: '"Packaging colaborativo" mencionado 3 veces — tema de alto interés.', time: '16:55', color: 'violet' },
  { id: 5, type: 'task', Icon: ListTodo, text: 'Task sugerida: Cotizar packaging antes del viernes.', time: '19:30', color: 'pink' },
  { id: 6, type: 'opportunity', Icon: Zap, text: 'Momentum muy positivo. Score proyectado: 89/100.', time: '22:05', color: 'emerald' },
];

const DEMO_HIGHLIGHTS = [
  { time: '02:14', label: 'Campaña conjunta', color: 'emerald' },
  { time: '08:22', label: 'Acuerdo branding', color: 'blue' },
  { time: '14:55', label: 'Activación conjunta', color: 'violet' },
  { time: '22:10', label: 'Próxima reunión', color: 'pink' },
];

const DEMO_TASKS = [
  { id: 1, text: 'Enviar brief creativo', assignedTo: 'Top White', due: 'Lun 12 May', priority: 'alta', status: 'pendiente' },
  { id: 2, text: 'Confirmar fechas de activación', assignedTo: 'Bloom Florería', due: 'Mié 14 May', priority: 'media', status: 'en revision' },
  { id: 3, text: 'Aprobar presupuesto campaña', assignedTo: 'Top White', due: 'Vie 16 May', priority: 'alta', status: 'pendiente' },
  { id: 4, text: 'Cotizar packaging colaborativo', assignedTo: 'Bloom Florería', due: 'Próx. semana', priority: 'baja', status: 'pendiente' },
];

const AI_PULSES = [
  { emoji: '🔥', label: 'Alta compatibilidad', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { emoji: '📈', label: 'Interés creciendo', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { emoji: '🤝', label: 'Relación sólida', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function VideoTile({ participant, isSpeaking, isLarge }) {
  const sizeClass = isLarge ? 'h-full w-full' : 'h-full w-full';

  const colorMap = {
    'border-emerald-500': { glow: 'rgba(34,197,94,0.35)' },
    'border-pink-500': { glow: 'rgba(244,114,182,0.35)' },
    'border-blue-500': { glow: 'rgba(96,165,250,0.35)' },
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${participant.gradient} ${sizeClass} ${
        isSpeaking ? `ring-2 ${participant.border}` : 'ring-1 ring-white/[0.07]'
      }`}
      animate={
        isSpeaking
          ? { boxShadow: `0 0 28px 4px ${colorMap[participant.border]?.glow || participant.glow}` }
          : { boxShadow: '0 0 0px 0px transparent' }
      }
      transition={{ duration: 0.25 }}
    >
      {/* Noise/movement overlay when cam is on */}
      {!participant.camOff && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 40% 60%, ${participant.glow} 0%, transparent 60%)`,
          }}
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Camera off overlay */}
      {participant.camOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <CameraOff className="h-6 w-6 text-white/30" />
        </div>
      )}

      {/* Speaking wave bars (top-left) */}
      {isSpeaking && (
        <div className="absolute left-3 top-3 flex items-end gap-[3px]">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-white/70"
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              style={{ height: 14, transformOrigin: 'bottom' }}
            />
          ))}
        </div>
      )}

      {/* Mic icon top-right */}
      <div className="absolute right-3 top-3">
        <Mic className="h-3.5 w-3.5 text-white/40" />
      </div>

      {/* Center initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full font-bold text-white/90"
          style={{
            background: `radial-gradient(circle, ${participant.glow} 0%, transparent 70%)`,
            fontSize: 20,
          }}
        >
          {participant.initials}
        </div>
      </div>

      {/* Bottom gradient + name + badge */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
        <p className="text-xs font-semibold text-white/90">{participant.name}</p>
        <span className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${participant.badgeBg} ${participant.textColor}`}>
          {participant.company}
        </span>
      </div>
    </motion.div>
  );
}

function ToolbarBtn({ icon: Icon, label, onClick, active, variant = 'default' }) {
  const [showTip, setShowTip] = useState(false);

  const variantClass = {
    default: active
      ? 'bg-white/15 text-white'
      : 'text-white/50 hover:bg-white/10 hover:text-white',
    danger: 'bg-red-500/80 text-white hover:bg-red-500',
    accent: 'text-amber-400 hover:bg-amber-500/10',
    violet: 'text-violet-400 hover:bg-violet-500/10',
    screen: 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
  }[variant];

  return (
    <motion.button
      className={`relative flex h-10 w-10 items-center justify-center rounded-[14px] transition-colors ${variantClass}`}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      type="button"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-[10px] text-white/80"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function MeetingToolbar({ state, onToggle, onAction, onEnd, onMore, timer }) {
  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="flex h-[72px] shrink-0 items-center justify-between border-t border-white/[0.07] bg-[#080C12]/90 px-5 backdrop-blur" onClick={(e) => e.stopPropagation()}>
      {/* Left: live indicator + timer */}
      <div className="flex w-36 items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
        <span className="text-[11px] font-semibold text-white/50">
          {state.isRecording ? 'Grabando' : 'En vivo'}
        </span>
        <span className="font-mono text-sm font-bold text-white/80">{fmt(timer)}</span>
      </div>

      {/* Center buttons */}
      <div className="flex items-center gap-1.5">
        <ToolbarBtn
          icon={state.micOn ? Mic : MicOff}
          label={state.micOn ? 'Silenciar' : 'Activar mic'}
          active={state.micOn}
          onClick={() => onToggle('micOn')}
        />
        <ToolbarBtn
          icon={state.camOn ? Video : VideoOff}
          label={state.camOn ? 'Apagar cámara' : 'Encender cámara'}
          active={state.camOn}
          onClick={() => onToggle('camOn')}
        />
        <ToolbarBtn
          icon={Monitor}
          label={state.screenSharing ? 'Dejar de compartir' : 'Compartir pantalla'}
          active={state.screenSharing}
          variant={state.screenSharing ? 'screen' : 'default'}
          onClick={() => onToggle('screenSharing')}
        />
        <ToolbarBtn
          icon={Hand}
          label="Levantar mano"
          active={state.handRaised}
          variant={state.handRaised ? 'accent' : 'default'}
          onClick={() => onToggle('handRaised')}
        />
        <div className="mx-1 h-6 w-px bg-white/[0.08]" />
        <ToolbarBtn
          icon={Brain}
          label="Notes IA"
          active={state.aiNotesOn}
          variant={state.aiNotesOn ? 'violet' : 'default'}
          onClick={() => onToggle('aiNotesOn')}
        />
        <ToolbarBtn
          icon={ClipboardList}
          label="Tasks"
          active={state.sidePanel === 'tasks'}
          onClick={() => onAction('tasks')}
        />
        <ToolbarBtn
          icon={Calendar}
          label="Agendar follow-up"
          active={state.sidePanel === 'schedule'}
          onClick={() => onAction('schedule')}
        />
        <ToolbarBtn
          icon={Users}
          label="Participantes"
          active={state.sidePanel === 'participants'}
          onClick={() => onAction('participants')}
        />
        <ToolbarBtn
          icon={MoreHorizontal}
          label="Más opciones"
          active={state.showMoreMenu}
          onClick={onMore}
        />
      </div>

      {/* Right: end button */}
      <div className="flex w-36 justify-end">
        <motion.button
          className="flex items-center gap-2 rounded-[14px] bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
          whileTap={{ scale: 0.95 }}
          onClick={onEnd}
          type="button"
        >
          <PhoneOff className="h-3.5 w-3.5" />
          Finalizar
        </motion.button>
      </div>
    </div>
  );
}

const insightColor = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
};

function AINotesPanel({ insights, highlights, tasks, activeSubPanel, onSubPanel }) {
  return (
    <motion.div
      className="flex w-80 shrink-0 flex-col border-l border-white/[0.07] bg-[#0A0E16]"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <Brain className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-semibold text-white/80">Notes IA</span>
        <span className="relative ml-auto flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.07]">
        {['insights', 'highlights', 'tasks'].map((tab) => (
          <button
            key={tab}
            onClick={() => onSubPanel(tab)}
            type="button"
            className={`flex-1 py-2.5 text-[11px] font-semibold capitalize transition-colors ${
              activeSubPanel === tab
                ? 'border-b-2 border-violet-400 text-violet-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeSubPanel === 'insights' && (
          <AnimatePresence initial={false}>
            <div className="space-y-2">
              {insights.map((ins) => {
                const Icon = ins.Icon;
                const c = insightColor[ins.color] || insightColor.emerald;
                return (
                  <motion.div
                    key={ins.id}
                    className={`rounded-[14px] border p-3 ${c}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <p className="text-[11px] leading-relaxed">{ins.text}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] opacity-60">{ins.time}</span>
                      <div className="flex gap-1.5">
                        <button className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60 hover:text-white/90" type="button">
                          Guardar
                        </button>
                        <button className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60 hover:text-white/90" type="button">
                          Task
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {activeSubPanel === 'highlights' && (
          <div className="space-y-2">
            {highlights.map((hl, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-[14px] border px-3 py-2.5 ${insightColor[hl.color] || insightColor.emerald}`}
              >
                <span className="font-mono text-xs font-bold">{hl.time}</span>
                <span className="text-[11px]">{hl.label}</span>
              </div>
            ))}
          </div>
        )}

        {activeSubPanel === 'tasks' && (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-[14px] border border-white/[0.07] bg-white/[0.04] p-3">
                <p className="text-[11px] font-semibold text-white/80">{task.text}</p>
                <p className="mt-0.5 text-[10px] text-white/40">{task.assignedTo} · {task.due}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Suggestion footer */}
      <div className="border-t border-white/[0.07] p-3">
        <div className="rounded-[14px] border border-violet-500/20 bg-violet-500/10 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-400">
            Sugerencia IA
          </p>
          <p className="mt-1 text-[11px] text-violet-300/80">
            Todavía no se habló de timeline. Considera mencionarlo antes de cerrar.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ParticipantsPanel({ participants, speakingId }) {
  return (
    <motion.div
      className="flex w-72 shrink-0 flex-col border-l border-white/[0.07] bg-[#0A0E16]"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <Users className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-white/80">Participantes</span>
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">
          {participants.length}
        </span>
      </div>

      {/* Participant rows */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {participants.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors ${
              speakingId === p.id ? 'bg-white/[0.06]' : 'bg-white/[0.03]'
            }`}
          >
            {/* Avatar */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-xs font-bold bg-gradient-to-br ${p.gradient} ${p.textColor}`}>
              {p.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/80">{p.name}</p>
              <p className="text-[10px] text-white/40">{p.role}</p>
            </div>
            {speakingId === p.id && (
              <div className="flex items-end gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] rounded-full bg-emerald-400"
                    animate={{ scaleY: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.55, delay: i * 0.12, repeat: Infinity }}
                    style={{ height: 10, transformOrigin: 'bottom' }}
                  />
                ))}
              </div>
            )}
            <Mic className="h-3 w-3 text-white/30" />
          </div>
        ))}
      </div>

      {/* Talk time bars */}
      <div className="border-t border-white/[0.07] p-4 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Tiempo de habla
        </p>
        {participants.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="w-6 text-[10px] font-bold shrink-0 text-white/40">
              {p.initials[0]}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${p.textColor.replace('text-', 'bg-').replace('-400', '-400')}`}
                initial={{ width: 0 }}
                animate={{ width: `${p.talkPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ backgroundColor: p.id === 'me' ? 'rgb(52,211,153)' : p.id === 'p1' ? 'rgb(244,114,182)' : 'rgb(96,165,250)' }}
              />
            </div>
            <span className="w-8 text-right text-[10px] text-white/40">{p.talkPct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TasksPanel({ tasks }) {
  const statusStyle = {
    pendiente: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    'en revision': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    bloqueado: 'bg-red-500/10 border-red-500/20 text-red-400',
    completado: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };
  const priorityStyle = {
    alta: 'text-red-400',
    media: 'text-amber-400',
    baja: 'text-slate-400',
  };

  return (
    <motion.div
      className="flex w-80 shrink-0 flex-col border-l border-white/[0.07] bg-[#0A0E16]"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <ClipboardList className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-semibold text-white/80">Alliance Tasks</span>
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-[10px] font-bold text-amber-400">
          {tasks.length}
        </span>
      </div>

      {/* Task cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-[14px] border border-white/[0.07] bg-white/[0.04] p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold leading-relaxed text-white/80">{task.text}</p>
              <span className={`shrink-0 text-[10px] font-bold ${priorityStyle[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-white/40">{task.assignedTo}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-white/30">{task.due}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyle[task.status] || statusStyle.pendiente}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.07] p-3">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/[0.07] bg-white/[0.04] py-2.5 text-[11px] font-semibold text-white/50 transition hover:bg-white/[0.07] hover:text-white/80"
          type="button"
        >
          + Crear nueva task
        </button>
      </div>
    </motion.div>
  );
}

// ─── SchedulePanel ───────────────────────────────────────────────────────────
const FOLLOW_UP_OPTIONS = [
  { id: 1, label: 'Mié 14 May', time: '10:00 — 11:00', type: 'Video', note: 'En 8 días' },
  { id: 2, label: 'Vie 16 May', time: '15:00 — 16:00', type: 'Video', note: 'En 10 días' },
  { id: 3, label: 'Lun 19 May', time: '09:00 — 10:00', type: 'Presencial', note: 'En 13 días' },
];

function SchedulePanel({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setTimeout(onClose, 2000);
  };

  return (
    <motion.div
      className="flex w-80 shrink-0 flex-col border-l border-white/[0.07] bg-[#0A0E16]"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <Calendar className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-white/80">Agendar Follow-up</span>
        <button
          className="ml-auto text-white/30 hover:text-white/60 transition-colors"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Context */}
      <div className="border-b border-white/[0.07] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Alianza activa
        </p>
        <p className="mt-1 text-xs font-semibold text-white/70">Top White × Bloom Florería</p>
        <p className="mt-0.5 text-[10px] text-white/40">Reunión #07 en curso · Score 84/100</p>
      </div>

      {/* Options */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Horarios sugeridos por IA
        </p>
        {FOLLOW_UP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            type="button"
            className={`w-full rounded-[14px] border p-3 text-left transition-all ${
              selected === opt.id
                ? 'border-blue-500/40 bg-blue-500/10'
                : 'border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">{opt.label}</span>
              <span className="text-[10px] text-white/40">{opt.note}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-white/50">{opt.time} · {opt.type}</p>
            {selected === opt.id && (
              <div className="mt-1.5 flex items-center gap-1 text-blue-400">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[10px] font-semibold">Seleccionado</span>
              </div>
            )}
          </button>
        ))}

        {/* Custom */}
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-[14px] border border-dashed border-white/[0.10] py-2.5 px-3 text-[11px] text-white/40 hover:text-white/60 hover:border-white/20 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Elegir otra fecha
        </button>
      </div>

      {/* Confirm */}
      <div className="border-t border-white/[0.07] p-3">
        {confirmed ? (
          <div className="flex items-center justify-center gap-2 rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">¡Reunión agendada!</span>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            type="button"
            className={`flex w-full items-center justify-center gap-2 rounded-[14px] py-2.5 text-xs font-bold transition-all ${
              selected
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Confirmar follow-up
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── MoreMenu ─────────────────────────────────────────────────────────────────
function MoreMenu({ isRecording, onToggleRecording, onToast, onClose }) {
  const items = [
    {
      icon: isRecording ? Disc : Disc,
      label: isRecording ? 'Detener grabación' : 'Grabar reunión',
      color: isRecording ? 'text-red-400' : 'text-white/60',
      bg: isRecording ? 'bg-red-500/10 border-red-500/20' : 'bg-white/[0.04] border-white/[0.07]',
      action: () => { onToggleRecording(); onClose(); },
    },
    {
      icon: Image,
      label: 'Cambiar fondo',
      color: 'text-white/60',
      bg: 'bg-white/[0.04] border-white/[0.07]',
      action: () => { onToast('Fondos no disponibles en demo'); onClose(); },
    },
    {
      icon: Settings,
      label: 'Configuración de audio',
      color: 'text-white/60',
      bg: 'bg-white/[0.04] border-white/[0.07]',
      action: () => { onToast('Abre Configuración → Audio'); onClose(); },
    },
    {
      icon: Flag,
      label: 'Reportar problema',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      action: () => { onToast('Reporte enviado. Gracias.'); onClose(); },
    },
  ];

  return (
    <motion.div
      className="absolute bottom-[80px] right-4 z-[200] w-56 rounded-[18px] border border-white/[0.10] bg-[#0D1117] p-1.5 shadow-2xl"
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={item.action}
            type="button"
            className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] ${item.bg}`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${item.color}`} />
            <span className={`text-[12px] font-semibold ${item.color}`}>{item.label}</span>
            {item.label.includes('Grabar') && (
              <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <motion.div
      className="pointer-events-none fixed bottom-24 left-1/2 z-[300] -translate-x-1/2 rounded-[14px] border border-white/[0.12] bg-[#0D1117]/95 px-4 py-2.5 text-xs font-semibold text-white/80 shadow-2xl backdrop-blur"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
    >
      {message}
    </motion.div>
  );
}

// ─── Main MeetingRoom ────────────────────────────────────────────────────────
export default function MeetingRoom({ alliance, onEnd }) {
  const [speakingId, setSpeakingId] = useState(null);
  const [visibleInsights, setVisibleInsights] = useState(DEMO_AI_INSIGHTS.slice(0, 2));
  const [mtgState, setMtgState] = useState({
    micOn: true,
    camOn: true,
    isRecording: false,
    aiNotesOn: false,
    handRaised: false,
    screenSharing: false,
    sidePanel: null,
  });
  const [subPanel, setSubPanel] = useState('insights');
  const [aiPulseIdx, setAiPulseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(1458); // ~24:18
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [toast, setToast] = useState(null);

  const speakTimerRef = useRef(null);
  const insightTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Speaking simulation
  const runSpeaker = useCallback(() => {
    const ids = DEMO_PARTICIPANTS.map((p) => p.id);
    const id = ids[Math.floor(Math.random() * ids.length)];
    setSpeakingId(id);
    const speakDur = 1800 + Math.random() * 2200;
    speakTimerRef.current = setTimeout(() => {
      setSpeakingId(null);
      const pauseDur = 400 + Math.random() * 1200;
      speakTimerRef.current = setTimeout(runSpeaker, pauseDur);
    }, speakDur);
  }, []);

  useEffect(() => {
    runSpeaker();
    return () => clearTimeout(speakTimerRef.current);
  }, [runSpeaker]);

  // AI insights when panel open
  useEffect(() => {
    if (!mtgState.aiNotesOn) return;
    insightTimerRef.current = setInterval(() => {
      setVisibleInsights((prev) => {
        const nextIdx = prev.length;
        if (nextIdx >= DEMO_AI_INSIGHTS.length) return prev;
        return [...prev, DEMO_AI_INSIGHTS[nextIdx]];
      });
    }, 12000);
    return () => clearInterval(insightTimerRef.current);
  }, [mtgState.aiNotesOn]);

  // AI pulse rotation
  useEffect(() => {
    pulseTimerRef.current = setInterval(() => {
      setAiPulseIdx((i) => (i + 1) % AI_PULSES.length);
    }, 5000);
    return () => clearInterval(pulseTimerRef.current);
  }, []);

  const toggleState = (key) => {
    setMtgState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleAction = (panel) => {
    setMtgState((prev) => ({
      ...prev,
      sidePanel: prev.sidePanel === panel ? null : panel,
      aiNotesOn: panel === 'notes' ? !prev.aiNotesOn : prev.aiNotesOn,
    }));
  };

  const handleToolbarToggle = (key) => {
    if (key === 'aiNotesOn') {
      setMtgState((prev) => ({
        ...prev,
        aiNotesOn: !prev.aiNotesOn,
        sidePanel: !prev.aiNotesOn ? 'notes' : prev.sidePanel === 'notes' ? null : prev.sidePanel,
      }));
    } else if (key === 'screenSharing') {
      setMtgState((prev) => {
        const next = !prev.screenSharing;
        showToast(next ? 'Compartiendo pantalla' : 'Dejaste de compartir pantalla');
        return { ...prev, screenSharing: next };
      });
    } else {
      toggleState(key);
    }
  };

  const handleToolbarAction = (panel) => {
    setMtgState((prev) => ({
      ...prev,
      sidePanel: prev.sidePanel === panel ? null : panel,
    }));
  };

  const pulse = AI_PULSES[aiPulseIdx];
  const otherParticipants = DEMO_PARTICIPANTS.filter((p) => !p.isMe);
  const me = DEMO_PARTICIPANTS.find((p) => p.isMe);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ backgroundColor: '#080C12' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => showMoreMenu && setShowMoreMenu(false)}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-emerald-500/15 text-[10px] font-bold text-emerald-400">
              TW
            </div>
            <X className="h-3 w-3 text-white/30" />
            <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-pink-500/15 text-[10px] font-bold text-pink-400">
              BF
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70">
              {alliance.myCompany.name} × {alliance.theirCompany.name}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            LIVE
          </span>
        </div>

        {/* Center: timer + AI pulse */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-white/60">{fmt(elapsed)}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={aiPulseIdx}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${pulse.color}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {pulse.emoji} {pulse.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {mtgState.screenSharing && (
            <motion.span
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Monitor className="h-3 w-3" />
              Compartiendo pantalla
            </motion.span>
          )}
          {mtgState.isRecording && (
            <motion.span
              className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Disc className="h-3 w-3" />
              Grabando
            </motion.span>
          )}
          {mtgState.aiNotesOn && (
            <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-400">
              Notes IA activas
            </span>
          )}
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
            Participación alta
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Other participants (top) */}
          <div className="flex flex-1 gap-3">
            {otherParticipants.map((p) => (
              <div key={p.id} className="flex-1">
                <VideoTile
                  participant={p}
                  isSpeaking={speakingId === p.id}
                  isLarge={false}
                />
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex h-36 gap-3">
            {/* My tile */}
            <div className="w-56 shrink-0">
              <VideoTile
                participant={me}
                isSpeaking={speakingId === me.id}
                isLarge={false}
              />
            </div>

            {/* Energy card */}
            <div className="flex flex-1 flex-col justify-between rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Meeting Energy
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Engagement', pct: 82, color: 'bg-emerald-400' },
                  { label: 'Participación', pct: 74, color: 'bg-blue-400' },
                  { label: 'Actividad', pct: 91, color: 'bg-violet-400' },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-2">
                    <span className="w-20 text-[10px] text-white/40">{bar.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${bar.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] text-white/40">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side panels */}
        <AnimatePresence mode="wait">
          {mtgState.sidePanel === 'notes' && (
            <AINotesPanel
              key="notes"
              insights={visibleInsights}
              highlights={DEMO_HIGHLIGHTS}
              tasks={DEMO_TASKS}
              activeSubPanel={subPanel}
              onSubPanel={setSubPanel}
            />
          )}
          {mtgState.sidePanel === 'participants' && (
            <ParticipantsPanel
              key="participants"
              participants={DEMO_PARTICIPANTS}
              speakingId={speakingId}
            />
          )}
          {mtgState.sidePanel === 'tasks' && (
            <TasksPanel key="tasks" tasks={DEMO_TASKS} />
          )}
          {mtgState.sidePanel === 'schedule' && (
            <SchedulePanel
              key="schedule"
              onClose={() => handleToolbarAction('schedule')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* More menu */}
      <AnimatePresence>
        {showMoreMenu && (
          <MoreMenu
            isRecording={mtgState.isRecording}
            onToggleRecording={() => {
              setMtgState((prev) => ({ ...prev, isRecording: !prev.isRecording }));
              showToast(mtgState.isRecording ? 'Grabación detenida' : 'Grabando reunión…');
            }}
            onToast={showToast}
            onClose={() => setShowMoreMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <MeetingToolbar
        state={{ ...mtgState, showMoreMenu }}
        onToggle={handleToolbarToggle}
        onAction={handleToolbarAction}
        onEnd={onEnd}
        onMore={() => setShowMoreMenu((v) => !v)}
        timer={elapsed}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key={toast} message={toast} />}
      </AnimatePresence>
    </motion.div>
  );
}
