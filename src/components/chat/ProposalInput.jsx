import { Send, Sparkles, Zap } from 'lucide-react';

const quickActionMap = {
  'Propuesta comercial':
    'Tengo una propuesta comercial para colaborar entre nuestras empresas y generar una activacion con impacto medible.',
  'Alianza estratégica':
    'Tengo una propuesta para construir una alianza estrategica entre nuestras empresas y explorar valor compartido.',
  'Intercambio de clientes':
    'Veo una oportunidad para intercambiar audiencias y clientes de forma alineada a nuestros objetivos comerciales.'
};

function ProposalInput({
  onChange,
  onProposalPreset,
  onQuickAction,
  onSend,
  quickActions,
  value
}) {
  return (
    <div className="border-t border-slate-200 bg-white/92 p-4 backdrop-blur">
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#1871D8]/20 hover:bg-blue-50 hover:text-[#1871D8]"
            key={action}
            onClick={() => onQuickAction(quickActionMap[action] || action)}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <textarea
            className="min-h-[112px] w-full resize-none rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-[#1A1A1A] shadow-sm outline-none transition focus:border-[#1871D8]/30 focus:bg-white focus:ring-4 focus:ring-[#1871D8]/8"
            onChange={(event) => onChange(event.target.value)}
            placeholder="Tengo una propuesta para colaborar entre nuestras empresas que puede generar valor en conjunto..."
            value={value}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#1871D8]/14 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#1871D8] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={onProposalPreset}
            type="button"
          >
            <Sparkles className="h-4 w-4" />
            Enviar propuesta
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#0B412F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={onSend}
            type="button"
          >
            <Send className="h-4 w-4" />
            Enviar
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Zap className="h-3.5 w-3.5 text-[#1871D8]" />
        El canal esta orientado a propuestas, alianzas y acuerdos concretos entre empresas.
      </div>
    </div>
  );
}

export default ProposalInput;
