import { Calendar, CheckSquare, Play } from 'lucide-react';

/* ── Shell wrapper ──────────────────────────────────────────────── */
function Shell({ isOwn, time, showTicks = true, children }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} chat-message-enter`}>
      <div className="flex max-w-[82%] flex-col">
        {children}
        <p className={`mt-1 text-[11px] ${isOwn ? 'text-right' : ''} text-slate-400`}>
          {isOwn && showTicks ? `${time} ✓✓` : time}
        </p>
      </div>
    </div>
  );
}

/* ── Text ───────────────────────────────────────────────────────── */
function TextBubble({ message }) {
  const isOwn = message.sender === 'me';
  return (
    <Shell isOwn={isOwn} time={message.time}>
      <div
        className={`px-[14px] py-3 ${
          isOwn
            ? 'rounded-[18px] rounded-tr-sm bg-[#1A2744] text-white shadow-sm'
            : 'rounded-[18px] rounded-tl-sm border border-slate-100 bg-white text-[#1A1A1A] shadow-sm'
        }`}
      >
        <p className="text-[14px] leading-[1.5]">{message.text}</p>
      </div>
    </Shell>
  );
}

/* ── Audio ──────────────────────────────────────────────────────── */
function AudioBubble({ message }) {
  const isOwn = message.sender === 'me';
  const bars  = [3, 5, 8, 4, 9, 6, 3, 7, 5, 4, 8, 3];
  return (
    <Shell isOwn={isOwn} time={message.time}>
      <div
        className={`flex items-center gap-3 rounded-[18px] px-4 py-3 shadow-sm ${
          isOwn
            ? 'rounded-tr-sm bg-[#1A2744]'
            : 'rounded-tl-sm border border-slate-100 bg-white'
        }`}
      >
        <button
          type="button"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isOwn ? 'bg-white/15 text-white' : 'bg-[#1A2744]/10 text-[#1A2744]'
          }`}
        >
          <Play className="h-4 w-4 fill-current" />
        </button>

        {/* Waveform */}
        <div className="flex flex-1 items-center gap-0.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`w-[2px] rounded-full ${isOwn ? 'bg-white/50' : 'bg-slate-300'}`}
              style={{ height: `${h * 2}px` }}
            />
          ))}
        </div>

        <span className={`shrink-0 text-[11px] ${isOwn ? 'text-white/55' : 'text-slate-400'}`}>
          {message.duration || '0:12'}
        </span>
      </div>
    </Shell>
  );
}

/* ── Task ───────────────────────────────────────────────────────── */
function TaskBubble({ message }) {
  const isOwn = message.sender === 'me';
  return (
    <Shell isOwn={isOwn} time={message.time} showTicks={false}>
      <div
        className={`rounded-[16px] border px-4 py-3 shadow-sm ${
          isOwn ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <CheckSquare className="h-4 w-4 shrink-0 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Task creada
          </span>
        </div>
        <p className="text-[13px] font-semibold leading-snug text-[#1A1A1A]">
          {message.taskTitle || message.text}
        </p>
        {message.dueDate && (
          <p className="mt-1 text-[11px] text-slate-400">Vence: {message.dueDate}</p>
        )}
        {message.assignee && (
          <p className="mt-0.5 text-[11px] text-slate-400">→ {message.assignee}</p>
        )}
      </div>
    </Shell>
  );
}

/* ── Meeting ────────────────────────────────────────────────────── */
function MeetingBubble({ message }) {
  const isOwn = message.sender === 'me';
  return (
    <Shell isOwn={isOwn} time={message.time} showTicks={false}>
      <div className="rounded-[16px] border border-indigo-200 bg-indigo-50 px-4 py-3 shadow-sm">
        <div className="mb-1.5 flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            Reunión agendada
          </span>
        </div>
        <p className="text-[13px] font-semibold leading-snug text-[#1A1A1A]">
          {message.text}
        </p>
        {(message.meetingDate || message.meetingTime) && (
          <p className="mt-1 text-[11px] text-indigo-400">
            {[message.meetingDate, message.meetingTime].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </Shell>
  );
}

/* ── Router ─────────────────────────────────────────────────────── */
function MessageBubble({ message }) {
  switch (message.type) {
    case 'audio':   return <AudioBubble   message={message} />;
    case 'task':    return <TaskBubble    message={message} />;
    case 'meeting': return <MeetingBubble message={message} />;
    default:        return <TextBubble    message={message} />;
  }
}

export default MessageBubble;
