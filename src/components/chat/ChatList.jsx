import { Building2, Sparkles } from 'lucide-react';
import ChatItem from './ChatItem';

function ChatList({
  allowDirectMessage,
  conversations,
  onCreateOutbound,
  activeId,
  onSelect,
  recentMatches
}) {
  return (
    <aside className="rounded-[24px] border border-slate-200 bg-white/82 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
            Conversaciones
          </p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Bandeja comercial
          </h2>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
          <Building2 className="h-4 w-4" />
        </div>
      </div>

      {allowDirectMessage ? (
        <button
          className="mt-4 inline-flex w-full items-center justify-center rounded-[18px] bg-[#0B412F] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          onClick={onCreateOutbound}
          type="button"
        >
          Mensaje directo sin match
        </button>
      ) : (
        <div className="mt-4 rounded-[18px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500 ring-1 ring-inset ring-slate-200">
          Los mensajes outbound sin match se habilitan en el plan Scale.
        </div>
      )}

      <div className="mt-5 space-y-3">
        {conversations.map((conversation) => (
          <ChatItem
            conversation={conversation}
            isActive={conversation.id === activeId}
            key={conversation.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="mt-5 rounded-[20px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#1871D8]" />
          <p className="text-sm font-semibold text-[#1A1A1A]">Matches recientes</p>
        </div>

        {recentMatches.length ? (
          <div className="mt-3 space-y-2">
            {recentMatches.map((match) => (
              <div
                className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm"
                key={match.id}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-xs font-bold text-white">
                  {match.logo}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                    {match.name}
                  </p>
                  <p className="text-xs text-slate-500">Chat habilitado</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">
            Cuando cierres un match, el canal comercial aparecera aca automaticamente.
          </p>
        )}
      </div>
    </aside>
  );
}

export default ChatList;
