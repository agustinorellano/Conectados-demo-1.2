import { Building2, MapPin, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ProposalInput from './ProposalInput';

function ChatWindow({
  conversation,
  onChangeDraft,
  onProposalPreset,
  onQuickAction,
  onSend,
  proposalDraft
}) {
  return (
    <section className="flex min-h-[720px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white/86 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur">
      <header className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-sm font-bold text-white shadow-sm">
              {conversation.logo}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
                Canal activo
              </p>
              <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
                {conversation.company}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#4A4A4A]">
                <span className="rounded-full bg-slate-100 px-3 py-1.5">
                  {conversation.sector}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {conversation.location}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-right">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">
              Estado
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-800">
              {conversation.status}
            </p>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#1871D8]" />
            Propuesta sugerida lista para editar
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Building2 className="h-4 w-4 text-[#0B412F]" />
            Herramienta pensada para acuerdos B2B
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,249,250,0.35),rgba(255,255,255,0.65))] px-5 py-5 scroll-smooth">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <ProposalInput
        onChange={onChangeDraft}
        onProposalPreset={onProposalPreset}
        onQuickAction={onQuickAction}
        onSend={onSend}
        proposalDraft={proposalDraft}
        quickActions={['Propuesta comercial', 'Alianza estratégica', 'Intercambio de clientes']}
        value={proposalDraft}
      />
    </section>
  );
}

export default ChatWindow;
