import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, Search, X } from 'lucide-react';
import ChatItem from './ChatItem';

const FILTERS = ['Todos', 'Activos', 'Pendientes', 'Cerrados'];

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

function ChatList({
  conversations,
  activeId,
  onSelect,
  allowDirectMessage,
  onCreateOutbound,
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
    <div className="flex h-full flex-col">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <h2 className="font-['Space_Grotesk'] text-[20px] font-bold tracking-tight text-[#1A1A1A]">
          Chats
        </h2>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141E30] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1A2C45]"
          onClick={allowDirectMessage ? onCreateOutbound : undefined}
          title={allowDirectMessage ? 'Nueva conversación' : 'Disponible en Plan Scale'}
          type="button"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Search bar — 48px height, radius 16px ── */}
      <div className="px-4 pb-3">
        <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-[#1871D8]/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1871D8]/10">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-[13px] text-[#1A1A1A] outline-none placeholder:text-slate-400"
            onChange={handleSearchChange}
            placeholder="Buscar empresa o contacto..."
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
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-600 transition hover:bg-slate-400"
              >
                <X className="h-3 w-3" />
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
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#141E30] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {filter}
              {!isActive && count > 0 ? ` (${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* ── Conversation list — 8px gap between items ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-600">
                {debouncedQuery ? 'Sin resultados' : 'No hay conversaciones'}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {debouncedQuery ? `Para "${debouncedQuery}"` : 'Iniciá una nueva para comenzar'}
              </p>
            </div>
            <button
              onClick={debouncedQuery ? handleClearSearch : (allowDirectMessage ? onCreateOutbound : undefined)}
              type="button"
              className="rounded-full bg-[#141E30] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#1A2C45]"
            >
              {debouncedQuery ? 'Limpiar búsqueda' : 'Nueva conversación'}
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {/* Matches */}
            {matchConversations.length > 0 && (
              <>
                {teamConversations.length > 0 && (
                  <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Matches
                  </p>
                )}
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

            {/* Teams */}
            {teamConversations.length > 0 && (
              <div className={matchConversations.length > 0 ? 'mt-3' : ''}>
                <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Teams
                </p>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;
