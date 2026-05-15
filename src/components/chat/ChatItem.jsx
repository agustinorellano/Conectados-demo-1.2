import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Archive, Bookmark, Star, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

/* ── Business state config ─────────────────────────────────────── */
const STATE_CFG = {
  activo:    { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700',  label: 'Activo'    },
  pendiente: { dot: 'bg-amber-400',   badge: 'bg-amber-50   text-amber-700',    label: 'Pendiente' },
  cerrado:   { dot: 'bg-slate-300',   badge: 'bg-slate-100  text-slate-500',    label: 'Cerrado'   },
  inactivo:  { dot: 'bg-slate-200',   badge: 'bg-slate-50   text-slate-400',    label: 'Inactivo'  },
};

/* ── Message-type prefix ────────────────────────────────────────── */
const MSG_PREFIX = { audio: '🎤 ', task: '✅ ', meeting: '📅 ', note: '📝 ' };

/* ═══════════════════════════════════════════════════════════════════
   ChatItem — swipe actions + long-press context menu + rich badges
══════════════════════════════════════════════════════════════════════ */
function ChatItem({
  conversation,
  isActive,
  onSelect,
  onArchive,
  onPin,
  onFavorite,
  isFavorite,
  isPinned,
}) {
  /* ── Drag motion values ── */
  const x            = useMotionValue(0);
  const pinOpacity   = useTransform(x, [0,   60], [0, 1]);
  const archOpacity  = useTransform(x, [-60,  0], [1, 0]);

  /* ── Long-press state ── */
  const timerRef       = useRef(null);
  const pressTriggered = useRef(false);
  const [contextMenu, setContextMenu] = useState(false);

  const {
    company, logo, sector, contact,
    lastMessage, lastInteraction,
    unread, score, businessState, isTeam,
    taskCount, proposalCount, lastMessageType,
  } = conversation;

  const cfg      = STATE_CFG[businessState] || STATE_CFG.pendiente;
  const initials = logo && /^[A-Z]{1,3}$/.test(logo)
    ? logo
    : company?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '??';
  const prefix   = MSG_PREFIX[lastMessageType] || '';
  const msgText  = lastMessage || contact || sector || '';

  /* ── Snap helper ── */
  const snap = () => animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 });

  /* ── Drag end — trigger action then snap back ── */
  const handleDragEnd = (_, info) => {
    if      (info.offset.x >  75) { onPin?.(conversation.id);     }
    else if (info.offset.x < -75) { onArchive?.(conversation.id); }
    snap();
  };

  /* ── Long-press handlers ── */
  const handlePointerDown = () => {
    pressTriggered.current = false;
    timerRef.current = window.setTimeout(() => {
      pressTriggered.current = true;
      setContextMenu(true);
    }, 520);
  };
  const cancelPress = () => { if (timerRef.current) clearTimeout(timerRef.current); };
  const handleClick = () => {
    if (pressTriggered.current) { pressTriggered.current = false; return; }
    onSelect(conversation.id);
  };

  /* ── Context menu actions ── */
  const ACTIONS = [
    { Icon: Star,     label: isFavorite ? 'Quitar fav.' : 'Favorito', fn: () => { onFavorite?.(conversation.id); setContextMenu(false); } },
    { Icon: Bookmark, label: isPinned   ? 'Quitar pin'  : 'Anclar',   fn: () => { onPin?.(conversation.id);      setContextMenu(false); } },
    { Icon: VolumeX,  label: 'Silenciar',                             fn: () => setContextMenu(false) },
    { Icon: Archive,  label: 'Archivar',                              fn: () => { onArchive?.(conversation.id);   setContextMenu(false); } },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl">

      {/* ── Pin hint — revealed on right swipe ── */}
      <motion.div
        className="absolute inset-0 flex items-center rounded-2xl pl-5"
        style={{
          background: 'linear-gradient(90deg, #D1FAE5 0%, rgba(209,250,229,0) 80%)',
          opacity: pinOpacity,
          pointerEvents: 'none',
        }}
      >
        <Star className="h-5 w-5 text-emerald-500" />
        <span className="ml-1.5 text-[12px] font-semibold text-emerald-600">Favorito</span>
      </motion.div>

      {/* ── Archive hint — revealed on left swipe ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end rounded-2xl pr-5"
        style={{
          background: 'linear-gradient(270deg, #F1F5F9 0%, rgba(241,245,249,0) 80%)',
          opacity: archOpacity,
          pointerEvents: 'none',
        }}
      >
        <span className="mr-1.5 text-[12px] font-semibold text-slate-500">Archivar</span>
        <Archive className="h-5 w-5 text-slate-500" />
      </motion.div>

      {/* ── Main draggable card ── */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.18}
        dragMomentum={false}
        onDragStart={cancelPress}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        className={`relative w-full cursor-pointer select-none rounded-2xl px-3 py-3.5 transition-colors duration-150 ${
          isActive ? 'bg-[#EEF5FF] ring-1 ring-inset ring-[#1871D8]/15' : 'bg-white hover:bg-slate-50'
        }${isPinned ? ' border-l-2 border-[#1871D8]/30' : ''}`}
      >
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full font-['Space_Grotesk'] text-[13px] font-bold text-white"
              style={{
                background: isTeam
                  ? 'linear-gradient(135deg, #4C1D95, #7C3AED)'
                  : 'linear-gradient(135deg, #141E30, #35577D)',
              }}
            >
              {initials}
            </div>

            {/* Status dot */}
            {!isTeam && (
              <span
                className={`absolute bottom-0.5 right-0.5 h-[11px] w-[11px] rounded-full ring-2 ring-white ${cfg.dot}`}
              />
            )}

            {/* Unread badge */}
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#1871D8] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {unread}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 pt-0.5">

            {/* Row 1: name + score + time */}
            <div className="flex items-center justify-between gap-2">
              <p className={`truncate text-[14px] leading-tight ${
                isActive ? 'text-[#1871D8]' : 'text-[#1A1A1A]'
              } ${unread > 0 ? 'font-bold' : 'font-semibold'}`}>
                {company}
                {isFavorite && <span className="ml-1 text-amber-400 text-[12px]">★</span>}
                {isPinned   && <span className="ml-1 text-[10px] text-slate-400">📌</span>}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                {score != null && !isTeam && (
                  <span className="rounded-full bg-[#141E30]/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    {score}
                  </span>
                )}
                <p className="whitespace-nowrap text-[11px] text-slate-400">{lastInteraction}</p>
              </div>
            </div>

            {/* Row 2: last message preview */}
            <p className={`mt-0.5 line-clamp-1 text-[13px] leading-snug ${
              unread > 0 ? 'font-medium text-slate-600' : 'text-slate-400'
            }`}>
              {prefix}{msgText}
            </p>

            {/* Row 3: status + extra badges */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {!isTeam && businessState && (
                <span className={`rounded-full px-2 py-[1px] text-[10px] font-semibold capitalize ${cfg.badge}`}>
                  {cfg.label}
                </span>
              )}
              {isTeam && (
                <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-[1px] text-[10px] font-semibold text-violet-700">
                  Interno
                </span>
              )}
              {taskCount > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-[1px] text-[10px] font-semibold text-blue-600">
                  ✅ {taskCount}
                </span>
              )}
              {proposalCount > 0 && (
                <span className="rounded-full bg-indigo-50 px-2 py-[1px] text-[10px] font-semibold text-indigo-600">
                  📄 {proposalCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Context menu overlay ── */}
      {contextMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-around rounded-2xl px-3"
          style={{ background: 'rgba(15,23,42,0.93)', backdropFilter: 'blur(4px)' }}
          onClick={() => setContextMenu(false)}
        >
          {ACTIONS.map(({ Icon, label, fn }) => (
            <button
              key={label}
              onClick={(e) => { e.stopPropagation(); fn(); }}
              type="button"
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-white/70">{label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default ChatItem;
