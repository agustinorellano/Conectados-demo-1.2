import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import CalendarWidget from './CalendarWidget';

// ─── Alliance Notes data ─────────────────────────────────────────────────────
const ALLIANCE_NOTES = [
  {
    id: 1,
    date: '6 May 2026',
    company: 'Bloom Florería',
    duration: '52 min',
    score: 88,
    agreements: 3,
    tasks: 4,
    momentum: 'Alto',
    momentumColor: 'emerald',
    summary: 'Cierre propuesta branding. Se alinearon timelines y KPIs. Score muy positivo con alto engagement de ambas partes.',
    agreementList: ['Presentar branding el lunes', 'Cotizar packaging', 'Reunión cierre en 2 semanas'],
  },
  {
    id: 2,
    date: '29 Abr 2026',
    company: 'Bloom Florería',
    duration: '35 min',
    score: 78,
    agreements: 1,
    tasks: 2,
    momentum: 'Medio',
    momentumColor: 'amber',
    summary: 'Revisión propuesta campaña primavera. Pendiente aprobación de presupuesto final.',
    agreementList: ['Revisar propuesta final antes del lunes'],
  },
  {
    id: 3,
    date: '22 Abr 2026',
    company: 'Bloom Florería',
    duration: '48 min',
    score: 91,
    agreements: 4,
    tasks: 3,
    momentum: 'Alto',
    momentumColor: 'emerald',
    summary: 'Kick-off alianza. Alineamos objetivos Q2 y definimos audiencias target para la campaña cápsula.',
    agreementList: ['Definir audiencias Q2', 'Alinear paleta visual', 'Compartir assets de marca', 'Reunión semanal fija'],
  },
];

const momentumStyle = {
  emerald: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  amber: 'text-amber-700 bg-amber-50 border-amber-100',
};

const scoreStyle = (score) => {
  if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
  if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-100';
  return 'text-amber-700 bg-amber-50 border-amber-100';
};

const metricCards = [
  { key: 'total', label: 'Alianzas Totales', value: 24, featured: true, sub: '+18% vs mes anterior' },
  { key: 'closed', label: 'Acuerdos Cerrados', value: 10, sub: 'Crecio este mes' },
  { key: 'active', label: 'Alianzas Activas', value: 12, sub: 'Crecio este mes' },
  { key: 'pending', label: 'En Negociacion', value: 2, sub: 'En revision' }
];

const weeklyActivity = [
  { day: 'L', value: 5 },
  { day: 'M', value: 11 },
  { day: 'X', value: 8 },
  { day: 'J', value: 14, best: true },
  { day: 'V', value: 10 },
  { day: 'S', value: 4 },
  { day: 'D', value: 2 }
];

const MAX_BAR_VALUE = 14;
const BAR_MAX_PX = 88;

const featuredReminder = {
  company: 'Bloom Floreria',
  time: '15:00 — 16:00 hs',
  label: 'Hoy'
};

const initialReminders = [
  { id: 1, text: 'Seguimiento con Luna Beauty', sub: '2 dias sin respuesta — alta prioridad', done: false },
  { id: 2, text: 'Reunion Bloom Floreria', sub: 'Hoy a las 15:00 hs', done: false },
  { id: 3, text: 'Propuesta pendiente — Sushi Nakama', sub: 'Enviada hace 3 dias, sin respuesta', done: false }
];

const allianceList = [
  { id: 1, name: 'Bloom Floreria', meta: 'Ult. contacto: Hoy — Activa', initials: 'BF', color: 'bg-emerald-100 text-emerald-700' },
  { id: 2, name: 'Sushi Nakama', meta: 'Ult. contacto: Ayer — En progreso', initials: 'SN', color: 'bg-blue-100 text-blue-700' },
  { id: 3, name: 'Luna Beauty', meta: 'Ult. contacto: Hace 2 dias', initials: 'LB', color: 'bg-pink-100 text-pink-700' },
  { id: 4, name: 'Core Wellness', meta: 'Ult. contacto: Hace 4 dias', initials: 'CW', color: 'bg-violet-100 text-violet-700' },
  { id: 5, name: 'Digital Craft', meta: 'Ult. contacto: Hace 1 semana', initials: 'DC', color: 'bg-amber-100 text-amber-700' }
];

const teamCollab = [
  {
    id: 1,
    name: 'Bloom Floreria',
    initials: 'BF',
    task: 'Campaña cápsula de temporada — local + redes sociales',
    status: 'Acuerdo Cerrado',
    statusTone: 'emerald'
  },
  {
    id: 2,
    name: 'Sushi Nakama',
    initials: 'SN',
    task: 'Canje gastronómico — beneficio cruzado entre marcas',
    status: 'En Progreso',
    statusTone: 'blue'
  },
  {
    id: 3,
    name: 'Luna Beauty',
    initials: 'LB',
    task: 'Colección cápsula Primavera / Verano con activación conjunta',
    status: 'En Progreso',
    statusTone: 'blue'
  },
  {
    id: 4,
    name: 'Core Wellness',
    initials: 'CW',
    task: 'Cross-promo mensual en redes y newsletter compartido',
    status: 'Pendiente',
    statusTone: 'amber'
  }
];

const statusStyle = {
  emerald: 'bg-emerald-400/15 border-emerald-400/25 text-emerald-300',
  blue: 'bg-blue-400/15 border-blue-400/25 text-blue-300',
  amber: 'bg-amber-400/15 border-amber-400/25 text-amber-300'
};

function DashboardView({ dashboardData, meetings = [], onAreaSelect, onOpenAssistant, onOpenAlliances, onOpenAllianceRoom, onNavigateToChats, onToggleMeeting, userPlan }) {
  const [reminders, setReminders] = useState(initialReminders);
  const [expandedNote, setExpandedNote] = useState(null);

  const pendingCount = reminders.filter((r) => !r.done).length;
  const toggleReminder = (id) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  const resolveAll = () => setReminders((prev) => prev.map((r) => ({ ...r, done: true })));

  return (
    <div className="space-y-5">
      {/* 4 METRIC CARDS */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metricCards.map((card, index) => (
          <motion.div
            className="rounded-[18px] p-4"
            style={
              card.featured
                ? {
                    background: 'linear-gradient(135deg, rgba(16,32,72,0.94) 0%, rgba(24,55,130,0.84) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(24,113,216,0.32)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 1px rgba(24,113,216,0.10), 0 10px 30px rgba(24,113,216,0.20)'
                  }
                : {
                    background: 'linear-gradient(135deg, rgba(12,18,38,0.90) 0%, rgba(18,26,54,0.84) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.22)'
                  }
            }
            initial={{ opacity: 0, y: 12 }}
            key={card.key}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] leading-snug text-white/55">
                {card.label}
              </p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ArrowRight className="h-3 w-3 -rotate-45 text-white/50" />
              </div>
            </div>
            <p className="mt-3 font-['Inter'] text-[2rem] font-extrabold leading-none tracking-[-0.05em] text-white">
              {card.value}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-white/10">
              <TrendingUp className="h-2.5 w-2.5 text-white/50" />
              <span className="text-[0.58rem] font-semibold text-white/55">
                {card.sub}
              </span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* MIDDLE ROW: Bar chart + Recordatorio */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Actividad Semanal — bar chart */}
        <section className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1871D8]">
            Analítica
          </p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Actividad Semanal
          </h2>
          <p className="mt-1 text-sm text-slate-500">Matches e interacciones de los últimos 7 dias</p>

          <div className="mt-6 flex h-[100px] items-end gap-2.5">
            {weeklyActivity.map((bar, i) => (
              <div className="flex flex-1 flex-col items-center gap-2.5" key={bar.day}>
                <motion.div
                  animate={{ height: `${(bar.value / MAX_BAR_VALUE) * BAR_MAX_PX}px` }}
                  className={`w-full rounded-full ${
                    bar.best
                      ? 'bg-[#22c55e]'
                      : i >= 5
                      ? 'bg-slate-200'
                      : 'bg-[#141E30]'
                  }`}
                  initial={{ height: 0 }}
                  transition={{ duration: 0.65, delay: i * 0.07, ease: [0.34, 1.1, 0.64, 1] }}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    bar.best ? 'text-[#22c55e]' : 'text-slate-400'
                  }`}
                >
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#141E30]" />
              <span className="text-xs text-slate-500">Actividad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
              <span className="text-xs text-slate-500">Mejor dia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="text-xs text-slate-500">Fin de semana</span>
            </div>
          </div>
        </section>

        {/* Recordatorio destacado + lista */}
        <section className="flex flex-col rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">
            Prioridad
          </p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
            {featuredReminder.company}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {featuredReminder.label} — {featuredReminder.time}
          </p>

          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#141E30] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1A2C45] hover:shadow-md"
            type="button"
          >
            <Video className="h-4 w-4" />
            Iniciar Reunion
          </button>

          <div className="mt-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                Recordatorios
              </span>
              {pendingCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                  {pendingCount}
                </span>
              )}
            </div>
            {pendingCount > 0 && (
              <button
                className="text-xs font-semibold text-[#141E30] transition hover:opacity-70"
                onClick={resolveAll}
                type="button"
              >
                Resolver todo
              </button>
            )}
          </div>

          <div className="mt-3 flex-1 space-y-2 overflow-auto">
            <AnimatePresence>
              {reminders.map((reminder) => (
                <motion.div
                  animate={{ opacity: reminder.done ? 0.4 : 1 }}
                  className="flex items-center gap-3 rounded-[16px] bg-slate-50 px-3 py-3 ring-1 ring-inset ring-slate-200"
                  initial={{ opacity: 1 }}
                  key={reminder.id}
                  layout
                  transition={{ duration: 0.18 }}
                >
                  <button
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      reminder.done
                        ? 'border-emerald-400 bg-emerald-400 text-white'
                        : 'border-slate-300 bg-white text-transparent hover:border-emerald-400'
                    }`}
                    onClick={() => toggleReminder(reminder.id)}
                    type="button"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold leading-snug transition-all ${
                        reminder.done ? 'text-slate-400 line-through' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {reminder.text}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{reminder.sub}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* CALENDAR WIDGET */}
      <CalendarWidget meetings={meetings} onToggleMeeting={onToggleMeeting} />

      {/* NOTES ALIANZAS WIDGET */}
      <section
        className="overflow-hidden rounded-[24px]"
        style={{
          background: 'linear-gradient(160deg, rgba(10,15,32,0.93) 0%, rgba(8,20,46,0.90) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 16px 40px rgba(0,0,0,0.25)'
        }}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4A9FFF]">
                Notas IA
              </p>
              <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white">
                Notes Alianzas
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Resúmenes generados por IA de tus reuniones
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-[16px] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #141E30, #35577D)', boxShadow: '0 4px 16px rgba(20,30,48,0.25)' }}
              onClick={onOpenAllianceRoom}
              type="button"
            >
              <Zap className="h-3.5 w-3.5" />
              Iniciar Alliance Room
            </button>
          </div>

          <div className="mt-4 max-h-[360px] overflow-y-auto space-y-2">
            {ALLIANCE_NOTES.map((note, i) => (
              <motion.div
                key={note.id}
                className="overflow-hidden rounded-[18px]"
                style={{ border: '1px solid rgba(255,255,255,0.09)' }}
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {/* Card header (always visible) */}
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.07]"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                  type="button"
                >
                  {/* Date + company */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white/90">{note.company}</span>
                      <span className="text-xs text-white/40">{note.date}</span>
                      <span className="text-xs text-white/40">·</span>
                      <span className="text-xs text-white/40">{note.duration}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${scoreStyle(note.score)}`}>
                      {note.score}/100
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${momentumStyle[note.momentumColor]}`}>
                      {note.momentum}
                    </span>
                    <span className="text-xs text-white/40">{note.agreements} acuerdos</span>
                    <span className="text-xs text-white/40">·</span>
                    <span className="text-xs text-white/40">{note.tasks} tasks</span>
                    {expandedNote === note.id ? (
                      <ChevronUp className="h-4 w-4 text-white/30" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/30" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {expandedNote === note.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="px-4 pb-4 pt-3">
                        <p className="text-sm leading-relaxed text-white/65">{note.summary}</p>

                        {note.agreementList && note.agreementList.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                              Acuerdos
                            </p>
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

                        <div className="mt-4 flex gap-2">
                          <button
                            className="inline-flex items-center gap-1.5 rounded-[12px] bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.12]"
                            type="button"
                          >
                            Ver grabación
                          </button>
                          <button
                            className="inline-flex items-center gap-1.5 rounded-[12px] bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.12]"
                            type="button"
                          >
                            Ver tasks
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipos Conectados — Team Collaboration (standalone full-width) */}
      <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4A9FFF]">
              Match Activos
            </p>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Equipos Conectados
            </h2>
          </div>
          <button
            className="inline-flex items-center gap-1.5 rounded-[14px] bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-slate-100"
            onClick={onNavigateToChats}
            type="button"
          >
            Ver chats
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {teamCollab.map((team, i) => (
            <motion.div
              className="flex items-center gap-3 rounded-[18px] px-4 py-3.5"
              style={{
                background: 'linear-gradient(135deg, rgba(12,18,38,0.88) 0%, rgba(18,26,54,0.82) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.18)'
              }}
              initial={{ opacity: 0, y: 8 }}
              key={team.id}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#141E30] to-[#35577D] font-['Space_Grotesk'] text-xs font-bold text-white shadow-sm">
                {team.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white/90">{team.name}</p>
                <p className="mt-0.5 truncate text-xs text-white/45">
                  Trabajando en{' '}
                  <span className="font-semibold text-white/70">{team.task}</span>
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[team.statusTone]}`}
              >
                {team.status}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardView;
