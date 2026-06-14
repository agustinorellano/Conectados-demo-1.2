import { useEffect, useRef, useState } from 'react';
import { Calendar, CheckSquare, Clock, Eye, Pause, Play, ThumbsDown, ThumbsUp } from 'lucide-react';

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

/* ── Shell ───────────────────────────────────────────────────────── */
function Shell({ isOwn, time, status, initials, convId, children }) {
  if (isOwn) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[78%] flex-col">
          {children}
          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-[10px] text-white/25">{time}</span>
            {status === 'read'      && <span className="text-[10px] text-[#4A9FFF]">✓✓</span>}
            {status === 'delivered' && <span className="text-[10px] text-white/35">✓✓</span>}
            {!status                && <span className="text-[10px] text-white/35">✓</span>}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-['Space_Grotesk'] text-[11px] font-bold text-white"
        style={{ background: avatarGrad(convId || '') }}>
        {initials || '?'}
      </div>
      <div className="flex max-w-[74%] flex-col">
        {children}
        <span className="mt-1 text-[10px] text-white/25">{time}</span>
      </div>
    </div>
  );
}

/* ── Text ────────────────────────────────────────────────────────── */
function TextBubble({ message, initials, convId }) {
  const isOwn = message.sender === 'me';
  return (
    <Shell isOwn={isOwn} time={message.time} status={message.status} initials={initials} convId={convId}>
      <div className="px-4 py-3"
        style={isOwn ? {
          background: 'linear-gradient(135deg, #3730A3 0%, #4338CA 100%)',
          borderRadius: '18px 18px 4px 18px',
          boxShadow: '0 2px 12px rgba(67,56,202,0.35)',
        } : {
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '18px 18px 18px 4px',
        }}>
        <p className="text-[14px] leading-[1.55] text-white">{message.text}</p>
      </div>
    </Shell>
  );
}

/* ── Audio (real playback) ───────────────────────────────────────── */
const BARS = [3, 5, 8, 4, 9, 6, 3, 7, 5, 4, 8, 3, 6, 4, 7, 5, 8, 4, 6, 3];

function AudioBubble({ message, initials, convId }) {
  const isOwn  = message.sender === 'me';
  const audioRef = useRef(null);

  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);   // 0–1
  const [elapsed,  setElapsed]  = useState('0:00');

  /* Build / revoke object URL only once per message */
  const srcUrl = message.src || null;

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !srcUrl) return;

    const onTimeUpdate = () => {
      if (!el.duration) return;
      setProgress(el.currentTime / el.duration);
      const s = Math.floor(el.currentTime);
      setElapsed(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
    };
    const onEnded = () => { setPlaying(false); setProgress(0); setElapsed('0:00'); };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
    };
  }, [srcUrl]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else         { el.play().catch(() => {}); setPlaying(true); }
  };

  const handleSeek = (e) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  };

  const bubbleStyle = isOwn ? {
    background: 'linear-gradient(135deg, #3730A3 0%, #4338CA 100%)',
    borderRadius: '18px 18px 4px 18px',
    boxShadow: '0 2px 12px rgba(67,56,202,0.35)',
  } : {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '18px 18px 18px 4px',
  };

  return (
    <Shell isOwn={isOwn} time={message.time} status={message.status} initials={initials} convId={convId}>
      {srcUrl && <audio ref={audioRef} src={srcUrl} preload="metadata" />}

      <div className="flex items-center gap-3 px-4 py-3" style={bubbleStyle}>
        {/* Play/Pause */}
        <button type="button" onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          {playing
            ? <Pause  className="h-3.5 w-3.5 fill-current text-white" />
            : <Play   className="h-3.5 w-3.5 fill-current text-white" />}
        </button>

        {/* Waveform / progress bar */}
        <div className="flex flex-1 cursor-pointer flex-col gap-1" onClick={handleSeek}>
          {/* Bars */}
          <div className="flex items-end gap-[2px]">
            {BARS.map((h, i) => {
              const filled = progress > i / BARS.length;
              return (
                <div key={i} className="w-[2px] rounded-full transition-colors"
                  style={{ height: `${h * 2.2}px`, background: filled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }} />
              );
            })}
          </div>
          {/* Thin progress track */}
          <div className="h-0.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        {/* Time */}
        <span className="shrink-0 font-['Space_Grotesk'] text-[11px] tabular-nums text-white/50">
          {playing ? elapsed : (message.duration || '0:00')}
        </span>
      </div>
    </Shell>
  );
}

/* ── Task ────────────────────────────────────────────────────────── */
function TaskBubble({ message, initials, convId }) {
  const isOwn = message.sender === 'me';
  return (
    <Shell isOwn={isOwn} time={message.time} status={message.status} initials={initials} convId={convId}>
      <div className="px-4 py-3.5"
        style={{
          background: 'rgba(59,130,246,0.10)',
          border: '1px solid rgba(59,130,246,0.22)',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        }}>
        <div className="mb-2 flex items-center gap-2">
          <CheckSquare className="h-3.5 w-3.5 shrink-0 text-[#4A9FFF]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A9FFF]">Task creada</span>
        </div>
        <p className="text-[13px] font-semibold leading-snug text-white/90">{message.taskTitle || message.text}</p>
        {message.dueDate  && <p className="mt-1.5 text-[11px] text-white/35">Vence: {message.dueDate}</p>}
        {message.assignee && <p className="mt-0.5 text-[11px] text-white/35">→ {message.assignee}</p>}
      </div>
    </Shell>
  );
}

/* ── Meeting ─────────────────────────────────────────────────────── */
function MeetingBubble({ message, initials, convId }) {
  const isOwn = message.sender === 'me';
  return (
    <Shell isOwn={isOwn} time={message.time} status={message.status} initials={initials} convId={convId}>
      <div className="px-4 py-3.5"
        style={{
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        }}>
        <div className="mb-2 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#A78BFA]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA]">Reunión agendada</span>
        </div>
        <p className="text-[13px] font-semibold leading-snug text-white/90">{message.text}</p>
        {(message.meetingDate || message.meetingTime) && (
          <p className="mt-1.5 text-[11px] text-[#A78BFA]/60">
            {[message.meetingDate, message.meetingTime].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </Shell>
  );
}

/* ── Proposal ────────────────────────────────────────────────────── */
const PROPOSAL_STATUS = {
  pendiente:   { label: 'Pendiente',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  Icon: Clock      },
  vista:       { label: 'Vista',       color: '#4A9FFF', bg: 'rgba(74,159,255,0.10)',  border: 'rgba(74,159,255,0.22)',  Icon: Eye        },
  en_revision: { label: 'En revisión', color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.22)', Icon: Clock      },
  aceptada:    { label: 'Aceptada',    color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.28)', Icon: ThumbsUp   },
  rechazada:   { label: 'Rechazada',   color: '#EF4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.22)',  Icon: ThumbsDown },
};

function ProposalBubble({ message, initials, convId }) {
  const isOwn  = message.sender === 'me';
  const status = PROPOSAL_STATUS[message.proposalStatus || 'pendiente'];
  const SIcon  = status.Icon;
  return (
    <Shell isOwn={isOwn} time={message.time} status={message.status} initials={initials} convId={convId}>
      <div className="overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          minWidth: '230px',
        }}>
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">Propuesta comercial</span>
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: status.bg, border: `1px solid ${status.border}` }}>
            <SIcon className="h-3 w-3" style={{ color: status.color }} />
            <span className="text-[10px] font-bold" style={{ color: status.color }}>{status.label}</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="text-[14px] font-bold leading-snug text-white/90">{message.proposalTitle || message.text}</p>
          {message.proposalDescription && (
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">{message.proposalDescription}</p>
          )}
          {message.proposalBenefit && (
            <div className="mt-2.5 rounded-[10px] px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[11px] text-white/25">Beneficio ofrecido</p>
              <p className="mt-0.5 text-[12px] font-semibold text-white/65">{message.proposalBenefit}</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ── Router ──────────────────────────────────────────────────────── */
function MessageBubble({ message, initials, convId }) {
  const props = { message, initials, convId };
  switch (message.type) {
    case 'audio':    return <AudioBubble    {...props} />;
    case 'task':     return <TaskBubble     {...props} />;
    case 'meeting':  return <MeetingBubble  {...props} />;
    case 'proposal': return <ProposalBubble {...props} />;
    default:         return <TextBubble     {...props} />;
  }
}

export default MessageBubble;
