function ChatItem({ conversation, isActive, onSelect }) {
  return (
    <button
      className={`w-full rounded-[20px] border px-4 py-4 text-left transition duration-200 ${
        isActive
          ? 'border-[#1871D8]/15 bg-blue-50/70 shadow-sm'
          : 'border-transparent bg-white/60 hover:border-slate-200 hover:bg-white hover:shadow-sm'
      }`}
      onClick={() => onSelect(conversation.id)}
      type="button"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-sm font-bold text-white shadow-sm">
          {conversation.logo}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                {conversation.company}
              </p>
              <p className="mt-1 text-sm text-[#4A4A4A]">
                {conversation.sector}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  conversation.unread > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              {conversation.unread > 0 ? (
                <span className="rounded-full bg-[#1871D8] px-2 py-1 text-[11px] font-semibold text-white">
                  {conversation.unread}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span className="truncate">{conversation.lastInteraction}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
              {conversation.activity}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4A4A4A]">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
}

export default ChatItem;
