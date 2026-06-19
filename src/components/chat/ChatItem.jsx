import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Archive, Bookmark, FileText, Star, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

/* ── Relationship state ─────────────────────────────────────────── */
const STATE_CFG = {
  activo:      { color: '#10B981', label: 'Activa',          border: 'rgba(16,185,129,0.50)'  },
  pendiente:   { color: '#F59E0B', label: 'Pendiente',       border: 'rgba(245,158,11,0.50)'  },
  negociacion: { color: '#4A9FFF', label: 'En negociación',  border: 'rgba(74,159,255,0.50)'  },
  cerrado:     { color: '#6B7280', label: 'Cerrada',         border: 'rgba(107,114,128,0.40)' },
};

/* ── Last-action label (no emojis) ─────────────────────────────── */
const ACTION_PREFIX = {
  audio:    'Audio · ',
  task:     'Task creada · ',
  meeting:  'Reunión agendada · ',
  proposal: 'Propuesta enviada · ',
  note:     'Nota · ',
};

/* ── Gradient per company name ──────────────────────────────────── */
const GRAD = [
  ['#6D28D9','#8B5CF6'], ['#1D4ED8','#3B82F6'],
  ['#047857','#10B981'], ['#BE185D','#EC4899'],
  ['#0E7490','#06B6D4'], ['#4338CA','#6366F1'],
  ['#B45309','#F59E0B'], ['#0369A1','#0EA5E9'],
];
function grad(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const [a, b] = GRAD[Math.abs(h) % GRAD.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/* ═══════════════════════════════════════════════════════════════════
   ChatItem
═══════════════════════════════════════════════════════════════════ */
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
  const x           = useMotionValue(0);
  const favOpacity  = useTransform(x, [0, 60],  [0, 1]);
  const archOpacity = useTransform(x, [-60, 0], [1, 0]);

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
  const prefix   = ACTION_PREFIX[lastMessageType] || '';
  const msgText  = lastMessage || contact || sector || '';

  const snap = () => animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 });

  const handleDragEnd = (_, info) => {
    if      (info.offset.x >  80) { onFavorite?.(conversation.id); }
    else if (info.offset.x < -80) { onArchive?.(conversation.id);  }
    snap();
  };

  const handlePointerDown = () => {
    pressTriggered.current = false;
    timerRef.current = window.setTimeout(() => {
      pressTriggered.current = true;
      setContextMenu(true);
    }, 520);
  };
  const cancelPress = () => { clearTimeout(timerRef.current); };
  const handleClick = () => {
    if (pressTriggered.current) { pressTriggered.current = false; return; }
    onSelect(conversation.id);
  };

  const ACTIONS = [
    { Icon: Star,     label: isFavorite ? 'Quitar dest.' : 'Destacar',  fn: () => { onFavorite?.(conversation.id); setContextMenu(false); } },
    { Icon: Bookmark, label: isPinned   ? 'Desanclar'   : 'Anclar',    fn: () => { onPin?.(conversation.id);      setContextMenu(false); } },
    { Icon: VolumeX,  label: 'Silenciar',                               fn: () => setContextMenu(false) },
    { Icon: Archive,  label: 'Archivar',                                fn: () => { onArchive?.(conversation.id);  setContextMenu(false); } },
  ];

  return (
    <div className="relative overflow-hidden rounded-[16px]">

      {/* Swipe reveal — Destacar */}
      <motion.div
        className="absolute inset-0 flex items-center rounded-[16px] pl-5"
        style={{
          background: 'linear-gradient(90deg, rgba(245,158,11,0.18) 0%, transparent 80%)',
          opacity: favOpacity, pointerEvents: 'none',
        }}>
        <Star className="h-4 w-4 text-amber-400" />
        <span className="ml-2 text-[12px] font-semibold text-amber-400">Destacar</span>
      </motion.div>

      {/* Swipe reveal — Archivar */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end rounded-[16px] pr-5"
        style={{
          background: 'linear-gradient(270deg, rgba(107,114,128,0.18) 0%, transparent 80%)',
          opacity: archOpacity, pointerEvents: 'none',
        }}>
        <span className="mr-2 text-[12px] font-semibold text-white/40">Archivar</span>
        <Archive className="h-4 w-4 text-white/40" />
      </motion.div>

      {/* Main card */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={cancelPress}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        className="relative w-full cursor-pointer select-none"
      >
        <div
          className="flex items-center gap-3 rounded-[14px] px-3 py-3 transition-colors"
          style={isActive
            ? { background: 'rgba(74,159,255,0.08)', border: '1px solid rgba(74,159,255,0.16)' }
            : { background: 'transparent', border: '1px solid transparent' }}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full font-['Space_Grotesk'] text-[13px] font-bold text-white"
              style={{ background: isTeam ? 'linear-gradient(135deg, #4C1D95, #7C3AED)' : grad(company) }}
            >
              {initials}
            </div>
            {/* State dot */}
            {!isTeam && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#0A0F1E]"
                style={{ background: cfg.color }} />
            )}
            {/* Unread badge */}
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1871D8] px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Row 1: name + time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <p className={`truncate text-[13px] leading-tight ${
                  isActive ? 'font-bold text-white' : unread > 0 ? 'font-bold text-white' : 'font-semibold text-white/80'
                }`}>
                  {company}
                </p>
                {isFavorite && <Star className="h-2.5 w-2.5 shrink-0 fill-amber-400 text-amber-400" />}
              </div>
              <p className="shrink-0 text-[11px] text-white/25">{lastInteraction}</p>
            </div>

            {/* Row 2: last message */}
            <p className={`mt-0.5 line-clamp-1 text-[12px] leading-snug ${
              unread > 0 ? 'text-white/60' : 'text-white/30'
            }`}>
              {prefix}{msgText || [sector, contact].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Context menu */}
      {contextMenu && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-around rounded-[16px] px-3"
          style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.10)' }}
          onClick={() => setContextMenu(false)}>
          {ACTIONS.map(({ Icon, label, fn }) => (
            <button key={label} onClick={(e) => { e.stopPropagation(); fn(); }} type="button"
              className="flex flex-col items-center gap-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/8 transition hover:bg-white/15">
                <Icon className="h-4 w-4 text-white/70" />
              </div>
              <span className="text-[10px] font-medium text-white/50">{label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default ChatItem;
