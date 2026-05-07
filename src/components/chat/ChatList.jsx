import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, Handshake, Search, Users, X } from 'lucide-react';
import ChatItem from './ChatItem';

/* ── Section header ──────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, title, count }) {
  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-3 w-3 text-slate-500" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {title}
      </span>
      {count > 0 && (
        <span className="ml-auto flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-slate-200 px-1 text-[10px] font-bold text-slate-600">
          {count}
        </span>
      )}
    </div>
  );
}

/* ── Filter pill counts ──────────────────────────────────────────── */
function getFilterCount(conversations, filter) {
  if (filter === 'Todos') return conversations.length;
  if (filter === 'Activos')
    return conversations.filter(c => c.businessState === 'activo' || c.activity === 'Activa').length;
  if (filter === 'Pendientes')
    return conversations.filter(c => c.businessState === 'pendiente' || c.activity === 'Seguimiento').length;
  if (filter === 'Cerrados')
    return conversations.filter(c => c.businessState === 'cerrado').length;
  return 0;
}

function matchesFilter(conv, filter) {
  if (filter === 'Todos') return true;
  if (filter === 'Activos') return conv.businessState === 'activo' || conv.activity === 'Activa';
  if (filter === 'Pendientes') return conv.businessState === 'pendiente' || conv.activity === 'Seguimiento';
  if (filter === 'Cerrados') return conv.businessState === 'cerrado';
  return true;
}

function matchesSearch(conv, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    conv.company?.toLowerCase().includes(q) ||
    conv.contact?.toLowerCase().includes(q) ||
    conv.sector?.toLowerCase().includes(q) ||
    (Array.isArray(conv.tags) && conv.tags.some(t => t.toLowerCase().includes(q)))
  );
}

/* ── ChatList ────────────────────────────────────────────────────── */
const FILTERS = ['Todos', 'Activos', 'Pendientes', 'Cerrados'];

function ChatList({
  conversations,
  activeId,
  onSelect,
  allowDirectMessage,
  onCreateOutbound,
  recentMatches,
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const debounceTimer = useRef(null);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const filtered = useMemo(() =>
    conversations.filter(c => matchesSearch(c, debouncedQuery) && matchesFilter(c, activeFilter)),
    [conversations, debouncedQuery, activeFilter]
  );

  const matchConversations = filtered.filter(c => !c.isTeam);
  const teamConversations = filtered.filter(c => c.isTeam);
  const isEmpty = filtered.length === 0;

  return (
    <div className="flex w-[300px] shrink-0 flex-col border-r border-slate-100">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#1871D8]">
            CONVERSACIONES
          </p>
          <h2 className="mt-1 font-['Space_Grotesk'] text-[17px] font-bold tracking-tight text-[#1A1A1A]">
            Chats
          </h2>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[#0B412F] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0a3828] hover:shadow-md"
          onClick={allowDirectMessage ? onCreateOutbound : undefined}
          title={allowDirectMessage ? 'Nueva conversación' : 'Disponible en Plan Scale'}
          type="button"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-[#1871D8]/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1871D8]/10">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-[13px] text-[#1A1A1A] outline-none placeholder:text-slate-400"
            onChange={handleSearchChange}
            placeholder="Buscar empresa, contacto o team…"
            value={query}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                onClick={handleClearSearch}
                type="button"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 text-slate-600 hover:bg-slate-400 transition"
              >
                <X className="h-2.5 w-2.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter;
          const count = getFilterCount(conversations, filter);
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#0B412F] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {filter}
              {!isActive && count > 0 ? ` (${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* ── Conversation list ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-600">
                {debouncedQuery
                  ? 'No se encontraron conversaciones'
                  : 'Todavía no tenés conversaciones activas'}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {debouncedQuery ? `Sin resultados para "${debouncedQuery}"` : 'Iniciá una nueva para comenzar'}
              </p>
            </div>
            <button
              onClick={debouncedQuery ? handleClearSearch : (allowDirectMessage ? onCreateOutbound : undefined)}
              type="button"
              className="rounded-[12px] bg-[#0B412F] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0a3828]"
            >
              {debouncedQuery ? 'Limpiar búsqueda' : 'Iniciar nueva conversación'}
            </button>
          </div>
        ) : (
          <>
            {/* Matches section */}
            {matchConversations.length > 0 && (
              <>
                <SectionHeader icon={Handshake} title="Matches" count={matchConversations.length} />
                <AnimatePresence initial={false}>
                  {matchConversations.map(conv => (
                    <motion.div
                      key={conv.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChatItem
                        conversation={conv}
                        isActive={conv.id === activeId}
                        onSelect={onSelect}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}

            {/* Teams section */}
            {teamConversations.length > 0 && (
              <div className="mt-2">
                <SectionHeader icon={Users} title="Teams" count={teamConversations.length} />
                <AnimatePresence initial={false}>
                  {teamConversations.map(conv => (
                    <motion.div
                      key={conv.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChatItem
                        conversation={conv}
                        isActive={conv.id === activeId}
                        onSelect={onSelect}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default ChatList;
