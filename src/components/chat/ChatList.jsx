import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Edit3, Search, Video, X } from 'lucide-react';
import ChatItem from './ChatItem';

/* ── Filter definitions ─────────────────────────────────────────── */
const FILTERS = ['Activos', 'Pendientes', 'Favoritos', 'Archivados'];

function matchesFilter(conv, filter, favorites, archived) {
  const isArchived = archived.has(conv.id);
  if (filter === 'Archivados') return isArchived;
  if (isArchived) return false; // hide archived in all other tabs

  if (filter === 'Activos')   return conv.businessState === 'activo'    || conv.activity === 'Activa' || conv.isTeam;
  if (filter === 'Pendientes')return conv.businessState === 'pendiente' || conv.activity === 'Seguimiento';
  if (filter === 'Favoritos') return favorites.has(conv.id);
  return true;
}

function matchesSearch(conv, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    conv.company?.toLowerCase().includes(q) ||
    conv.contact?.toLowerCase().includes(q) ||
    conv.sector?.toLowerCase().includes(q)  ||
    (Array.isArray(conv.tags) && conv.tags.some(t => t.toLowerCase().includes(q)))
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ChatList — 4 tabs · search · Alliance Room · rich items
══════════════════════════════════════════════════════════════════════ */
function ChatList({
  conversations,
  activeId,
  onSelect,
  allowDirectMessage,
  onCreateOutbound,
  onOpenAssistant,
  onOpenAllianceRoom,
  /* Set-based state passed from parent */
  favorites,
  archived,
  pinned,
  onArchive,
  onFavorite,
  onPin,
}) {
  const [query,          setQuery]          = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter,   setActiveFilter]   = useState('Activos');
  const debounceTimer = useRef(null);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(val), 280);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    clearTimeout(debounceTimer.current);
  }, []);

  /* Filtered + sorted (pinned first) */
  const filtered = useMemo(() => {
    return conversations
      .filter(c => matchesSearch(c, debouncedQuery) && matchesFilter(c, activeFilter, favorites, archived))
      .sort((a, b) => {
        const ap = pinned.has(a.id) ? 0 : 1;
        const bp = pinned.has(b.id) ? 0 : 1;
        return ap - bp;
      });
  }, [conversations, debouncedQuery, activeFilter, favorites, archived, pinned]);

  /* Tab counts */
  const counts = useMemo(() => {
    const res = {};
    for (const f of FILTERS) {
      res[f] = conversations.filter(c => matchesFilter(c, f, favorites, archived)).length;
    }
    return res;
  }, [conversations, favorites, archived]);

  const matchConversations = filtered.filter(c => !c.isTeam);
  const teamConversations  = filtered.filter(c =>  c.isTeam);
  const isEmpty = filtered.length === 0;

  return (
    <div className="flex h-full flex-col">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="font-['Space_Grotesk'] text-[22px] font-bold tracking-tight text-[#1A1A1A]">
          Chats
        </h2>
        <div className="flex items-center gap-2">
          {onOpenAllianceRoom && (
            <button
              type="button"
              onClick={onOpenAllianceRoom}
              title="Alliance Room"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 transition hover:bg-violet-100 active:scale-95"
            >
              <Video className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={allowDirectMessage ? onCreateOutbound : undefined}
            title={allowDirectMessage ? 'Nueva conversación' : 'Disponible en Plan Scale'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#141E30] text-white shadow-sm transition active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="px-5 pb-3">
        <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#1871D8]/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1871D8]/10">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-[14px] text-[#1A1A1A] outline-none placeholder:text-slate-400"
            onChange={handleSearchChange}
            placeholder="Empresa, sector, tag…"
            value={query}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
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

      {/* ── Filter tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter;
          const count    = counts[filter];
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#141E30] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {filter}
              {count > 0 && (
                <span className={`ml-1 ${isActive ? 'text-white/55' : 'text-slate-400'}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Pinned: Asistente Virtual ── */}
      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={onOpenAssistant}
          className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(12,18,38,0.90) 0%, rgba(18,26,54,0.85) 100%)',
            border: '1px solid rgba(24,113,216,0.25)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(24,113,216,0.12)',
          }}
        >
          <div
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
            style={{
              background: 'linear-gradient(135deg, #1459B0, #1871D8)',
              boxShadow: '0 0 16px rgba(24,113,216,0.4)',
            }}
          >
            <Bot className="h-5 w-5 text-white" />
            <span
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 bg-emerald-400"
              style={{ borderColor: 'rgba(12,18,38,0.9)' }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">Asistente Virtual</p>
              <span className="rounded-full bg-[#1871D8]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#4A9FFF]">
                IA
              </span>
              <span className="ml-auto text-[10px] text-white/30">📌</span>
            </div>
            <p className="mt-0.5 truncate text-[12px] text-white/45">
              Propuestas, tips y optimización de perfil
            </p>
          </div>
        </button>
      </div>

      {/* ── Conversation list ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-600">
                {debouncedQuery
                  ? 'Sin resultados'
                  : activeFilter === 'Favoritos'
                  ? 'Sin favoritos todavía'
                  : activeFilter === 'Archivados'
                  ? 'Sin conversaciones archivadas'
                  : 'No hay conversaciones aquí'}
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                {debouncedQuery
                  ? `Para "${debouncedQuery}"`
                  : 'Cambiá el filtro o iniciá una nueva'}
              </p>
            </div>
            {debouncedQuery && (
              <button
                onClick={handleClearSearch}
                type="button"
                className="rounded-full bg-[#141E30] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1A2C45]"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-px">

            {/* Matches */}
            {matchConversations.length > 0 && (
              <>
                {teamConversations.length > 0 && (
                  <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
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
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.14 }}
                    >
                      <ChatItem
                        conversation={conv}
                        isActive={conv.id === activeId}
                        onSelect={onSelect}
                        onArchive={onArchive}
                        onPin={onPin}
                        onFavorite={onFavorite}
                        isFavorite={favorites.has(conv.id)}
                        isPinned={pinned.has(conv.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}

            {/* Team / Internal */}
            {teamConversations.length > 0 && (
              <div className={matchConversations.length > 0 ? 'mt-4' : ''}>
                <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Interno
                </p>
                <AnimatePresence initial={false}>
                  {teamConversations.map(conv => (
                    <motion.div
                      key={conv.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.14 }}
                    >
                      <ChatItem
                        conversation={conv}
                        isActive={conv.id === activeId}
                        onSelect={onSelect}
                        onArchive={onArchive}
                        onPin={onPin}
                        onFavorite={onFavorite}
                        isFavorite={favorites.has(conv.id)}
                        isPinned={pinned.has(conv.id)}
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
