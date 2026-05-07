import { useEffect, useMemo, useRef, useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const PROPOSAL_TEMPLATE =
  'Tengo una propuesta para colaborar entre nuestras empresas que puede generar valor en conjunto. Me gustaria comentarte la idea y explorar como podemos trabajar juntos.';

const CONV_DEFAULTS = {
  'luna-beauty':        { tags: ['Cross-selling', 'Belleza'], score: 91, contact: 'Valentina Cruz', businessState: 'activo' },
  'cafe-patio':         { tags: ['Evento', 'Tráfico local'], score: 74, contact: 'Marcos Pino', businessState: 'pendiente' },
  'internal-marketing': { tags: ['Coordinación'], score: null, contact: 'Equipo Mkt', businessState: 'activo' },
  'bloom-floreria':     { tags: ['Bundle', 'Primavera'], score: 88, contact: 'Florencia Del Valle', businessState: 'activo' },
  'sushi-nakama':       { tags: ['Distribución', 'Gastronomía'], score: 67, contact: 'Naomi Tanaka', businessState: 'pendiente' },
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
  const lastConversationRef = useRef(activeConversationId);

  // Enrich conversations with new fields for the redesigned UI
  const enrichedThreads = useMemo(
    () =>
      threads.map((conv) => ({
        ...conv,
        tags: conv.tags || CONV_DEFAULTS[conv.id]?.tags || ['Alianza estratégica'],
        score: conv.score ?? (CONV_DEFAULTS[conv.id]?.score !== undefined ? CONV_DEFAULTS[conv.id].score : 78),
        contact: conv.contact || CONV_DEFAULTS[conv.id]?.contact || conv.sector,
        businessState: conv.businessState || CONV_DEFAULTS[conv.id]?.businessState || 'pendiente',
      })),
    [threads]
  );

  const activeConversation = useMemo(
    () =>
      enrichedThreads.find((c) => c.id === activeConversationId) || enrichedThreads[0],
    [activeConversationId, enrichedThreads]
  );

  const recentMatches = matches.slice(0, 2);

  useEffect(() => {
    if (lastConversationRef.current !== activeConversationId) {
      setProposalDraft('');
      lastConversationRef.current = activeConversationId;
    }
  }, [activeConversationId]);

  const updateActiveConversation = (updater) => {
    setThreads((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id ? updater(conversation) : conversation
      )
    );
  };

  const handleSend = () => {
    const trimmedMessage = proposalDraft.trim();
    if (!trimmedMessage || !activeConversation) return;

    updateActiveConversation((conversation) => ({
      ...conversation,
      lastInteraction: 'Ahora',
      lastMessage: trimmedMessage,
      messages: [
        ...conversation.messages,
        {
          id: `${conversation.id}-${conversation.messages.length + 1}`,
          sender: 'me',
          text: trimmedMessage,
          time: 'Ahora',
        },
      ],
    }));
    setProposalDraft('');
  };

  const handleProposalPreset = () => {
    setProposalDraft(PROPOSAL_TEMPLATE);
  };

  const handleCreateOutbound = () => {
    if (userPlan !== 'scale') return;

    const candidate = recommendedCompanies.find(
      (company) => !threads.some((c) => c.company === company.name)
    );
    if (!candidate) return;

    const outboundConversation = {
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
      messages: [
        {
          id: `${candidate.id}-outbound-1`,
          sender: 'me',
          text: PROPOSAL_TEMPLATE,
          time: 'Ahora',
        },
      ],
    };

    setThreads((current) => [outboundConversation, ...current]);
    setActiveConversationId(outboundConversation.id);
  };

  const handleCreateTask = (task) => {
    setWorkplaceTasks((prev) => [
      ...prev,
      { ...task, id: Date.now(), conversationId: activeConversationId },
    ]);
  };

  return (
    <div
      className="flex overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
      style={{ height: 'calc(100vh - 168px)', minHeight: '560px' }}
    >
      <ChatList
        allowDirectMessage={userPlan === 'scale'}
        activeId={activeConversation?.id}
        conversations={enrichedThreads}
        onCreateOutbound={handleCreateOutbound}
        onSelect={setActiveConversationId}
        recentMatches={recentMatches}
      />

      {activeConversation ? (
        <ChatWindow
          conversation={activeConversation}
          onChangeDraft={setProposalDraft}
          onConvertToOpportunity={() => {
            updateActiveConversation((conv) => ({ ...conv, status: 'Alianza activa' }));
          }}
          onProposalPreset={handleProposalPreset}
          onQuickAction={setProposalDraft}
          onScheduleMeeting={onScheduleMeeting}
          onSend={handleSend}
          proposalDraft={proposalDraft}
          onCreateTask={handleCreateTask}
          onOpenAllianceRoom={onOpenAllianceRoom}
        />
      ) : null}
    </div>
  );
}

export default ChatView;
