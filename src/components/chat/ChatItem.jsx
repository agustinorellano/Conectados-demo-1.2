import { motion } from 'framer-motion';

function statusDotClass(state) {
  if (state === 'activo')    return 'bg-emerald-400';
  if (state === 'pendiente') return 'bg-amber-400';
  return 'bg-slate-300';
}

function ChatItem({ conversation, isActive, onSelect }) {
  const {
    company, logo, sector, contact,
    lastMessage, lastInteraction,
    unread, score, businessState, isTeam,
  } = conversation;

  const initials = logo && /^[A-Z]{1,3}$/.test(logo)
    ? logo
    : company?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '??';

  return (
    <motion.button
      className={`w-full min-h-[72px] rounded-2xl px-3 py-3.5 text-left transition-colors duration-150 ${
        isActive ? 'bg-[#EEF5FF] ring-1 ring-inset ring-[#1871D8]/15' : 'hover:bg-slate-50'
      }`}
      onClick={() => onSelect(conversation.id)}
      type="button"
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center gap-3">

        {/* Avatar — 48px with status dot */}
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#141E30] to-[#35577D] font-['Space_Grotesk'] text-[12px] font-bold text-white">
            {initials}
          </div>

          {/* Status dot */}
          {!isTeam && (
            <span
              className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${statusDotClass(businessState)}`}
            />
          )}

          {/* Unread badge */}
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#1871D8] px-1 text-[9px] font-bold text-white ring-2 ring-white">
              {unread}
            </span>
          )}
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          {/* Row 1: company name + score badge + timestamp */}
          <div className="flex items-center justify-between gap-2">
            <p className={`truncate text-[14px] font-semibold leading-snug ${
              isActive ? 'text-[#1871D8]' : 'text-[#1A1A1A]'
            }`}>
              {company}
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              {score != null && !isTeam && (
                <span className="rounded-full bg-[#141E30]/90 px-2 py-0.5 text-[10px] font-bold text-white">
                  {score}
                </span>
              )}
              <p className="text-[11px] text-slate-400 whitespace-nowrap">{lastInteraction}</p>
            </div>
          </div>

          {/* Row 2: last message preview */}
          <p className="mt-0.5 line-clamp-1 text-[13px] leading-snug text-slate-400">
            {lastMessage || contact || sector}
          </p>

          {/* Team pill */}
          {isTeam && (
            <span className="mt-1.5 inline-block rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              Interno
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default ChatItem;
