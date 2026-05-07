import { useEffect, useMemo, useRef, useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const PROPOSAL_TEMPLATE =
  'Tengo una propuesta para colaborar entre nuestras empresas que puede generar valor en conjunto. Me gustaria comentarte la idea y explorar como podemos trabajar juntos.';

const CONV_DEFAULTS = {
  'luna-beauty':        { tags: ['Cross-selling', 'Belleza'],        score: 91, contact: 'Valentina Cruz',     businessState: 'activo'   },
  'cafe-patio':         { tags: ['Evento', 'Tráfico local'],          score: 74, contact: 'Marcos Pino',         businessState: 'pendiente' },
  'internal-marketing': { tags: ['Coordinación'],                     score: null, contact: 'Equipo Mkt',        businessState: 'activo'   },
  'bloom-floreria':     { tags: ['Bundle', 'Primavera'],              score: 88, contact: 'Florencia Del Valle', businessState: 'activo'   },
  'sushi-nakama':       { tags: ['Distribución', 'Gastronomía'],      score: 67, contact: 'Naomi Tanaka',        businessState: 'pendiente' },
};

function ChatView({
  chatConversations,
  matches,
  onScheduleMeeting,
  recommendedCompanies = [],
  userPlan = 'starter',
  onOpenAllianceRoom,
}) {
  const [activeConversationId, setActiveConversationId] = useState(
    chatConversations[0]?.id || null
  );
  const [threads, setThreads] = useState(chatConversations);
  const [proposalDraft, setProposalDraft] = useState('');
  const [workplaceTasks, setWorkplaceTasks] = useState([]);
  // Mobile-only: controls whether chat view or list view is showing
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const lastConversationRef = useRef(activeConversationId);

  // Enrich conversations with defaults
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
    () => enrichedThreads.find(c => c.id === activeConversationId) || enrichedThreads[0],
    [activeConversationId, enrichedThreads]
  );

  useEffect(() => {
    if (lastConversationRef.current !== activeConversationId) {
      setProposalDraft('');
      lastConversationRef.current = activeConversationId;
    }
  }, [activeConversationId]);

  const updateActiveConversation = updater => {
    setThreads(current =>
      current.map(conv =>
        conv.id === activeConversation.id ? updater(conv) : conv
      )
    );
  };

  const handleSend = () => {
    const trimmedMessage = proposalDraft.trim();
    if (!trimmedMessage || !activeConversation) return;
    updateActiveConversation(conv => ({
      ...conv,
      lastInteraction: 'Ahora',
      lastMessage: trimmedMessage,
      messages: [
        ...conv.messages,
        {
          id: `${conv.id}-${conv.messages.length + 1}`,
          sender: 'me',
          text: trimmedMessage,
          time: 'Ahora',
        },
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
    setThreads(current => [outbound, ...current]);
    setActiveConversationId(outbound.id);
    setMobileShowChat(true);
  };

  const handleCreateTask = task => {
    setWorkplaceTasks(prev => [
      ...prev,
      { ...task, id: Date.now(), conversationId: activeConversationId },
    ]);
  };

  // When user taps a chat item on mobile → switch to chat view
  const handleSelectConversation = id => {
    setActiveConversationId(id);
    setMobileShowChat(true);
  };

  // Back button in ChatWindow header → return to list on mobile
  const handleBack = () => setMobileShowChat(false);

  return (
    <div
      className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
      style={{ height: 'calc(100vh - 168px)', minHeight: '560px' }}
    >
      <div className="flex h-full overflow-hidden">

        {/* ── ChatList panel ──
              Mobile: full width, hidden when chat is open
              Desktop: 300px sidebar, always visible               */}
        <div
          className={`${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          } h-full w-full flex-col border-r border-slate-100 md:w-[300px] md:shrink-0`}
        >
          <ChatList
            allowDirectMessage={userPlan === 'scale'}
            activeId={activeConversation?.id}
            conversations={enrichedThreads}
            onCreateOutbound={handleCreateOutbound}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* ── ChatWindow panel ──
              Mobile: full width, shown when chat is open
              Desktop: flex-1, always visible                       */}
        {activeConversation && (
          <div
            className={`${
              mobileShowChat ? 'flex' : 'hidden md:flex'
            } min-w-0 flex-1 overflow-hidden`}
          >
            <ChatWindow
              conversation={activeConversation}
              onBack={handleBack}
              onChangeDraft={setProposalDraft}
              onConvertToOpportunity={() => {
                updateActiveConversation(conv => ({ ...conv, status: 'Alianza activa' }));
              }}
              onProposalPreset={handleProposalPreset}
              onQuickAction={setProposalDraft}
              onScheduleMeeting={onScheduleMeeting}
              onSend={handleSend}
              proposalDraft={proposalDraft}
              onCreateTask={handleCreateTask}
              onOpenAllianceRoom={onOpenAllianceRoom}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatView;
