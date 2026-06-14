import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, FileText, Image, Paperclip, Presentation, X } from 'lucide-react';

const ATTACH_OPTIONS = [
  { key: 'pdf',      label: 'PDF',            icon: FileText,     color: '#EF4444' },
  { key: 'image',    label: 'Imagen',          icon: Image,        color: '#3B82F6' },
  { key: 'doc',      label: 'Presentación',    icon: Presentation, color: '#F59E0B' },
  { key: 'proposal', label: 'Propuesta',       icon: FileText,     color: '#8B5CF6' },
];

const QUICK_ACTIONS = [
  { key: 'propuesta',  label: 'Enviar propuesta',    text: 'Quería compartirte una propuesta comercial para que evaluemos una colaboración entre nuestras empresas.' },
  { key: 'tarea',      label: 'Crear tarea',          text: '' },
  { key: 'reunion',    label: 'Agendar reunión',      text: 'Me gustaría agendar una reunión para avanzar en los detalles de la alianza.' },
  { key: 'documento',  label: 'Compartir documento',  text: '' },
  { key: 'alianza',    label: 'Crear alianza',        text: 'Veo una oportunidad concreta de alianza entre nuestras empresas. ¿Podemos avanzar?' },
];

function ProposalInput({ onChange, onQuickAction, onSend, value }) {
  const [inputValue,   setInputValue]   = useState(value || '');
  const [showAttach,   setShowAttach]   = useState(false);

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

  const handleQuick = (action) => {
    if (action.text) {
      setInputValue(action.text);
      onChange?.(action.text);
      onQuickAction?.(action.text);
    }
  };

  const hasText = inputValue.trim().length > 0;

  return (
    <div
      className="shrink-0 px-4 pt-2 pb-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,15,30,0.97)' }}
    >
      {/* Contextual action chips */}
      <div className="flex gap-2 overflow-x-auto pb-2.5 [scrollbar-width:none]">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.key}
            onClick={() => handleQuick(action)}
            type="button"
            className="shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white/50 transition hover:text-white/80"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="relative flex items-center gap-2">
        {/* Attach */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttach(p => !p)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition"
            style={{
              background: showAttach ? 'rgba(74,159,255,0.18)' : 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {showAttach
              ? <X className="h-4 w-4 text-[#4A9FFF]" />
              : <Paperclip className="h-4 w-4 text-white/40" />}
          </button>

          <AnimatePresence>
            {showAttach && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.92 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 left-0 z-20 overflow-hidden rounded-[16px] py-1.5"
                style={{
                  background: 'rgba(18,26,54,0.98)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                  width: '168px',
                }}
              >
                {ATTACH_OPTIONS.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShowAttach(false)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/5"
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
                      style={{ background: `${color}20` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <span className="text-[13px] font-medium text-white/75">{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text field */}
        <input
          className="h-11 flex-1 rounded-[22px] px-5 text-[14px] text-white/90 outline-none placeholder:text-white/25"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          value={inputValue}
        />

        {/* Send */}
        <motion.button
          type="button"
          onClick={handleSend}
          whileTap={hasText ? { scale: 0.88 } : {}}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition"
          style={hasText ? {
            background: 'linear-gradient(135deg, #1871D8, #1459B0)',
            boxShadow: '0 4px 14px rgba(24,113,216,0.40)',
          } : {
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <ArrowUp className={`h-4 w-4 ${hasText ? 'text-white' : 'text-white/25'}`} />
        </motion.button>
      </div>
    </div>
  );
}

export default ProposalInput;
