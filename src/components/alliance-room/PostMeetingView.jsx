import { motion } from 'framer-motion';
import {
  X,
  Clock,
  Star,
  Handshake,
  ListTodo,
  Send,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

const POST_DATA = {
  duration: '26:42',
  scoreInteraction: 87,
  agreements: 3,
  tasksGenerated: 4,
  summary:
    'La reunión tuvo alto nivel de engagement. Se detectaron 3 acuerdos clave relacionados con campaña primavera, branding y activación en punto de venta. El tema financiero estuvo muy presente (presupuesto mencionado 4 veces). Se recomienda hacer seguimiento inmediato sobre deadlines.',
  agreementList: [
    { id: 1, company: 'Top White', text: 'Presentar branding el lunes próximo' },
    { id: 2, company: 'Bloom Florería', text: 'Cotización packaging antes del viernes' },
    { id: 3, company: 'Ambos', text: 'Reunión de cierre en 2 semanas' },
  ],
  risks: [
    'Sin fechas definidas para entrega de assets',
    'Presupuesto aún sin aprobación formal',
  ],
  taskList: [
    { id: 1, text: 'Enviar brief creativo', assignedTo: 'Top White', due: 'Lun 12 May', priority: 'alta' },
    { id: 2, text: 'Confirmar fechas de activación', assignedTo: 'Bloom Florería', due: 'Mié 14 May', priority: 'media' },
    { id: 3, text: 'Aprobar presupuesto campaña', assignedTo: 'Top White', due: 'Vie 16 May', priority: 'alta' },
    { id: 4, text: 'Cotizar packaging colaborativo', assignedTo: 'Bloom Florería', due: 'Próx. semana', priority: 'baja' },
  ],
  highlights: [
    { time: '02:14', label: 'Campaña conjunta', color: 'emerald' },
    { time: '08:22', label: 'Acuerdo branding', color: 'blue' },
    { time: '14:55', label: 'Activación conjunta', color: 'violet' },
    { time: '22:10', label: 'Próxima reunión', color: 'pink' },
  ],
  participation: [
    { name: 'Agustín Orellano', initials: 'AO', pct: 42, color: 'bg-emerald-400', glow: 'rgba(34,197,94,0.4)' },
    { name: 'Valentina Cruz', initials: 'VC', pct: 35, color: 'bg-pink-400', glow: 'rgba(244,114,182,0.4)' },
    { name: 'Marcos Linares', initials: 'ML', pct: 23, color: 'bg-blue-400', glow: 'rgba(96,165,250,0.4)' },
  ],
};

const highlightColor = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  pink: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
};

const priorityStyle = {
  alta: 'text-red-400 bg-red-500/10 border-red-500/20',
  media: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  baja: 'text-slate-400 bg-white/[0.04] border-white/10',
};

export default function PostMeetingView({ alliance, onClose }) {
  const scoreColor =
    POST_DATA.scoreInteraction >= 85
      ? 'text-emerald-400'
      : POST_DATA.scoreInteraction >= 70
      ? 'text-blue-400'
      : 'text-amber-400';

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ backgroundColor: '#080C12' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        {/* Section 1: Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-emerald-500/15 text-base font-bold text-emerald-400 ring-1 ring-emerald-500/25">
                TW
              </div>
              <X className="h-4 w-4 text-white/30" />
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-pink-500/15 text-base font-bold text-pink-400 ring-1 ring-pink-500/25">
                BF
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
                Reunión #{String(alliance.meetingNumber).padStart(2, '0')} · Finalizada
              </p>
              <h1 className="text-xl font-bold text-white/90">
                {alliance.myCompany.name} × {alliance.theirCompany.name}
              </h1>
              <p className="text-xs text-white/40">Resumen generado automáticamente por IA</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            Reunión Finalizada ✓
          </span>
        </motion.div>

        {/* Section 2: Stats row */}
        <motion.div
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Duración', value: POST_DATA.duration, icon: Clock, color: 'white/60', iconColor: 'text-white/40' },
            { label: 'Score interacción', value: `${POST_DATA.scoreInteraction}/100`, icon: Star, color: scoreColor, iconColor: scoreColor, badge: true },
            { label: 'Acuerdos detectados', value: POST_DATA.agreements, icon: Handshake, color: 'text-blue-400', iconColor: 'text-blue-400' },
            { label: 'Tasks generadas', value: POST_DATA.tasksGenerated, icon: ListTodo, color: 'text-amber-400', iconColor: 'text-amber-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="rounded-[18px] border border-white/[0.07] bg-white/[0.04] p-5"
              >
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                <p className={`mt-3 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Section 3: AI Executive Summary */}
        <motion.div
          className="mt-5 rounded-[20px] border border-violet-500/20 bg-violet-500/[0.07] p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-violet-400" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-400">
              Resumen Ejecutivo IA
            </p>
          </div>
          <p className="text-sm leading-relaxed text-white/70">{POST_DATA.summary}</p>

          {POST_DATA.risks.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {POST_DATA.risks.map((risk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <p className="text-xs text-amber-300/70">{risk}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Section 4: Two-col grid */}
        <motion.div
          className="mt-5 grid gap-5 sm:grid-cols-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          {/* Acuerdos */}
          <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Handshake className="h-4 w-4 text-blue-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Acuerdos Detectados
              </p>
            </div>
            <div className="space-y-2.5">
              {POST_DATA.agreementList.map((ag) => (
                <div key={ag.id} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <div>
                    <p className="text-xs font-semibold text-white/80">{ag.text}</p>
                    <p className="text-[10px] text-white/40">{ag.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 mb-4">
              <ListTodo className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Tasks Generadas
              </p>
            </div>
            <div className="space-y-2.5">
              {POST_DATA.taskList.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white/80">{task.text}</p>
                    <p className="text-[10px] text-white/40">{task.assignedTo} · {task.due}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityStyle[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section 5: Highlights timeline */}
        <motion.div
          className="mt-5 rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
            Highlights · Momentos clave
          </p>
          <div className="flex flex-wrap gap-2.5">
            {POST_DATA.highlights.map((hl, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 ${highlightColor[hl.color]}`}
              >
                <span className="font-mono text-xs font-bold">{hl.time}</span>
                <span className="text-xs">{hl.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 6: Participación */}
        <motion.div
          className="mt-5 rounded-[20px] border border-white/[0.07] bg-white/[0.04] p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
            Participación · Tiempo de habla
          </p>
          <div className="space-y-3">
            {POST_DATA.participation.map((p) => (
              <div key={p.initials} className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-bold text-white/80"
                  style={{ background: p.glow }}
                >
                  {p.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{p.name}</span>
                    <span className="text-xs font-bold text-white/60">{p.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className={`h-full rounded-full ${p.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 7: Footer CTA */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3 pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <button
            className="flex items-center gap-2.5 rounded-[18px] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #141E30, #35577D)',
              boxShadow: '0 8px 32px rgba(20,30,48,0.25)',
            }}
            type="button"
          >
            <Send className="h-4 w-4" />
            Enviar resumen automáticamente
          </button>

          <button
            className="flex items-center gap-2.5 rounded-[18px] border border-white/[0.12] bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
            type="button"
          >
            <Calendar className="h-4 w-4" />
            Agendar follow-up
          </button>

          <button
            className="rounded-[18px] border border-white/[0.07] px-6 py-3.5 text-sm font-semibold text-white/40 transition hover:border-white/20 hover:text-white/70"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
