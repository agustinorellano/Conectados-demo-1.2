import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const PROPOSAL_TEMPLATE =
  'Tengo una propuesta para colaborar entre nuestras empresas que puede generar valor en conjunto. Me gustaria comentarte la idea y explorar como podemos trabajar juntos.';

const CONV_DEFAULTS = {
  'luna-beauty':        { tags: ['Cross-selling', 'Belleza'],       score: 91,   contact: 'Valentina Cruz',     businessState: 'activo'    },
  'cafe-patio':         { tags: ['Evento', 'Tráfico local'],         score: 74,   contact: 'Marcos Pino',         businessState: 'pendiente' },
  'internal-marketing': { tags: ['Coordinación'],                    score: null, contact: 'Equipo Mkt',          businessState: 'activo'    },
  'bloom-floreria':     { tags: ['Bundle', 'Primavera'],             score: 88,   contact: 'Florencia Del Valle', businessState: 'activo'    },
  'sushi-nakama':       { tags: ['Distribución', 'Gastronomía'],     score: 67,   contact: 'Naomi Tanaka',        businessState: 'pendiente' },
};

/* ── Slide variants — dir 1 = forward (list→chat), dir -1 = back ── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
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
  /* State — null means "show list", an id means "show that conversation" */
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [threads, setThreads] = useState(chatConversations);
  const [proposalDraft, setProposalDraft] = useState('');
  const directionRef = useRef(1);
  const lastIdRef    = useRef(null);

  /* Enrich threads with defaults */
  const enrichedThreads = useMemo(
    () =>
      threads.map(conv => ({
        ...conv,
        tags:          conv.tags          || CONV_DEFAULTS[conv.id]?.tags          || ['Alianza estratégica'],
        score:         conv.score         ?? (CONV_DEFAULTS[conv.id]?.score !== undefined ? CONV_DEFAULTS[conv.id].score : 78),
        contact:       conv.contact       || CONV_DEFAULTS[conv.id]?.contact       || conv.sector,
        businessState: conv.businessState || CONV_DEFAULTS[conv.id]?.businessState || 'pendiente',
      })),
    [threads]
  );

  const activeConversation = useMemo(
    () => enrichedThreads.find(c => c.id === activeConversationId) ?? null,
    [activeConversationId, enrichedThreads]
  );

  /* Reset draft when conversation changes */
  useEffect(() => {
    if (lastIdRef.current !== activeConversationId) {
      if (activeConversationId !== null) setProposalDraft('');
      lastIdRef.current = activeConversationId;
    }
  }, [activeConversationId]);

  /* ── Helpers ── */
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
  const handleSelect = (id) => {
    directionRef.current = 1;
    setActiveConversationId(id);
  };

  const handleBack = () => {
    directionRef.current = -1;
    setActiveConversationId(null);
  };

  const showChat = activeConversationId !== null && activeConversation !== null;

  /* ── Render ── */
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
              onSelect={handleSelect}
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
