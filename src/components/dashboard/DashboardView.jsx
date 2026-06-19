import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const NOTIFICATIONS = [
  { id: 1, text: 'Nuevo match con Bloom Florería', sub: 'Score 94% · hace 2 min', dot: '#10B981', unread: true },
  { id: 2, text: 'Luna Beauty respondió tu propuesta', sub: 'hace 15 min', dot: '#3B82F6', unread: true },
  { id: 3, text: 'Alliance Room disponible', sub: 'Bloom · hace 1h', dot: '#8B5CF6', unread: false },
];

const ALLIANCE_NOTES = [
  {
    id: 1, date: '6 May 2026', company: 'Bloom Florería', duration: '52 min',
    score: 88, agreements: 3, tasks: 4, momentum: 'Alto', momentumColor: 'emerald',
    summary: 'Cierre propuesta branding. Se alinearon timelines y KPIs.',
    agreementList: ['Presentar branding el lunes', 'Cotizar packaging', 'Reunión cierre en 2 semanas'],
  },
  {
    id: 2, date: '29 Abr 2026', company: 'Bloom Florería', duration: '35 min',
    score: 78, agreements: 1, tasks: 2, momentum: 'Medio', momentumColor: 'amber',
    summary: 'Revisión propuesta campaña primavera. Pendiente aprobación de presupuesto.',
    agreementList: ['Revisar propuesta final antes del lunes'],
  },
  {
    id: 3, date: '22 Abr 2026', company: 'Bloom Florería', duration: '48 min',
    score: 91, agreements: 4, tasks: 3, momentum: 'Alto', momentumColor: 'emerald',
    summary: 'Kick-off alianza. Alineamos objetivos Q2 y definimos audiencias target.',
    agreementList: ['Definir audiencias Q2', 'Alinear paleta visual', 'Compartir assets de marca', 'Reunión semanal fija'],
  },
];

const PIPELINE = [
  { stage: 'Exploración', count: 5, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  { stage: 'Propuesta',   count: 3, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  { stage: 'Negociación', count: 2, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  { stage: 'Activa',      count: 12, color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { stage: 'Cerrada',     count: 10, color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
];

const RECENT_ACTIVITY = [
  { id: 1, text: 'Luna Beauty respondió tu propuesta', time: 'hace 15 min', dot: '#3B82F6', icon: MessageSquare },
  { id: 2, text: 'Nuevo match: Café Patio · 94%', time: 'hace 2h', dot: '#10B981', icon: Zap },
  { id: 3, text: 'Bloom Florería confirmó reunión de cierre', time: 'hace 3h', dot: '#8B5CF6', icon: Check },
  { id: 4, text: 'Core Wellness vio tu perfil', time: 'hace 5h', dot: '#F59E0B', icon: ArrowRight },
];

const UPCOMING_MEETINGS = [
  { id: 1, company: 'Bloom Florería', time: 'Hoy · 15:00 hs', tasks: ['Presentar branding', 'Cotizar packaging'], isToday: true },
  { id: 2, company: 'Sushi Nakama', time: 'Mañana · 11:00 hs', tasks: ['Revisar canje gastronómico'], isToday: false },
  { id: 3, company: 'Luna Beauty', time: 'Jue · 10:00 hs', tasks: ['Cierre propuesta P/V', 'Confirmar presupuesto'], isToday: false },
];

const metricCards = [
  { key: 'active',  label: 'Alianzas activas',   value: 12, trend: '+2 esta semana',    trendUp: true  },
  { key: 'closed',  label: 'Acuerdos cerrados',  value: 10, trend: '3 este mes',        trendUp: true  },
  { key: 'pending', label: 'En negociación',      value: 2,  trend: 'Requieren acción',  trendUp: false },
  { key: 'total',   label: 'Alianzas totales',   value: 24, trend: '+18% vs anterior',  trendUp: true  },
];

const initialReminders = [
  { id: 1, text: 'Seguimiento con Luna Beauty', sub: '2 días sin respuesta — alta prioridad', done: false },
  { id: 2, text: 'Reunión Bloom Florería', sub: 'Hoy a las 15:00 hs', done: false },
  { id: 3, text: 'Propuesta pendiente — Sushi Nakama', sub: 'Enviada hace 3 días, sin respuesta', done: false },
];

const teamCollab = [
  { id: 1, name: 'Bloom Florería', initials: 'BF', task: 'Campaña cápsula de temporada — local + redes sociales', status: 'Acuerdo Cerrado', statusTone: 'emerald' },
  { id: 2, name: 'Sushi Nakama',   initials: 'SN', task: 'Canje gastronómico — beneficio cruzado entre marcas',  status: 'En Progreso',    statusTone: 'blue'    },
  { id: 3, name: 'Luna Beauty',    initials: 'LB', task: 'Colección cápsula Primavera / Verano con activación',  status: 'En Progreso',    statusTone: 'blue'    },
  { id: 4, name: 'Core Wellness',  initials: 'CW', task: 'Cross-promo mensual en redes y newsletter compartido', status: 'Pendiente',      statusTone: 'amber'   },
];

const statusStyle = {
  emerald: 'bg-emerald-400/15 border-emerald-400/25 text-emerald-300',
  blue:    'bg-blue-400/15 border-blue-400/25 text-blue-300',
  amber:   'bg-amber-400/15 border-amber-400/25 text-amber-300',
};

const scoreStyle = (s) =>
  s >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
  : s >= 70 ? 'text-blue-700 bg-blue-50 border-blue-100'
  : 'text-amber-700 bg-amber-50 border-amber-100';

const momentumStyle = {
  emerald: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  amber:   'text-amber-700 bg-amber-50 border-amber-100',
};

const CARD = {
  background: 'rgba(20,30,48,0.95)',
  border: '1px solid rgba(255,255,255,0.07)',
};

function DashboardView({ dashboardData, meetings = [], onAreaSelect, onOpenAssistant, onOpenAlliances, onOpenAllianceRoom, onNavigateToChats, onToggleMeeting, userPlan }) {
  const { t } = useTheme();
  const [reminders, setReminders]   = useState(initialReminders);
  const [expandedNote, setExpandedNote] = useState(null);
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [readIds,   setReadIds]     = useState(new Set());

  const pendingCount  = reminders.filter(r => !r.done).length;
  const unreadCount   = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;
  const toggleReminder = (id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  const resolveAll    = () => setReminders(prev => prev.map(r => ({ ...r, done: true })));
  const openNotif     = () => { setNotifOpen(true); setReadIds(new Set(NOTIFICATIONS.map(n => n.id))); };
  const companyName   = dashboardData?.commerce?.name ?? 'Mi empresa';

  return (
    <div className="h-full overflow-y-auto [scrollbar-width:none]" style={{ background: t.bg, transition: 'background 0.3s ease' }}>

      {/* ── Mobile sticky header ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: t.bg, borderBottom: `1px solid ${t.panelBorder}` }}>
        <div>
          <p className="text-[15px] font-bold leading-tight" style={{ color: t.text1 }}>{companyName}</p>
          <p className="text-[11px]" style={{ color: t.text3 }}>Dashboard</p>
        </div>
        <div className="relative">
          <button type="button" onClick={() => notifOpen ? setNotifOpen(false) : openNotif()}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition"
            style={{ background: notifOpen ? t.accentActive : t.surface }}>
            <Bell size={17} strokeWidth={1.8} style={{ color: t.text2 }} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: '#EF4444' }}>{unreadCount}</span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-[18px]"
                style={{ background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`, boxShadow: '0 12px 40px rgba(0,0,0,0.20)', zIndex: 50 }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${t.surfaceBorder}` }}>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: t.text3 }}>Notificaciones</span>
                  <button type="button" onClick={() => setNotifOpen(false)} style={{ color: t.text3 }}><X size={13} /></button>
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition"
                    style={{ borderBottom: `1px solid ${t.surfaceBorder}` }}
                    onMouseEnter={e => e.currentTarget.style.background = t.surface}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: n.dot }} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium leading-snug" style={{ color: t.text1 }}>{n.text}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: t.text3 }}>{n.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 pb-6">

        {/* ── 1. METRICS COMPACT STRIP ── */}
        <section className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          {metricCards.map((m, i) => (
            <motion.div key={m.key}
              className="rounded-[16px] px-3.5 py-3"
              style={CARD}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">{m.label}</p>
              <p className="mt-1.5 font-['Space_Grotesk'] text-[26px] font-black leading-none text-white">{m.value}</p>
              <p className={`mt-1.5 text-[10px] font-semibold ${m.trendUp ? 'text-emerald-400' : 'text-amber-400'}`}>{m.trend}</p>
            </motion.div>
          ))}
        </section>

        {/* ── 2. HOY + PIPELINE ── */}
        <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">

          {/* HOY: próxima reunión + tareas */}
          <section className="rounded-[20px] p-5" style={CARD}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400">Hoy</p>
              {pendingCount > 0 && (
                <button type="button" onClick={resolveAll}
                  className="text-[10px] font-semibold text-white/40 hover:text-white/60 transition">
                  Resolver todo
                </button>
              )}
            </div>

            {/* Next meeting hero */}
            <div className="rounded-[14px] p-4 mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(16,32,72,0.9), rgba(24,55,130,0.75))', border: '1px solid rgba(24,113,216,0.28)' }}>
              <p className="text-[10px] font-semibold text-white/50 mb-1">Próxima reunión</p>
              <p className="font-['Space_Grotesk'] text-[16px] font-bold text-white leading-tight">Bloom Florería</p>
              <div className="flex items-center gap-1.5 mt-1 mb-3">
                <Clock size={11} className="text-white/40" />
                <span className="text-[11px] text-white/50">Hoy · 15:00 — 16:00 hs</span>
              </div>
              <button type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] py-2.5 text-[13px] font-semibold text-white transition"
                style={{ background: 'rgba(24,113,216,0.55)', border: '1px solid rgba(24,113,216,0.4)' }}>
                <Video size={14} />
                Iniciar reunión
              </button>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              <AnimatePresence>
                {reminders.map(r => (
                  <motion.div key={r.id} layout animate={{ opacity: r.done ? 0.4 : 1 }}
                    className="flex items-center gap-3 rounded-[12px] px-3 py-2.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <button type="button" onClick={() => toggleReminder(r.id)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        r.done ? 'border-emerald-400 bg-emerald-400 text-white' : 'border-white/20 bg-transparent text-transparent hover:border-emerald-400'
                      }`}>
                      <Check size={10} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12px] font-medium leading-snug ${r.done ? 'text-white/35 line-through' : 'text-white/85'}`}>{r.text}</p>
                      <p className="text-[10px] text-white/35 mt-0.5">{r.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* PIPELINE DE ALIANZAS */}
          <section className="rounded-[20px] p-5" style={CARD}>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A9FFF] mb-4">Pipeline de alianzas</p>
            <div className="space-y-2.5">
              {PIPELINE.map((p, i) => (
                <motion.div key={p.stage}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                  className="flex items-center gap-3">
                  <div className="w-[90px] shrink-0">
                    <p className="text-[11px] font-medium text-white/55">{p.stage}</p>
                  </div>
                  {/* Bar */}
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: p.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.count / 24) * 100}%` }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                  <div className="w-8 shrink-0 text-right">
                    <span className="text-[13px] font-black" style={{ color: p.color }}>{p.count}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-white/[0.07]" />

            {/* Actividad reciente */}
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-3">Actividad reciente</p>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map(a => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: a.dot }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-white/75 leading-snug">{a.text}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-white/30 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── 3. AGENDA COMPACTA ── */}
        <section className="rounded-[20px] p-5" style={CARD}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A9FFF] mb-4">Próximas reuniones</p>
          <div className="space-y-2">
            {UPCOMING_MEETINGS.map(m => (
              <div key={m.id}>
                <button type="button" onClick={() => setExpandedMeeting(expandedMeeting === m.id ? null : m.id)}
                  className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left transition hover:bg-white/[0.04]"
                  style={{ background: m.isToday ? 'rgba(24,113,216,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${m.isToday ? 'rgba(24,113,216,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[9px] font-black text-white"
                    style={{ background: m.isToday ? 'rgba(24,113,216,0.5)' : 'rgba(255,255,255,0.08)' }}>
                    {m.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-white/90">{m.company}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={10} className="text-white/35" />
                      <p className="text-[11px] text-white/45">{m.time}</p>
                      <span className="text-white/20">·</span>
                      <p className="text-[11px] text-white/35">{m.tasks.length} {m.tasks.length === 1 ? 'tarea' : 'tareas'}</p>
                    </div>
                  </div>
                  {expandedMeeting === m.id
                    ? <ChevronUp size={14} className="text-white/30 shrink-0" />
                    : <ChevronDown size={14} className="text-white/30 shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {expandedMeeting === m.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="mt-1 space-y-1.5 px-4 py-2">
                        {m.tasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#4A9FFF]" />
                            <p className="text-[12px] text-white/55">{task}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. NOTAS IA ── */}
        <section className="overflow-hidden rounded-[24px]"
          style={{
            background: 'linear-gradient(160deg, rgba(10,15,32,0.93) 0%, rgba(8,20,46,0.90) 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A9FFF]">Notas IA</p>
              <button type="button" onClick={onOpenAllianceRoom}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[14px] px-3 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #1A2A48, #35577D)' }}>
                <Zap size={12} />
                Alliance Room
              </button>
            </div>
            <h2 className="mt-2 font-['Space_Grotesk'] text-xl font-bold tracking-tight text-white">Notes Alianzas</h2>
            <p className="mt-0.5 text-[11px] text-white/40">Resúmenes generados por IA de tus reuniones</p>

            <div className="mt-4 space-y-2">
              {ALLIANCE_NOTES.map((note, i) => (
                <motion.div key={note.id} className="overflow-hidden rounded-[18px]"
                  style={{ border: '1px solid rgba(255,255,255,0.09)' }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.05 }}>
                  <button type="button"
                    className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.07]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                    onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white/90">{note.company}</p>
                      <p className="mt-0.5 text-[11px] text-white/40">{note.date} · {note.duration}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${scoreStyle(note.score)}`}>{note.score}/100</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${momentumStyle[note.momentumColor]}`}>{note.momentum}</span>
                        <span className="text-[11px] text-white/35">{note.agreements} ac · {note.tasks} tasks</span>
                      </div>
                    </div>
                    {expandedNote === note.id
                      ? <ChevronUp size={14} className="text-white/30 shrink-0 mt-0.5" />
                      : <ChevronDown size={14} className="text-white/30 shrink-0 mt-0.5" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedNote === note.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="px-4 pb-4 pt-3">
                          <p className="text-sm leading-relaxed text-white/65">{note.summary}</p>
                          {note.agreementList?.length > 0 && (
                            <div className="mt-3">
                              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Acuerdos</p>
                              <div className="space-y-1">
                                {note.agreementList.map((ag, j) => (
                                  <div key={j} className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-xs text-white/65">{ag}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. MATCH ACTIVOS ── */}
        <section className="rounded-[24px] p-5" style={CARD}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A9FFF]">Match Activos</p>
              <h2 className="mt-1 font-['Space_Grotesk'] text-lg font-bold tracking-tight text-white">Equipos Conectados</h2>
            </div>
            <button type="button" onClick={onNavigateToChats}
              className="inline-flex items-center gap-1.5 rounded-[14px] bg-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/15">
              Ver chats <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-2">
            {teamCollab.map((team, i) => (
              <motion.div key={team.id}
                className="flex items-center gap-3 rounded-[18px] px-4 py-3.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: i * 0.05 }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] font-['Space_Grotesk'] text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #141E30, #35577D)' }}>
                  {team.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-white/90">{team.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-white/40">{team.task}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyle[team.statusTone]}`}>
                  {team.status}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardView;
