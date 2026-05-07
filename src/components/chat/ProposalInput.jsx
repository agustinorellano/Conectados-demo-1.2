import { useState } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

const quickActionMap = {
  'Propuesta comercial':
    'Tengo una propuesta comercial para colaborar entre nuestras empresas y generar una activacion con impacto medible.',
  'Alianza estratégica':
    'Tengo una propuesta para construir una alianza estrategica entre nuestras empresas y explorar valor compartido.',
  'Intercambio de clientes':
    'Veo una oportunidad para intercambiar audiencias y clientes de forma alineada a nuestros objetivos comerciales.'
};

function ProposalInput({ onChange, onQuickAction, onSend, quickActions, value }) {
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
    <div className="shrink-0 border-t border-slate-100 bg-white px-4 pt-2 pb-3">
      {/* Quick chips */}
      {quickActions?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {quickActions.map((action) => (
            <button
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 transition hover:border-[#1871D8]/25 hover:bg-blue-50 hover:text-[#1871D8]"
              key={action}
              onClick={() => handleQuickAction(action)}
              type="button"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input row — pill shape */}
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600"
          type="button"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          className="h-14 flex-1 rounded-[28px] border border-slate-200 bg-slate-50 px-5 text-[14px] text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:border-[#1871D8]/30 focus:bg-white focus:ring-2 focus:ring-[#1871D8]/10"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          value={inputValue}
        />

        <button
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:-translate-y-0.5 ${
            inputValue.trim()
              ? 'bg-[#141E30] text-white shadow-sm hover:bg-[#1A2C45] hover:shadow-md'
              : 'bg-slate-100 text-slate-400 cursor-default'
          }`}
          onClick={handleSend}
          type="button"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ProposalInput;
