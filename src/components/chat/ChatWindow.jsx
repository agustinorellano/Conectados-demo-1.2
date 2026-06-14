import {
  Bot, Calendar, ChevronLeft, CheckCircle, FileText, Send,
  Share2, Sparkles, TrendingUp, Video, X, Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import ProposalInput from './ProposalInput';
import { InviteModal } from './ChatList';

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

function getIaData(conv) {
  const score = conv.score ?? 75;
  const sector = conv.sector?.toLowerCase() || 'el mercado';
  if (score >= 85) return {
    score,
    reason: `Ambas empresas buscan acciones conjuntas en ${sector}.`,
    rec: 'Coordiná una reunión comercial para avanzar en los detalles.',
    step: 'Proponé una fecha concreta esta semana.',
  };
  if (score >= 70) return {
    score,
    reason: `${conv.company} complementa tu oferta en audiencia y distribución.`,
    rec: 'Enviá una propuesta inicial para evaluar el fit.',
    step: 'Iniciá con una propuesta de canje o colaboración.',
  };
  return {
    score,
    reason: 'Hay puntos de contacto en sector y objetivos comerciales.',
    rec: 'Un primer mensaje puede abrir la conversación.',
    step: 'Presentate y contá brevemente tu propuesta de valor.',
  };
}

/* ── Avatar gradient ─────────────────────────────────────────────── */
const GRAD_PALETTE = [
  ['#8B5CF6', '#6D28D9'], ['#3B82F6', '#1D4ED8'],
  ['#10B981', '#047857'], ['#EC4899', '#BE185D'],
  ['#06B6D4', '#0E7490'], ['#6366F1', '#4338CA'],
];
function avatarGrad(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const [a, b] = GRAD_PALETTE[Math.abs(h) % GRAD_PALETTE.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/* ── Meeting Modal ───────────────────────────────────────────────── */
function MeetingModal({ conversation, onClose, onConfirm }) {
  const initials = getInitials(conversation.logo, conversation.company);
  const [date,    setDate]    = useState(todayIso());
  const [time,    setTime]    = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ title: `Reunión ${conversation.company}`, company: conversation.company, companyInitials: initials, date, time, endTime, type: 'video' });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div animate={{ y: 0 }} initial={{ y: 40 }} exit={{ y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-lg overflow-hidden rounded-t-[28px]"
          style={{ background: '#0F1828', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={e => e.stopPropagation()}>
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center justify-between px-6 pb-4 pt-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A9FFF]">Agenda</p>
              <h3 className="mt-0.5 font-['Space_Grotesk'] text-[18px] font-bold text-white">Agendar Reunión</h3>
            </div>
            <button onClick={onClose} type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 px-6 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-['Space_Grotesk'] text-xs font-bold text-white"
              style={{ background: avatarGrad(conversation.company) }}>
              {initials}
            </div>
            <div>
              <p className="text-[14px] font-bold text-white">{conversation.company}</p>
              <p className="text-[12px] text-white/35">{conversation.sector}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5"
            style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Fecha</label>
              <input className="w-full rounded-[14px] px-4 py-3 text-[14px] text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                min={todayIso()} onChange={e => setDate(e.target.value)} required type="date" value={date} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Inicio', time, setTime], ['Fin', endTime, setEndTime]].map(([lbl, val, set]) => (
                <div key={lbl}>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{lbl}</label>
                  <input className="w-full rounded-[14px] px-4 py-3 text-[14px] text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                    onChange={e => set(e.target.value)} required type="time" value={val} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} type="button"
                className="flex-1 rounded-[16px] py-3 text-[14px] font-semibold text-white/50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Cancelar
              </button>
              <button type="submit"
                className="flex-1 rounded-[16px] py-3 text-[14px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 14px rgba(24,113,216,0.35)' }}>
                Confirmar
              </button>
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
  const [desc,     setDesc]     = useState('');
  const [priority, setPriority] = useState('alta');
  const [dueDate,  setDueDate]  = useState(twoWeeksFromNow());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onConfirm({ title: title.trim(), description: desc, priority, dueDate, partner: company, source: 'chat' });
  };

  const fieldCls = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' };
  const priorities = [
    { v: 'alta',  l: 'Alta',  on: { background: 'rgba(239,68,68,0.18)',  border: '1px solid rgba(239,68,68,0.35)',  color: '#FCA5A5' } },
    { v: 'media', l: 'Media', on: { background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.35)', color: '#FCD34D' } },
    { v: 'baja',  l: 'Baja',  on: { background: 'rgba(255,255,255,0.08)',border: '1px solid rgba(255,255,255,0.15)',color: 'white'   } },
  ];

  return (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div animate={{ y: 0 }} initial={{ y: 40 }} exit={{ y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="w-full max-w-lg overflow-hidden rounded-t-[28px]"
        style={{ background: '#0F1828', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '88dvh' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2"><div className="h-1 w-10 rounded-full bg-white/20" /></div>
        <div className="flex items-center justify-between px-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A9FFF]">Workplace</p>
            <h3 className="mt-0.5 font-['Space_Grotesk'] text-[18px] font-bold text-white">Crear Task</h3>
          </div>
          <button onClick={onClose} type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 px-6 py-5"
          style={{ maxHeight: '70vh', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Título</label>
            <input className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none" style={fieldCls} onChange={e => setTitle(e.target.value)} required value={title} />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Descripción</label>
            <textarea className="w-full resize-none rounded-[14px] px-4 py-3 text-[14px] outline-none placeholder:text-white/20"
              style={fieldCls} onChange={e => setDesc(e.target.value)} placeholder="Próximos pasos…" rows={3} value={desc} />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Prioridad</label>
            <div className="flex gap-2">
              {priorities.map(o => (
                <button key={o.v} onClick={() => setPriority(o.v)} type="button"
                  className="flex-1 rounded-[12px] py-2.5 text-[13px] font-bold transition-all"
                  style={priority === o.v ? o.on : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Fecha límite</label>
            <input className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none" style={fieldCls} onChange={e => setDueDate(e.target.value)} type="date" value={dueDate} />
          </div>
          <button type="submit" className="w-full rounded-[16px] py-3.5 text-[14px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}>
            Crear Task
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ── Context Panel ───────────────────────────────────────────────── */
const BIZ_STATES = ['activo', 'pendiente', 'cerrado'];
const BIZ_STYLE  = {
  activo:    { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.28)', color: '#10B981' },
  pendiente: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.28)', color: '#F59E0B' },
  cerrado:   { bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' },
};

function ContextPanel({ conversation, onCreateTask, onOpenAllianceRoom, onConvertToOpportunity }) {
  const [bizState,  setBizState]  = useState(conversation?.businessState || 'pendiente');
  const [tags,      setTags]      = useState(conversation?.tags || ['Alianza estratégica']);
  const [newTag,    setNewTag]    = useState('');
  const [taskModal, setTaskModal] = useState(false);
  const [taskDone,  setTaskDone]  = useState(false);
  const [converted, setConverted] = useState(false);

  useEffect(() => {
    setBizState(conversation?.businessState || 'pendiente');
    setTags(conversation?.tags || ['Alianza estratégica']);
    setTaskDone(false);
    setConverted(false);
  }, [conversation?.id]);

  const score = conversation?.score ?? 78;
  const contact = conversation?.contact || conversation?.sector || '';
  const divider = { borderTop: '1px solid rgba(255,255,255,0.06)' };
  const fieldCls = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' };
  const scoreColor = score >= 85
    ? { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' }
    : score >= 70
    ? { color: '#4A9FFF', bg: 'rgba(74,159,255,0.10)', border: 'rgba(74,159,255,0.22)' }
    : { color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.10)' };

  return (
    <div className="flex flex-col">
      <div className="px-5 py-4" style={divider}>
        <p className="font-['Space_Grotesk'] text-[15px] font-bold text-white">Contexto del negocio</p>
      </div>

      <div className="space-y-3 px-5 py-4" style={divider}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Info del Match</p>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-white">{conversation?.company}</p>
            <p className="text-[12px] text-white/35">{contact}</p>
          </div>
          {score != null && !conversation?.isTeam && (
            <span className="ml-3 shrink-0 rounded-full px-3 py-1 text-[12px] font-bold"
              style={{ background: scoreColor.bg, border: `1px solid ${scoreColor.border}`, color: scoreColor.color }}>
              {score}/100
            </span>
          )}
        </div>
        {!conversation?.isTeam && (
          <div className="rounded-[14px] px-4 py-3 space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {[['Tipo', 'Alianza comercial'], ['Sector', conversation?.sector], ['Ciudad', conversation?.location || 'Argentina']].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-[12px]">
                <span className="text-white/30">{k}</span>
                <span className="font-semibold text-white/80">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!conversation?.isTeam && (
        <div className="space-y-2 px-5 py-4" style={divider}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Score</p>
            <span className="text-[13px] font-bold" style={{ color: scoreColor.color }}>{score}/100</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-1.5 rounded-full"
              style={{ background: `linear-gradient(90deg, ${scoreColor.color}88, ${scoreColor.color})` }}
              initial={{ width: 0 }} animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }} />
          </div>
        </div>
      )}

      {!conversation?.isTeam && (
        <div className="space-y-2 px-5 py-4" style={divider}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Estado</p>
          <div className="flex gap-2">
            {BIZ_STATES.map(s => {
              const st = BIZ_STYLE[s];
              return (
                <button key={s} onClick={() => setBizState(s)} type="button"
                  className="flex-1 rounded-[12px] py-2.5 text-[12px] font-bold capitalize transition-all"
                  style={bizState === s
                    ? { background: st.bg, border: `1px solid ${st.border}`, color: st.color }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2 px-5 py-4" style={divider}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="group flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-white/60"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
              {tag}
              <button onClick={() => setTags(t => t.filter(x => x !== tag))} type="button"
                className="leading-none text-white/25 opacity-0 transition-opacity group-hover:opacity-100 hover:!text-red-400">×</button>
            </span>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); const t = newTag.trim(); if (t && !tags.includes(t)) setTags(p => [...p, t]); setNewTag(''); }}
          className="flex gap-1.5">
          <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="+ Agregar tag"
            className="flex-1 rounded-[10px] px-3 py-1.5 text-[12px] outline-none placeholder:text-white/20"
            style={fieldCls} />
          <button type="submit"
            className="rounded-[10px] px-3 py-1.5 text-[12px] font-bold text-white/60"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>OK</button>
        </form>
      </div>

      <div className="space-y-2 px-5 py-4 pb-8" style={divider}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Acciones rápidas</p>
        <div className="space-y-2">
          {!conversation?.isTeam && (
            <button onClick={() => { setConverted(true); setBizState('activo'); onConvertToOpportunity?.(); }}
              disabled={converted} type="button"
              className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[13px] font-bold text-white/80 transition"
              style={converted
                ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }
                : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <TrendingUp className="h-4 w-4 shrink-0" />
              {converted ? 'Alianza activa ✓' : 'Convertir en oportunidad'}
            </button>
          )}
          {[
            { label: 'Crear Task',         onClick: () => setTaskModal(true), icon: '＋' },
            { label: 'Marcar oportunidad', onClick: () => setBizState('activo'), icon: '⚡' },
            { label: 'Cerrar negocio',     onClick: () => setBizState('cerrado'), icon: '✓' },
          ].map(a => (
            <button key={a.label} onClick={a.onClick} type="button"
              className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[13px] font-semibold text-white/65 transition hover:text-white/85"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-base text-white/40">{a.icon}</span>
              {a.label}
            </button>
          ))}
          {onOpenAllianceRoom && !conversation?.isTeam && (
            <button onClick={onOpenAllianceRoom} type="button"
              className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[13px] font-bold transition hover:brightness-110"
              style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.28)', color: '#C4B5FD' }}>
              <Video className="h-4 w-4 shrink-0" />
              Alliance Room
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {taskDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-5 mb-5 rounded-[12px] px-4 py-3"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <p className="text-[12px] font-bold text-emerald-400">✓ Task creada y sincronizada con Workplace</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {taskModal && (
          <TaskModal conversation={conversation} onClose={() => setTaskModal(false)}
            onConfirm={task => {
              onCreateTask?.(task);
              setTaskModal(false);
              setTaskDone(true);
              setTimeout(() => setTaskDone(false), 4000);
            }} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ChatWindow
═══════════════════════════════════════════════════════════════════ */
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
  onTeamInvite,
}) {
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [contextOpen,      setContextOpen]      = useState(false);
  const [showIaCard,       setShowIaCard]       = useState(false);
  const [showInviteModal,  setShowInviteModal]  = useState(false);
  const [showTaskModal,    setShowTaskModal]     = useState(false);
  const [taskCreated,      setTaskCreated]      = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setShowIaCard(false);
    setMeetingScheduled(false);
    setTaskCreated(false);
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleMeetingConfirm = meeting => {
    onScheduleMeeting?.(meeting);
    setMeetingScheduled(true);
    setTimeout(() => setMeetingScheduled(false), 3500);
  };

  const initials = getInitials(conversation.logo, conversation.company);
  const contact  = conversation.contact || conversation.sector || '';
  const iaData   = getIaData(conversation);

  return (
    <div className="relative flex h-full min-w-0 flex-col overflow-hidden"
      style={{ background: '#0A0F1E' }}>

      {/* ══ HEADER ══════════════════════════════════════════════════ */}
      <header className="shrink-0 px-4 pt-4 pb-3"
        style={{ background: '#0A0F1E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-start gap-3">
          {/* Back */}
          <button type="button" onClick={onBack}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/45 transition hover:bg-white/8 active:scale-95">
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Avatar + info — tapping opens context */}
          <button type="button" onClick={() => setContextOpen(true)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left active:opacity-80">
            {/* Large avatar */}
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full font-['Space_Grotesk'] text-[16px] font-bold text-white shadow-lg"
              style={{ background: avatarGrad(conversation.company) }}>
              {initials}
            </div>
            <div className="min-w-0 pt-0.5">
              <h2 className="font-['Space_Grotesk'] text-[20px] font-bold leading-tight text-white">
                {conversation.company}
              </h2>
              <p className="mt-0.5 text-[13px] text-white/45">
                {[contact, conversation.location].filter(Boolean).join(' · ')}
              </p>
              {!conversation.isTeam && (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[12px] font-medium text-emerald-400">En línea</span>
                </div>
              )}
            </div>
          </button>

          {/* Video / Alliance Room */}
          <button type="button"
            onClick={onOpenAllianceRoom || undefined}
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] transition hover:brightness-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <Video className="h-5 w-5 text-white/65" />
          </button>
        </div>
      </header>

      {/* ══ QUICK ACTION CARDS ══════════════════════════════════════ */}
      {!conversation.isTeam && (
        <div className="flex shrink-0 gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button type="button" onClick={() => setShowMeetingModal(true)}
            className="flex flex-1 items-center gap-3 rounded-[16px] px-4 py-3.5 text-left transition hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]"
              style={{ background: 'rgba(74,159,255,0.15)' }}>
              <Calendar className="h-4 w-4 text-[#4A9FFF]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white">Reunión</p>
              <p className="text-[11px] text-white/35">Agendar o ver reuniones</p>
            </div>
          </button>

          <button type="button"
            className="flex flex-1 items-center gap-3 rounded-[16px] px-4 py-3.5 text-left transition hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]"
              style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Share2 className="h-4 w-4 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white">Compartir</p>
              <p className="text-[11px] text-white/35">Perfil u oportunidad</p>
            </div>
          </button>
        </div>
      )}

      {/* ══ MEETING SCHEDULED FLASH ═════════════════════════════════ */}
      <AnimatePresence>
        {meetingScheduled && (
          <motion.div key="flash"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="shrink-0 px-5 py-2.5 text-[13px] font-semibold text-emerald-400"
            style={{ background: 'rgba(16,185,129,0.10)', borderBottom: '1px solid rgba(16,185,129,0.18)' }}>
            ✓ Reunión agendada — aparece en tu Calendario
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ MESSAGES ════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] space-y-3"
        style={{ overscrollBehavior: 'contain' }}>

        {/* Empty team state */}
        {conversation.isTeam && conversation.isEmpty && (
          <div className="rounded-[20px] p-5"
            style={{ background: 'linear-gradient(135deg, rgba(24,113,216,0.10) 0%, rgba(20,30,48,0.95) 100%)', border: '1px solid rgba(24,113,216,0.18)' }}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ background: 'rgba(24,113,216,0.15)' }}>
                <span className="text-[18px]">👥</span>
              </div>
              <div>
                <p className="text-[14px] font-bold text-white">Tu equipo está vacío</p>
                <p className="text-[12px] text-white/35">Invitá a colaboradores</p>
              </div>
            </div>
            <button type="button" onClick={() => setShowInviteModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] py-3 text-[14px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 14px rgba(24,113,216,0.30)' }}>
              <span>+</span> Invitar Integrantes
            </button>
          </div>
        )}

        {/* IA Card — collapsible, hidden by default */}
        <AnimatePresence>
          {showIaCard && !conversation.isTeam && conversation.score != null && (
            <motion.div key="ia"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="overflow-hidden rounded-[18px]"
              style={{ background: 'linear-gradient(135deg, rgba(24,59,130,0.55) 0%, rgba(14,30,70,0.80) 100%)', border: '1px solid rgba(74,159,255,0.22)' }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(74,159,255,0.12)' }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#4A9FFF]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A9FFF]">Análisis IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-black text-emerald-400">{iaData.score}%</span>
                  <button type="button" onClick={() => setShowIaCard(false)} className="text-white/25 hover:text-white/50"><X className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="px-4 pt-3 pb-1">
                <p className="text-[12px] leading-relaxed text-white/55">{iaData.reason}</p>
                <p className="mt-1.5 text-[13px] font-semibold text-white/85">{iaData.rec}</p>
                <div className="mt-1.5 flex items-start gap-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4A9FFF]/60" />
                  <p className="text-[11px] text-white/40">{iaData.step}</p>
                </div>
              </div>
              <div className="flex gap-2 px-4 py-3">
                <button type="button" onClick={() => { setShowIaCard(false); setShowMeetingModal(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2 text-[12px] font-bold text-white"
                  style={{ background: 'rgba(74,159,255,0.20)', border: '1px solid rgba(74,159,255,0.28)' }}>
                  <Calendar className="h-3 w-3" /> Reunión
                </button>
                <button type="button" onClick={() => { setShowIaCard(false); onProposalPreset?.(); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2 text-[12px] font-bold text-white"
                  style={{ background: 'rgba(139,92,246,0.20)', border: '1px solid rgba(139,92,246,0.28)' }}>
                  <FileText className="h-3 w-3" /> Propuesta
                </button>
                <button type="button" onClick={() => setShowIaCard(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2 text-[12px] font-bold text-white"
                  style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.28)' }}>
                  <Bot className="h-3 w-3" /> Guardar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date separator */}
        {conversation.messages.length > 0 && (
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[11px] font-medium text-white/25">Hoy</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        )}

        {/* Messages with avatar for others */}
        {conversation.messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} convId={conversation.company} initials={initials} />
        ))}

        {/* ── Propuesta comercial card ── */}
        {!conversation.isTeam && (
          <div className="mt-2 rounded-[18px] p-4"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                style={{ background: 'rgba(99,102,241,0.18)' }}>
                <FileText className="h-5 w-5 text-[#818CF8]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-white">Propuesta comercial</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-white/40">
                  Enviá una propuesta personalizada desde tus plantillas.
                </p>
              </div>
              <button type="button" onClick={onProposalPreset}
                className="flex shrink-0 items-center gap-1.5 rounded-[12px] px-4 py-2.5 text-[13px] font-bold text-white transition hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #5B21B6, #6D28D9)', boxShadow: '0 4px 14px rgba(99,102,241,0.30)' }}>
                Crear propuesta <span className="text-[14px]">›</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Quick action row ── */}
        {!conversation.isTeam && (
          <div className="flex gap-0 overflow-hidden rounded-[16px]"
            style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
            <button type="button" onClick={() => setShowTaskModal(true)}
              className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-semibold text-white/65 transition hover:bg-white/5 active:scale-95">
              <CheckCircle className="h-4 w-4 text-white/35" />
              Crear tarea
            </button>
            <div className="w-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
            <button type="button" onClick={onProposalPreset}
              className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-semibold text-white/65 transition hover:bg-white/5 active:scale-95">
              <Send className="h-4 w-4 text-white/35" />
              Enviar propuesta
            </button>
          </div>
        )}

        {/* Task created flash */}
        <AnimatePresence>
          {taskCreated && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-[12px] px-4 py-3"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <p className="text-[12px] font-bold text-emerald-400">✓ Task creada y sincronizada con Workplace</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ══ INPUT ═══════════════════════════════════════════════════ */}
      <ProposalInput
        onChange={onChangeDraft}
        onQuickAction={onQuickAction}
        onSend={onSend}
        value={proposalDraft}
      />

      {/* ══ CONTEXT BOTTOM SHEET ════════════════════════════════════ */}
      <AnimatePresence>
        {contextOpen && (
          <>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setContextOpen(false)} />
            <motion.div animate={{ y: 0 }} initial={{ y: '100%' }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute inset-x-0 bottom-0 z-30 flex max-h-[88%] flex-col overflow-hidden rounded-t-[24px]"
              style={{ background: '#0F1828', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="relative flex shrink-0 items-center justify-center pb-2 pt-3">
                <div className="h-1 w-10 rounded-full bg-white/20" />
                <button type="button" onClick={() => setContextOpen(false)}
                  className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/40">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="overflow-y-auto [scrollbar-width:none]">
                <ContextPanel
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

      {/* ══ MEETING MODAL ════════════════════════════════════════════ */}
      {showMeetingModal && (
        <MeetingModal conversation={conversation} onClose={() => setShowMeetingModal(false)} onConfirm={handleMeetingConfirm} />
      )}

      {/* ══ TASK MODAL ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal conversation={conversation} onClose={() => setShowTaskModal(false)}
            onConfirm={task => {
              onCreateTask?.(task);
              setShowTaskModal(false);
              setTaskCreated(true);
              setTimeout(() => setTaskCreated(false), 4000);
            }} />
        )}
      </AnimatePresence>

      {/* ══ INVITE MODAL ════════════════════════════════════════════ */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteModal key="invite-from-window"
            onClose={() => setShowInviteModal(false)}
            onInvited={() => { setShowInviteModal(false); onTeamInvite?.(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatWindow;
