import { useEffect, useMemo, useRef, useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const PROPOSAL_TEMPLATE =
  'Tengo una propuesta para colaborar entre nuestras empresas que puede generar valor en conjunto. Me gustaria comentarte la idea y explorar como podemos trabajar juntos.';

function ChatView({ chatConversations, matches, onScheduleMeeting, recommendedCompanies = [], userPlan = 'starter' }) {
  const [activeConversationId, setActiveConversationId] = useState(
    chatConversations[0]?.id || null
  );
  const [threads, setThreads] = useState(chatConversations);
  const [proposalDraft, setProposalDraft] = useState('');
  const lastConversationRef = useRef(activeConversationId);

  const activeConversation = useMemo(
    () => threads.find((conversation) => conversation.id === activeConversationId) || threads[0],
    [activeConversationId, threads]
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

    if (!trimmedMessage || !activeConversation) {
      return;
    }

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
          time: 'Ahora'
        }
      ]
    }));
    setProposalDraft('');
  };

  const handleProposalPreset = () => {
    setProposalDraft(PROPOSAL_TEMPLATE);
  };

  const handleCreateOutbound = () => {
    if (userPlan !== 'scale') {
      return;
    }

    const candidate = recommendedCompanies.find(
      (company) => !threads.some((conversation) => conversation.company === company.name)
    );

    if (!candidate) {
      return;
    }

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
          time: 'Ahora'
        }
      ]
    };

    setThreads((current) => [outboundConversation, ...current]);
    setActiveConversationId(outboundConversation.id);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1871D8] via-[#145db1] to-[#0B412F] p-5 text-white shadow-[0_28px_60px_rgba(11,65,47,0.18)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%)]" />
        <div className="absolute -right-10 top-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/75">
            Comunicacion comercial
          </p>
          <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight sm:text-[2.1rem]">
            Chats orientados a propuestas y alianzas
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82 sm:text-base">
            Cada conversacion esta pensada para abrir oportunidades reales entre
            empresas, centralizar el seguimiento y mantener el negocio dentro de Data
            Plus.
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.48fr]">
        <ChatList
          allowDirectMessage={userPlan === 'scale'}
          activeId={activeConversation?.id}
          conversations={threads}
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
          />
        ) : null}
      </section>
    </div>
  );
}

export default ChatView;
