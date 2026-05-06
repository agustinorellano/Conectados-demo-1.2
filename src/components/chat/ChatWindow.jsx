import { Calendar, MapPin, Send, Share2, TrendingUp, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import MessageBubble from './MessageBubble';
import ProposalInput from './ProposalInput';

/* ── Derive initials from logo/company ──────────────────────────── */
function getInitials(logo, company) {
  if (logo && /^[A-Z]{2}$/.test(logo)) return logo;
  if (!company) return 'XX';
  return company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* ── Today in YYYY-MM-DD ─────────────────────────────────────────── */
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ── Schedule Meeting Modal ──────────────────────────────────────── */
function MeetingModal({ conversation, onClose, onConfirm }) {
  const initials = getInitials(conversation.logo, conversation.company);
  const [date, setDate] = useState(todayIso());
  const [time, setTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      title: `Reunión ${conversation.company}`,
      company: conversation.company,
      companyInitials: initials,
      date,
      time,
      endTime,
      type: 'video'
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
          onClick={(e) => e.stopPropagation()}
          transition={{ duration: 0.22, ease: [0.34, 1.1, 0.64, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1871D8]">
                Agenda
              </p>
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

          {/* Company badge */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{conversation.company}</p>
              <p className="text-xs text-slate-400">{conversation.sector}</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
                Fecha
              </label>
              <input
                className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
                min={todayIso()}
                onChange={(e) => setDate(e.target.value)}
                required
                type="date"
                value={date}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
                  Inicio
                </label>
                <input
                  className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
                  onChange={(e) => setTime(e.target.value)}
                  required
                  type="time"
                  value={time}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
                  Fin
                </label>
                <input
                  className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#1A1A1A] outline-none transition focus:border-[#1871D8] focus:ring-2 focus:ring-[#1871D8]/15"
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  type="time"
                  value={endTime}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                className="flex-1 rounded-[16px] border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="flex-1 rounded-[16px] bg-[#0B412F] py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0a3828] hover:shadow-md"
                type="submit"
              >
                Confirmar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── ChatWindow ──────────────────────────────────────────────────── */
function ChatWindow({
  conversation,
  onChangeDraft,
  onConvertToOpportunity,
  onProposalPreset,
  onQuickAction,
  onScheduleMeeting,
  onSend,
  proposalDraft
}) {
  const [converted, setConverted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingScheduled, setMeetingScheduled] = useState(false);

  const handleConvert = () => {
    setConverted(true);
    setShowConfirm(true);
    onConvertToOpportunity?.(conversation);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  const handleMeetingConfirm = (meeting) => {
    onScheduleMeeting?.(meeting);
    setMeetingScheduled(true);
    setTimeout(() => setMeetingScheduled(false), 3000);
  };

  const quickHeaderActions = [
    { key: 'meeting', icon: Calendar, label: 'Agendar reunion', onClick: () => setShowMeetingModal(true) },
    { key: 'proposal', icon: Send, label: 'Enviar propuesta', onClick: onProposalPreset },
    { key: 'profile', icon: Share2, label: 'Compartir perfil', onClick: null }
  ];

  const statusTone = conversation.status === 'En negociacion' || conversation.status === 'Match activo'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : conversation.status === 'Esperando respuesta' || conversation.status === 'Seguimiento'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-slate-200 bg-slate-50 text-slate-600';

  return (
    <>
      <section className="flex min-h-[720px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white/86 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur">
        {/* HEADER */}
        <header className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-sm font-bold text-white shadow-sm">
                {conversation.logo}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
                  Canal activo
                </p>
                <h2 className="mt-1.5 font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#1A1A1A]">
                  {conversation.company}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {conversation.sector}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    <MapPin className="h-3 w-3" />
                    {conversation.location}
                  </span>
                </div>
              </div>
            </div>

            <div className={`rounded-[16px] border px-3 py-2 text-right ${statusTone}`}>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">
                Estado
              </p>
              <p className="mt-0.5 text-sm font-bold">{conversation.status}</p>
            </div>
          </div>

          {/* ACCIONES RÁPIDAS */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {quickHeaderActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1871D8]/30 hover:text-[#1871D8] hover:shadow-md"
                  key={action.key}
                  onClick={action.onClick || undefined}
                  type="button"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              );
            })}

            {/* CONVERTIR EN OPORTUNIDAD */}
            <button
              className={`ml-auto inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                converted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#0B412F] text-white hover:bg-[#0a3828]'
              }`}
              disabled={converted}
              onClick={handleConvert}
              type="button"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              {converted ? 'Alianza activa' : 'Convertir en oportunidad'}
            </button>
          </div>
        </header>

        {/* CONFIRM FLASHES */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              Chat convertido en alianza activa. Visible en el Dashboard.
            </motion.div>
          )}
          {meetingScheduled && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -8 }}
              key="meeting-confirm"
              transition={{ duration: 0.2 }}
            >
              Reunión agendada. Aparece en el Calendario del Dashboard.
            </motion.div>
          )}
        </AnimatePresence>

        {/* MESSAGES */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,249,250,0.35),rgba(255,255,255,0.65))] px-5 py-5 scroll-smooth">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <ProposalInput
          onChange={onChangeDraft}
          onProposalPreset={onProposalPreset}
          onQuickAction={onQuickAction}
          onSend={onSend}
          proposalDraft={proposalDraft}
          quickActions={['Propuesta comercial', 'Alianza estrategica', 'Intercambio de clientes']}
          value={proposalDraft}
        />
      </section>

      {/* MEETING MODAL */}
      {showMeetingModal && (
        <MeetingModal
          conversation={conversation}
          onClose={() => setShowMeetingModal(false)}
          onConfirm={handleMeetingConfirm}
        />
      )}
    </>
  );
}

export default ChatWindow;
