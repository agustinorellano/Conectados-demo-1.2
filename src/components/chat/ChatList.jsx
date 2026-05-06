import { Handshake, Users } from 'lucide-react';
import ChatItem from './ChatItem';

const statusToneMap = {
  'Activa': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Seguimiento': 'bg-amber-50 text-amber-700 border-amber-100',
  'Match activo': 'bg-blue-50 text-[#1871D8] border-blue-100',
  'Esperando respuesta': 'bg-amber-50 text-amber-700 border-amber-100',
  'Outbound': 'bg-violet-50 text-violet-700 border-violet-100'
};

function SectionHeader({ icon: Icon, title, count }) {
  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </span>
      {count > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
          {count}
        </span>
      )}
    </div>
  );
}

function ChatList({
  allowDirectMessage,
  conversations,
  onCreateOutbound,
  activeId,
  onSelect,
  recentMatches
}) {
  const matchConversations = conversations.filter((c) => !c.isTeam);
  const teamConversations = conversations.filter((c) => c.isTeam);

  return (
    <aside className="flex flex-col gap-1 rounded-[24px] border border-slate-200 bg-white/82 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
          Conversaciones
        </p>
        <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
          Bandeja comercial
        </h2>
      </div>

      {/* MATCHES */}
      <SectionHeader icon={Handshake} title="Matches" count={matchConversations.length} />

      <div className="space-y-2">
        {matchConversations.map((conversation) => (
          <ChatItem
            conversation={conversation}
            isActive={conversation.id === activeId}
            key={conversation.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {recentMatches.length > 0 && (
        <div className="mt-2 space-y-2">
          {recentMatches
            .filter((m) => !matchConversations.some((c) => c.id === m.id || c.company === m.name))
            .map((match) => (
              <div
                className="flex items-center gap-3 rounded-[18px] bg-blue-50 px-3 py-3 ring-1 ring-inset ring-blue-100"
                key={match.id}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-xs font-bold text-white">
                  {match.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1A1A1A]">{match.name}</p>
                  <p className="text-xs text-[#1871D8]">Match — Chat habilitado</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TEAMS */}
      {teamConversations.length > 0 && (
        <>
          <div className="mt-4">
            <SectionHeader icon={Users} title="Teams" count={teamConversations.length} />
          </div>

          <div className="space-y-2">
            {teamConversations.map((conversation) => (
              <ChatItem
                conversation={conversation}
                isActive={conversation.id === activeId}
                key={conversation.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </>
      )}

      {allowDirectMessage ? (
        <button
          className="mt-4 inline-flex w-full items-center justify-center rounded-[18px] bg-[#0B412F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a3828]"
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
    </aside>
  );
}

export default ChatList;
