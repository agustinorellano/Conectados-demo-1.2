import {
  Calendar, ChevronLeft, Info, Send, Share2, TrendingUp, X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import ProposalInput from './ProposalInput';

/* ── Helpers ─────────────────────────────────────────────────────── */
function getInitials(logo, company) {
  if (logo && /^[A-Z]{1,3}$/.test(logo)) return logo;
  if (!company) return 'XX';
  return company.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function twoWeeksFromNow() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ── Meeting Modal ───────────────────────────────────────────────── */
function MeetingModal({ conversation, onClose, onConfirm }) {
  const initials = getInitials(conversation.logo, conversation.company);
  const [date,    setDate]    = useState(todayIso());
  const [time,    setTime]    = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      title:          `Reunión ${conversation.company}`,
      company:        conversation.company,
      companyInitials: initials,
      date, time, endTime,
      type: 'video',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative mx-4 w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl"
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          onClick={e => e.stopPropagation()}
          transition={{ duration: 0.22, ease: [0.34, 1.1, 0.64, 1] }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1871D8]">Agenda</p>
              <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[#1A1A1A]">
                Agendar Reunión
              </h3>
            </div>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#141E30] to-[#35577D] font-['Space_Grotesk'] text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{conversation.company}</p>
              <p className="text-xs text-slate-400">{conversation.sector}</p>
            </div>
          </div>

          <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Fecha</label>
              <input
                className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
                min={todayIso()} onChange={e => setDate(e.target.value)} required type="date" value={date}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Inicio</label>
                <input
                  className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
                  onChange={e => setTime(e.target.value)} required type="time" value={time}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Fin</label>
                <input
                  className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
                  onChange={e => setEndTime(e.target.value)} required type="time" value={endTime}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                className="flex-1 rounded-[16px] border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                onClick={onClose} type="button"
              >Cancelar</button>
              <button
                className="flex-1 rounded-[16px] bg-[#141E30] py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1A2C45] hover:shadow-md"
                type="submit"
              >Confirmar</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Task Modal ──────────────────────────────────────────────────── */
function TaskModal({ conversation, onClose, onConfirm }) {
  const company = conversation?.company || '';
  const [title,    setTitle]    = useState(`Seguimiento propuesta con ${company}`);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('alta');
  const [dueDate,  setDueDate]  = useState(twoWeeksFromNow());
  const [assignee, setAssignee] = useState('Agustín Rosales');
  const [alianza,  setAlianza]  = useState(company);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onConfirm({ title: title.trim(), description, priority, dueDate, assignee, alianza, partner: company, source: 'chat' });
  };

  const priorityOptions = [
    { value: 'alta',  label: 'Alta',  active: 'bg-red-100 text-red-700 border-red-200',       inactive: 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' },
    { value: 'media', label: 'Media', active: 'bg-amber-100 text-amber-700 border-amber-200',  inactive: 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' },
    { value: 'baja',  label: 'Baja',  active: 'bg-slate-100 text-slate-600 border-slate-200',  inactive: 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' },
  ];

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative mx-4 w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl"
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        onClick={e => e.stopPropagation()}
        transition={{ duration: 0.22, ease: [0.34, 1.1, 0.64, 1] }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1871D8]">Workplace</p>
            <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[#1A1A1A]">Crear Task</h3>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            onClick={onClose} type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Título</label>
            <input
              className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
              onChange={e => setTitle(e.target.value)} required value={title}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Descripción</label>
            <textarea
              className="w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
              onChange={e => setDescription(e.target.value)}
              placeholder="Revisión conjunta y próximos pasos…"
              rows={3} value={description}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Asignar a</label>
            <select
              className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
              onChange={e => setAssignee(e.target.value)} value={assignee}
            >
              <option value="Agustín Rosales">Agustín Rosales</option>
              <option value="Equipo Ventas">Equipo Ventas</option>
              <option value="Equipo Marketing">Equipo Marketing</option>
              {company && <option value={company}>{company}</option>}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Prioridad</label>
            <div className="flex gap-2">
              {priorityOptions.map(opt => (
                <button
                  key={opt.value} onClick={() => setPriority(opt.value)} type="button"
                  className={`flex-1 rounded-[10px] border py-2 text-[12px] font-semibold transition-all ${
                    priority === opt.value ? opt.active : opt.inactive
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Fecha límite</label>
            <input
              className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
              onChange={e => setDueDate(e.target.value)} type="date" value={dueDate}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Alianza relacionada</label>
            <select
              className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
              onChange={e => setAlianza(e.target.value)} value={alianza}
            >
              {company && <option value={company}>{company}</option>}
              <option value="Sin alianza específica">Sin alianza específica</option>
            </select>
          </div>
          <button
            className="w-full rounded-[16px] bg-[#141E30] py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1A2C45] hover:shadow-md"
            type="submit"
          >Crear Task</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ── Score label ─────────────────────────────────────────────────── */
function scoreLabel(score) {
  if (score >= 85) return { text: 'Alto potencial',  cls: 'text-emerald-600' };
  if (score >= 70) return { text: 'Buen potencial',  cls: 'text-emerald-500' };
  return                  { text: 'Potencial medio', cls: 'text-slate-500'   };
}

/* ── Context Panel content (bottom sheet body) ───────────────────── */
const BUSINESS_STATES = ['activo', 'pendiente', 'cerrado'];

function ContextPanelContent({ conversation, onCreateTask, onOpenAllianceRoom, onConvertToOpportunity }) {
  const [bizState,      setBizState]      = useState(conversation?.businessState || 'pendiente');
  const [tags,          setTags]          = useState(conversation?.tags || ['Alianza estratégica']);
  const [newTag,        setNewTag]        = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskCreated,   setTaskCreated]   = useState(false);
  const [converted,     setConverted]     = useState(false);

  useEffect(() => {
    setBizState(conversation?.businessState || 'pendiente');
    setTags(conversation?.tags || ['Alianza estratégica']);
    setTaskCreated(false);
    setConverted(false);
  }, [conversation?.id]);

  const score   = conversation?.score ?? 78;
  const contact = conversation?.contact || conversation?.sector || '';
  const sl      = scoreLabel(score);

  const scoreColor =
    score >= 85 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : score >= 70 ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-slate-600 bg-slate-100 border-slate-200';

  const bizStateStyle = {
    activo:    'bg-emerald-50 text-emerald-700',
    pendiente: 'bg-amber-50 text-amber-700',
    cerrado:   'bg-slate-100 text-slate-600',
  };

  const handleConvert = () => {
    setConverted(true);
    setBizState('activo');
    onConvertToOpportunity?.();
  };

  return (
    <div className="flex flex-col">

      {/* Section header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="font-['Space_Grotesk'] text-[15px] font-bold text-[#1A1A1A]">Contexto del negocio</p>
      </div>

      {/* Match info */}
      <div className="border-b border-slate-100 p-5 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Info del Match</p>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#1A1A1A]">{conversation?.company}</p>
            <p className="truncate text-[12px] text-slate-400">{contact}</p>
          </div>
          {score != null && !conversation?.isTeam && (
            <span className={`ml-3 shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${scoreColor}`}>
              {score}/100
            </span>
          )}
        </div>
        {!conversation?.isTeam && (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Coincidimos por complementariedad de servicios y audiencia.
          </p>
        )}
        {!conversation?.isTeam && (
          <div className="rounded-[12px] border border-slate-100 bg-white p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-400">Tipo</span>
              <span className="font-semibold text-[#1A1A1A]">Alianza comercial</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-400">Sector</span>
              <span className="ml-2 truncate text-right font-semibold text-[#1A1A1A]">{conversation?.sector}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-400">Ciudad</span>
              <span className="font-semibold text-[#1A1A1A]">{conversation?.location || 'Argentina'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Score de Oportunidad */}
      {!conversation?.isTeam && (
        <div className="border-b border-slate-100 p-5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Score de Oportunidad</p>
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#1A1A1A]">{score} / 100</span>
            <span className={`text-[12px] font-semibold ${sl.cls}`}>{sl.text}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${score}%` }} />
          </div>
        </div>
      )}

      {/* Business State */}
      {!conversation?.isTeam && (
        <div className="border-b border-slate-100 p-5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Estado del negocio</p>
          <div className="flex gap-1.5">
            {BUSINESS_STATES.map(state => (
              <button
                key={state} onClick={() => setBizState(state)} type="button"
                className={`flex-1 rounded-[10px] px-2 py-2 text-[12px] font-semibold capitalize transition-all ${
                  bizState === state
                    ? (bizStateStyle[state] || 'bg-slate-100 text-slate-600') + ' shadow-sm ring-1 ring-inset ring-black/5'
                    : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="border-b border-slate-100 p-5 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="group flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600">
              {tag}
              <button
                onClick={() => setTags(t => t.filter(x => x !== tag))}
                type="button"
                className="leading-none text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
              >×</button>
            </span>
          ))}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const t = newTag.trim();
            if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
            setNewTag('');
          }}
          className="flex gap-1.5"
        >
          <input
            value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="+ Agregar tag"
            className="flex-1 rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-[12px] outline-none focus:border-[#1871D8]/40 focus:ring-1 focus:ring-[#1871D8]/15"
          />
          <button type="submit" className="rounded-[10px] bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-200">
            OK
          </button>
        </form>
      </div>

      {/* Acciones rápidas */}
      <div className="p-5 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Acciones rápidas</p>
        <div className="space-y-2">
          {!conversation?.isTeam && (
            <button
              onClick={handleConvert} disabled={converted} type="button"
              className={`flex w-full items-center gap-2.5 rounded-[12px] border px-4 py-3 text-left text-[13px] font-semibold transition-all ${
                converted
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-[#141E30]/20 bg-[#141E30]/5 text-[#141E30] hover:bg-[#141E30]/10'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              {converted ? 'Alianza activa ✓' : 'Convertir en oportunidad'}
            </button>
          )}

          {[
            { label: 'Marcar oportunidad',  onClick: () => setBizState('activo'),   icon: '⚡' },
            { label: 'Cerrar negocio',       onClick: () => setBizState('cerrado'),  icon: '✓' },
            { label: 'Agendar seguimiento',  onClick: () => {},                     icon: '📅' },
            { label: 'Crear Task',           onClick: () => setShowTaskModal(true), icon: '＋', highlight: true },
          ].map(action => (
            <button
              key={action.label} onClick={action.onClick} type="button"
              className={`flex w-full items-center gap-2.5 rounded-[12px] border px-4 py-3 text-left text-[13px] font-semibold transition-all ${
                action.highlight
                  ? 'border-[#141E30]/20 bg-[#141E30]/5 text-[#141E30] hover:bg-[#141E30]/10'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{action.icon}</span>
              {action.label}
            </button>
          ))}

          {onOpenAllianceRoom && !conversation?.isTeam && (
            <button
              onClick={onOpenAllianceRoom} type="button"
              className="flex w-full items-center gap-2.5 rounded-[12px] border border-violet-200 bg-violet-50 px-4 py-3 text-left text-[13px] font-semibold text-violet-700 transition-all hover:bg-violet-100"
            >
              <span className="text-base">🎥</span>
              Alliance Room
            </button>
          )}
        </div>
      </div>

      {/* Task created flash */}
      <AnimatePresence>
        {taskCreated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-5 mb-5 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3"
          >
            <p className="text-[12px] font-semibold text-emerald-700">✓ Task creada y sincronizada con Workplace</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal
            conversation={conversation}
            onClose={() => setShowTaskModal(false)}
            onConfirm={task => {
              onCreateTask?.(task);
              setShowTaskModal(false);
              setTaskCreated(true);
              setTimeout(() => setTaskCreated(false), 4000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ChatWindow — single-column, bottom sheet for context
   No desktop right panel. No md: breakpoints on core layout.
══════════════════════════════════════════════════════════════════════ */
function ChatWindow({
  conversation,
  onBack,
  onChangeDraft,
  onConvertToOpportunity,
  onProposalPreset,
  onQuickAction,
  onScheduleMeeting,
  onSend,
  proposalDraft,
  onCreateTask,
  onOpenAllianceRoom,
}) {
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [contextOpen,      setContextOpen]      = useState(false);

  const handleMeetingConfirm = meeting => {
    onScheduleMeeting?.(meeting);
    setMeetingScheduled(true);
    setTimeout(() => setMeetingScheduled(false), 3000);
  };

  const initials = getInitials(conversation.logo, conversation.company);
  const contact  = conversation.contact || conversation.sector || '';

  /* Quick action pills */
  const quickPills = [
    { key: 'meeting',  icon: Calendar, label: 'Reunión',   onClick: () => setShowMeetingModal(true) },
    { key: 'proposal', icon: Send,     label: 'Propuesta', onClick: onProposalPreset               },
    { key: 'share',    icon: Share2,   label: 'Compartir', onClick: null                           },
  ];

  return (
    /* Outer wrapper — relative so the bottom sheet positions inside it */
    <div className="relative flex h-full min-w-0 flex-col overflow-hidden">

      {/* ── HEADER — 60px ── */}
      <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-slate-100 px-4">

        {/* Back button — always visible */}
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 active:scale-95"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Avatar — 40px */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#141E30] to-[#35577D] font-['Space_Grotesk'] text-[12px] font-bold text-white shadow-sm">
          {initials}
        </div>

        {/* Name + subtitle */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-['Space_Grotesk'] text-[15px] font-bold tracking-tight text-[#1A1A1A]">
            {conversation.company}
          </h2>
          <p className="truncate text-[12px] leading-none text-slate-400">
            {[contact, conversation.location].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* ⓘ Info button — always visible, opens bottom sheet */}
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 active:scale-95"
          onClick={() => setContextOpen(true)}
          type="button"
          aria-label="Ver contexto"
        >
          <Info className="h-4 w-4" />
        </button>
      </header>

      {/* ── QUICK ACTION PILLS ── */}
      <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-slate-100 px-4 py-2.5 [scrollbar-width:none]">
        {quickPills.map(pill => {
          const Icon = pill.icon;
          return (
            <button
              key={pill.key}
              onClick={pill.onClick || undefined}
              type="button"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-[12px] font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1871D8]/30 hover:text-[#1871D8] hover:shadow-md"
            >
              <Icon className="h-3.5 w-3.5" />
              {pill.label}
            </button>
          );
        })}
        {onOpenAllianceRoom && !conversation.isTeam && (
          <button
            onClick={onOpenAllianceRoom} type="button"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 text-[12px] font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-md"
          >
            🎥 Alliance Room
          </button>
        )}
      </div>

      {/* ── FLASH CONFIRMS ── */}
      <AnimatePresence>
        {meetingScheduled && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0 border-b border-blue-100 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: -8 }}
            key="meeting-confirm"
            transition={{ duration: 0.2 }}
          >
            Reunión agendada. Aparece en el Calendario del Dashboard.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MESSAGES ── */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,249,250,0.35),rgba(255,255,255,0.65))] px-5 py-5 scroll-smooth">
        {conversation.messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* ── INPUT ── */}
      <ProposalInput
        onChange={onChangeDraft}
        onQuickAction={onQuickAction}
        onSend={onSend}
        quickActions={['Propuesta comercial', 'Alianza estratégica', 'Intercambio de clientes']}
        value={proposalDraft}
      />

      {/* ── CONTEXT BOTTOM SHEET — universal (all screen sizes) ── */}
      <AnimatePresence>
        {contextOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-black/25"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setContextOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              animate={{ y: 0 }}
              className="absolute inset-x-0 bottom-0 z-30 flex max-h-[88%] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl"
              exit={{ y: '100%' }}
              initial={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              {/* Drag handle + close */}
              <div className="relative flex shrink-0 items-center justify-center pt-3 pb-2">
                <div className="h-1 w-10 rounded-full bg-slate-300" />
                <button
                  className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  onClick={() => setContextOpen(false)}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* Scrollable content */}
              <div className="overflow-y-auto">
                <ContextPanelContent
                  conversation={conversation}
                  onCreateTask={onCreateTask}
                  onOpenAllianceRoom={onOpenAllianceRoom}
                  onConvertToOpportunity={onConvertToOpportunity}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MEETING MODAL ── */}
      {showMeetingModal && (
        <MeetingModal
          conversation={conversation}
          onClose={() => setShowMeetingModal(false)}
          onConfirm={handleMeetingConfirm}
        />
      )}
    </div>
  );
}

export default ChatWindow;
