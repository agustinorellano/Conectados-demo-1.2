import { useState } from 'react';
import { ArrowUp, Paperclip, Zap } from 'lucide-react';

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
  onQuickAction,
  onSend,
  quickActions,
  value
}) {
  const [inputValue, setInputValue] = useState(value || '');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.();
    setInputValue('');
    onChange?.('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleQuickAction = (action) => {
    const text = quickActionMap[action] || action;
    setInputValue(text);
    onChange?.(text);
    onQuickAction?.(text);
  };

  return (
    <div className="border-t border-slate-200 bg-white/92 px-4 pt-3 pb-4 backdrop-blur">
      {/* Quick chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {(quickActions || []).map((action) => (
          <button
            className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-[#1871D8]/20 hover:bg-blue-50 hover:text-[#1871D8]"
            key={action}
            onClick={() => handleQuickAction(action)}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600"
          type="button"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:border-[#1871D8]/30 focus:bg-white focus:ring-2 focus:ring-[#1871D8]/10"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          value={inputValue}
        />

        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141E30] text-white shadow-sm transition hover:bg-[#1A2C45] hover:-translate-y-0.5"
          onClick={handleSend}
          type="button"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* Zap footer note */}
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <Zap className="h-3.5 w-3.5 text-[#1871D8]" />
        El canal esta orientado a propuestas, alianzas y acuerdos concretos entre empresas.
      </div>
    </div>
  );
}

export default ProposalInput;
