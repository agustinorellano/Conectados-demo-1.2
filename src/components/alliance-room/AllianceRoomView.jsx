import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  ClipboardList,
  Target,
  Zap,
} from 'lucide-react';
import MeetingRoom from './MeetingRoom';
import PostMeetingView from './PostMeetingView';

// ─── Demo data ──────────────────────────────────────────────────────────────
export const DEMO_ALLIANCE = {
  myCompany: { name: 'Top White', initials: 'TW' },
  theirCompany: { name: 'Bloom Florería', initials: 'BF' },
  meetingNumber: 7,
  lastMeeting: '14 días',
  relationshipTime: '3 meses',
  allianceScore: 84,
  objectives: ['Campaña cápsula primavera', 'Bundle florería × moda'],
  pendingTasks: 4,
  pastMeetings: [
    { id: 1, date: '22 Abr 2026', duration: '48 min', score: 91, summary: 'Kick-off alianza. Alineamos objetivos Q2 y definimos audiencias.' },
    { id: 2, date: '29 Abr 2026', duration: '35 min', score: 78, summary: 'Revisión propuesta campaña primavera. Pendiente aprobación.' },
    { id: 3, date: '6 May 2026', duration: '52 min', score: 88, summary: 'Cierre propuesta branding. Definición de timelines y KPIs.' },
  ],
  openTasks: [
    { id: 1, text: 'Enviar brief creativo', assignedTo: 'Top White', due: 'Lun 12 May', priority: 'alta', status: 'pendiente' },
    { id: 2, text: 'Confirmar fechas de activación', assignedTo: 'Bloom Florería', due: 'Mié 14 May', priority: 'media', status: 'en revision' },
    { id: 3, text: 'Aprobar presupuesto campaña', assignedTo: 'Top White', due: 'Vie 16 May', priority: 'alta', status: 'pendiente' },
    { id: 4, text: 'Cotizar packaging colaborativo', assignedTo: 'Bloom Florería', due: 'Próx. semana', priority: 'baja', status: 'pendiente' },
  ],
};

// ─── CinematicIntro ──────────────────────────────────────────────────────────
function CinematicIntro({ alliance, onDone }) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());
  const DURATION = 4200;

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        clearInterval(id);
        onDone();
      }
    }, 30);
    return () => clearInterval(id);
  }, [onDone]);

  const chips = [
    `#0${alliance.meetingNumber}`,
    alliance.lastMeeting,
    alliance.relationshipTime,
    `${alliance.allianceScore}/100`,
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#080C12' }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45 }}
    >
      {/* Grid lines overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute left-[-10%] top-1/3 h-[400px] w-[400px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.4), transparent 70%)', filter: 'blur(140px)' }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-1/3 h-[400px] w-[400px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.4), transparent 70%)', filter: 'blur(140px)' }}
      />

      {/* Meeting label */}
      <motion.p
        className="absolute top-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        #0{alliance.meetingNumber} · Alliance Room
      </motion.p>

      {/* Logo row */}
      <div className="relative flex items-center gap-0">
        {/* TW logo */}
        <motion.div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-emerald-500/15 text-lg font-bold text-emerald-400 ring-1 ring-emerald-500/30"
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
        >
          {alliance.myCompany.initials}
        </motion.div>

        {/* Connecting line + dot */}
        <div className="relative mx-4 h-px w-28 bg-white/10">
          <motion.div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          />
        </div>

        {/* × icon */}
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <X className="h-3.5 w-3.5" />
        </motion.div>

        {/* Connecting line + dot */}
        <div className="relative mx-4 h-px w-28 bg-white/10">
          <motion.div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
            animate={{ left: ['100%', '0%'] }}
            transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          />
        </div>

        {/* BF logo */}
        <motion.div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-pink-500/15 text-lg font-bold text-pink-400 ring-1 ring-pink-500/30"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
        >
          {alliance.theirCompany.initials}
        </motion.div>
      </div>

      {/* Alliance name */}
      <motion.h1
        className="mt-8 text-center text-2xl font-bold tracking-tight text-white/90"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {alliance.myCompany.name} × {alliance.theirCompany.name}
      </motion.h1>

      {/* Stat chips */}
      <motion.div
        className="mt-5 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {chips.map((chip, i) => (
          <span
            key={i}
            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/60"
          >
            {chip}
          </span>
        ))}
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-10 left-1/2 w-64 -translate-x-1/2">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-white/60"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-[10px] text-white/30">Preparando reunión…</p>
      </div>
    </motion.div>
  );
}

// ─── PreRoomBriefing ─────────────────────────────────────────────────────────
function PreRoomBriefing({ alliance, onEnter }) {
  const statCards = [
    {
      label: 'Score alianza',
      value: `${alliance.allianceScore}/100`,
      sub: 'Excelente momentum',
      color: 'emerald',
      icon: Star,
    },
    {
      label: 'Última reunión',
      value: alliance.lastMeeting,
      sub: 'hace ' + alliance.lastMeeting,
      color: 'blue',
      icon: Clock,
    },
    {
      label: 'Relación comercial',
      value: alliance.relationshipTime,
      sub: 'Tiempo activo',
      color: 'violet',
      icon: Calendar,
    },
    {
      label: 'Tasks pendientes',
      value: alliance.pendingTasks,
      sub: 'Requieren atención',
      color: 'amber',
      icon: ClipboardList,
    },
  ];

  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      icon: 'text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: 'text-blue-400',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      icon: 'text-violet-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      icon: 'text-amber-400',
    },
  };

  const scoreColor = (s) => {
    if (s >= 85) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25';
    if (s >= 70) return 'text-blue-400 bg-blue-500/15 border-blue-500/25';
    return 'text-amber-400 bg-amber-500/15 border-amber-500/25';
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col overflow-y-auto"
      style={{ backgroundColor: '#080C12' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-10">
        {/* Header row */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-500/15 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/25">
              {alliance.myCompany.initials}
            </div>
            <X className="h-3.5 w-3.5 text-white/30" />
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-pink-500/15 text-sm font-bold text-pink-400 ring-1 ring-pink-500/25">
              {alliance.theirCompany.initials}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Reunión #{String(alliance.meetingNumber).padStart(2, '0')}
            </p>
            <h2 className="text-base font-bold text-white/90">
              {alliance.myCompany.name} × {alliance.theirCompany.name}
            </h2>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map((card, i) => {
            const c = colorMap[card.color];
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                className={`rounded-[18px] border p-4 ${c.bg} ${c.border}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Icon className={`h-4 w-4 ${c.icon}`} />
                <p className="mt-3 text-[11px] text-white/40">{card.label}</p>
                <p className={`mt-0.5 text-xl font-bold ${c.text}`}>{card.value}</p>
                <p className="mt-0.5 text-[10px] text-white/30">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Two-col grid */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Objetivos Activos */}
          <motion.div
            className="rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-emerald-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Objetivos Activos
              </p>
            </div>
            <div className="space-y-2">
              {alliance.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-[12px] bg-white/[0.04] px-3 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm text-white/80">{obj}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tasks Abiertas */}
          <motion.div
            className="rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Tasks Abiertas
              </p>
            </div>
            <div className="space-y-2">
              {alliance.openTasks.map((task) => {
                const priorityColor = task.priority === 'alta'
                  ? 'text-red-400 bg-red-500/10 border-red-500/20'
                  : task.priority === 'media'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : 'text-slate-400 bg-white/[0.04] border-white/10';
                return (
                  <div key={task.id} className="flex items-center gap-2.5 rounded-[12px] bg-white/[0.04] px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white/80">{task.text}</p>
                      <p className="text-[10px] text-white/40">{task.assignedTo} · {task.due}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityColor}`}>
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Reuniones Anteriores */}
        <motion.div
          className="mt-5 rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Reuniones Anteriores
            </p>
          </div>
          <div className="space-y-3">
            {alliance.pastMeetings.map((mtg, i) => (
              <div key={mtg.id} className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                  {i < alliance.pastMeetings.length - 1 && (
                    <div className="h-10 w-px bg-white/10" />
                  )}
                </div>
                <div className="min-w-0 flex-1 rounded-[14px] bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/70">{mtg.date}</span>
                      <span className="text-[10px] text-white/30">·</span>
                      <span className="text-[10px] text-white/40">{mtg.duration}</span>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${scoreColor(mtg.score)}`}>
                      {mtg.score}/100
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{mtg.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[20px] px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
            }}
            type="button"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Entrar a la Alliance Room
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function AllianceRoomView({ onExit }) {
  // stage: 'cinematic' | 'preroom' | 'meeting' | 'postmeeting'
  const [stage, setStage] = useState('cinematic');

  return (
    <AnimatePresence mode="wait">
      {stage === 'cinematic' && (
        <CinematicIntro
          key="cinematic"
          alliance={DEMO_ALLIANCE}
          onDone={() => setStage('preroom')}
        />
      )}
      {stage === 'preroom' && (
        <PreRoomBriefing
          key="preroom"
          alliance={DEMO_ALLIANCE}
          onEnter={() => setStage('meeting')}
        />
      )}
      {stage === 'meeting' && (
        <MeetingRoom
          key="meeting"
          alliance={DEMO_ALLIANCE}
          onEnd={() => setStage('postmeeting')}
        />
      )}
      {stage === 'postmeeting' && (
        <PostMeetingView
          key="postmeeting"
          alliance={DEMO_ALLIANCE}
          onClose={onExit}
        />
      )}
    </AnimatePresence>
  );
}
