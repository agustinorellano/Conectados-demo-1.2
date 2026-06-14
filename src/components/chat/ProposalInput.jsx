import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, FileText, Image, Mic, Paperclip, Presentation, Smile, X } from 'lucide-react';

const ATTACH_OPTIONS = [
  { key: 'pdf',      label: 'PDF',          icon: FileText,     color: '#EF4444' },
  { key: 'image',    label: 'Imagen',        icon: Image,        color: '#3B82F6' },
  { key: 'doc',      label: 'Presentación',  icon: Presentation, color: '#F59E0B' },
  { key: 'proposal', label: 'Propuesta',     icon: FileText,     color: '#8B5CF6' },
];

function ProposalInput({ onChange, onQuickAction, onSend, value }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [showAttach, setShowAttach] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.();
    setInputValue('');
    onChange?.('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  const hasText = inputValue.trim().length > 0;

  return (
    <div className="shrink-0 px-4 pt-3 pb-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#0A0F1E' }}>

      {/* Input row */}
      <div className="relative flex items-center gap-2">

        {/* Attach */}
        <div className="relative">
          <button type="button" onClick={() => setShowAttach(p => !p)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
            {showAttach
              ? <X className="h-4 w-4 text-white/50" />
              : <Paperclip className="h-4 w-4 text-white/40" />}
          </button>

          <AnimatePresence>
            {showAttach && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.92 }}
                transition={{ duration: 0.14 }}
                className="absolute bottom-14 left-0 z-20 overflow-hidden rounded-[16px] py-1.5"
                style={{
                  background: 'rgba(18,26,54,0.98)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                  width: '168px',
                }}>
                {ATTACH_OPTIONS.map(({ key, label, icon: Icon, color }) => (
                  <button key={key} type="button" onClick={() => setShowAttach(false)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
                      style={{ background: `${color}20` }}>
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
          className="h-11 flex-1 rounded-[22px] px-4 text-[14px] text-white/90 outline-none placeholder:text-white/25"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          value={inputValue}
        />

        {/* Emoji */}
        <button type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <Smile className="h-4 w-4 text-white/40" />
        </button>

        {/* Mic or Send */}
        {hasText ? (
          <motion.button type="button" onClick={handleSend}
            initial={{ scale: 0.7 }} animate={{ scale: 1 }}
            whileTap={{ scale: 0.88 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', boxShadow: '0 4px 14px rgba(124,58,237,0.45)' }}>
            <ArrowUp className="h-4 w-4 text-white" />
          </motion.button>
        ) : (
          <button type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <Mic className="h-4 w-4 text-white/40" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProposalInput;
