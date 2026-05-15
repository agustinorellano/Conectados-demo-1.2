import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const PROPOSAL_TEMPLATE =
  'Tengo una propuesta para colaborar entre nuestras empresas que puede generar valor en conjunto. Me gustaria comentarte la idea y explorar como podemos trabajar juntos.';

/* ── Conversation enrichment defaults ── (IDs match mockCompanies.js) */
const CONV_DEFAULTS = {
  'luna-beauty': {
    tags: ['Cross-selling', 'Belleza'],
    score: 91,
    contact: 'Valentina Cruz',
    businessState: 'activo',
    taskCount: 2,
    proposalCount: 1,
    lastMessageType: 'task',
  },
  'cafe-patio': {
    tags: ['Evento', 'Tráfico local'],
    score: 74,
    contact: 'Marcos Pino',
    businessState: 'pendiente',
    taskCount: 1,
    proposalCount: 0,
  },
  'internal-marketing': {
    tags: ['Coordinación'],
    score: null,
    contact: 'Equipo Mkt',
    businessState: 'activo',
    taskCount: 0,
    proposalCount: 0,
  },
  /* Fixed IDs to match mockCompanies.js */
  'bloom-floreria-chat': {
    tags: ['Bundle', 'Primavera'],
    score: 88,
    contact: 'Florencia Del Valle',
    businessState: 'activo',
    taskCount: 0,
    proposalCount: 1,
  },
  'sushi-nakama-chat': {
    tags: ['Distribución', 'Gastronomía'],
    score: 67,
    contact: 'Naomi Tanaka',
    businessState: 'pendiente',
    taskCount: 0,
    proposalCount: 1,
  },
};

/* ── Slide variants ── */
const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ?  32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -32 :  32, opacity: 0 }),
};
const spring = { type: 'spring', damping: 30, stiffness: 340 };

/* ═══════════════════════════════════════════════════════════════════ */
function ChatView({
  chatConversations,
  matches,
  onScheduleMeeting,
  recommendedCompanies = [],
  userPlan = 'starter',
  onOpenAllianceRoom,
  onOpenAssistant,
}) {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [threads,              setThreads]              = useState(chatConversations);
  const [proposalDraft,        setProposalDraft]        = useState('');

  /* ── Social state (Set-based for O(1) lookup) ── */
  const [favorites, setFavorites] = useState(() => new Set());
  const [archived,  setArchived]  = useState(() => new Set());
  const [pinned,    setPinned]    = useState(() => new Set());

  const directionRef = useRef(1);
  const lastIdRef    = useRef(null);

  /* ── Toggle helpers ── */
  const toggle = (setter) => (id) =>
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const handleFavorite = toggle(setFavorites);
  const handleArchived = toggle(setArchived);
  const handlePinned   = toggle(setPinned);

  /* ── Enrich threads with defaults ── */
  const enrichedThreads = useMemo(
    () =>
      threads.map(conv => {
        const d = CONV_DEFAULTS[conv.id] || {};
        return {
          ...conv,
          tags:            conv.tags            || d.tags            || ['Alianza estratégica'],
          score:           conv.score           ?? (d.score !== undefined ? d.score : 78),
          contact:         conv.contact         || d.contact         || conv.sector,
          businessState:   conv.businessState   || d.businessState   || 'pendiente',
          taskCount:       conv.taskCount       ?? d.taskCount       ?? 0,
          proposalCount:   conv.proposalCount   ?? d.proposalCount   ?? 0,
          lastMessageType: conv.lastMessageType || d.lastMessageType || null,
        };
      }),
    [threads]
  );

  const activeConversation = useMemo(
    () => enrichedThreads.find(c => c.id === activeConversationId) ?? null,
    [activeConversationId, enrichedThreads]
  );

  /* Reset draft when switching conversations */
  useEffect(() => {
    if (lastIdRef.current !== activeConversationId) {
      if (activeConversationId !== null) setProposalDraft('');
      lastIdRef.current = activeConversationId;
    }
  }, [activeConversationId]);

  /* ── Thread mutation helpers ── */
  const updateActive = updater =>
    setThreads(cur => cur.map(c => (c.id === activeConversation?.id ? updater(c) : c)));

  const handleSend = () => {
    const msg = proposalDraft.trim();
    if (!msg || !activeConversation) return;
    updateActive(conv => ({
      ...conv,
      lastInteraction: 'Ahora',
      lastMessage: msg,
      messages: [
        ...conv.messages,
        { id: `${conv.id}-${conv.messages.length + 1}`, sender: 'me', text: msg, time: 'Ahora' },
      ],
    }));
    setProposalDraft('');
  };

  const handleProposalPreset = () => setProposalDraft(PROPOSAL_TEMPLATE);

  const handleCreateOutbound = () => {
    if (userPlan !== 'scale') return;
    const candidate = recommendedCompanies.find(
      company => !threads.some(c => c.company === company.name)
    );
    if (!candidate) return;
    const outbound = {
      id: `outbound-${candidate.id}`,
      company: candidate.name,
      logo: candidate.logo,
      sector: candidate.sector,
      location: candidate.location,
      status: 'Outbound',
      lastInteraction: 'Ahora',
      activity: 'Prospeccion',
      lastMessage: PROPOSAL_TEMPLATE,
      unread: 0,
      messages: [{ id: `${candidate.id}-outbound-1`, sender: 'me', text: PROPOSAL_TEMPLATE, time: 'Ahora' }],
    };
    setThreads(cur => [outbound, ...cur]);
    directionRef.current = 1;
    setActiveConversationId(outbound.id);
  };

  /* Navigation */
  const handleSelect = (id) => { directionRef.current =  1; setActiveConversationId(id);   };
  const handleBack   = ()   => { directionRef.current = -1; setActiveConversationId(null); };

  const showChat = activeConversationId !== null && activeConversation !== null;

  return (
    <div
      className="relative overflow-hidden rounded-[24px] bg-white shadow-sm"
      style={{ height: 'calc(100vh - 160px)', minHeight: '560px' }}
    >
      <AnimatePresence mode="wait" custom={directionRef.current} initial={false}>

        {/* ── LIST PANEL ── */}
        {!showChat && (
          <motion.div
            key="list"
            custom={directionRef.current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="absolute inset-0 overflow-hidden"
          >
            <ChatList
              allowDirectMessage={userPlan === 'scale'}
              activeId={activeConversationId}
              conversations={enrichedThreads}
              onCreateOutbound={handleCreateOutbound}
              onOpenAssistant={onOpenAssistant}
              onOpenAllianceRoom={onOpenAllianceRoom}
              onSelect={handleSelect}
              favorites={favorites}
              archived={archived}
              pinned={pinned}
              onFavorite={handleFavorite}
              onArchive={handleArchived}
              onPin={handlePinned}
            />
          </motion.div>
        )}

        {/* ── CONVERSATION PANEL ── */}
        {showChat && (
          <motion.div
            key={activeConversationId}
            custom={directionRef.current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="absolute inset-0 overflow-hidden"
          >
            <ChatWindow
              conversation={activeConversation}
              onBack={handleBack}
              onChangeDraft={setProposalDraft}
              onConvertToOpportunity={() =>
                updateActive(conv => ({ ...conv, status: 'Alianza activa' }))
              }
              onProposalPreset={handleProposalPreset}
              onQuickAction={setProposalDraft}
              onScheduleMeeting={onScheduleMeeting}
              onSend={handleSend}
              proposalDraft={proposalDraft}
              onCreateTask={() => {}}
              onOpenAllianceRoom={onOpenAllianceRoom}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default ChatView;
