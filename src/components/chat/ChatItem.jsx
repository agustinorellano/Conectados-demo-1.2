import { motion } from 'framer-motion';

/* ── Status dot color ────────────────────────────────────────────── */
function statusDotClass(state) {
  if (state === 'activo') return 'bg-emerald-400';
  if (state === 'pendiente') return 'bg-amber-400';
  return 'bg-slate-300';
}

function ChatItem({ conversation, isActive, onSelect }) {
  const { company, logo, sector, contact, lastMessage, lastInteraction, unread, tags, score, businessState, isTeam } = conversation;

  const initials = logo && /^[A-Z]{1,3}$/.test(logo)
    ? logo
    : company?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '??';

  const displayTags = Array.isArray(tags) ? tags.slice(0, 2) : [];

  return (
    <motion.button
      className={`w-full rounded-[18px] border px-3.5 py-3 text-left transition-all duration-150 ${
        isActive
          ? 'border-[#1871D8]/20 bg-[#F0F7FF] shadow-sm'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm'
      }`}
      onClick={() => onSelect(conversation.id)}
      type="button"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.12 }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#141E30] to-[#35577D] font-['Space_Grotesk'] text-[11px] font-bold text-white">
            {initials}
          </div>
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1871D8] text-[9px] font-bold text-white ring-2 ring-white">
              {unread}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Row 1: company + time */}
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[14px] font-semibold text-[#1A1A1A]">{company}</p>
            <p className="shrink-0 text-[11px] text-slate-400">{lastInteraction}</p>
          </div>

          {/* Row 2: contact/sector + score badge */}
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="truncate text-[12px] text-slate-400">{contact || sector}</p>
            {score != null && !isTeam && (
              <span className="shrink-0 rounded-full bg-[#1A2744] px-2 py-0.5 text-[11px] font-bold text-white">
                {score}
              </span>
            )}
          </div>

          {/* Row 3: last message */}
          {lastMessage && (
            <p className="mt-1 line-clamp-1 text-[12px] text-slate-500">{lastMessage}</p>
          )}

          {/* Row 4: tags + status dot (or team pill) */}
          <div className="mt-1.5 flex items-center gap-1.5">
            {displayTags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto flex items-center">
              {isTeam ? (
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200">
                  Interno
                </span>
              ) : (
                <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass(businessState)}`} />
              )}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default ChatItem;
