import { Handshake, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function MatchOverlay({ company, onClose, onGoToChats }) {
  return (
    <AnimatePresence>
      {company ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-[0_30px_90px_rgba(20,30,48,0.18)]"
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
              Match detectado
            </p>
            <h3 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#1A1A1A]">
              ¡Hay potencial comercial!
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">
              {company.name} muestra alta reciprocidad y un fit claro para construir una
              propuesta conjunta con valor real.
            </p>

            <div className="mt-6 flex items-center justify-center">
              <div className="rounded-full bg-gradient-to-r from-[#141E30] to-[#35577D] p-5 text-white shadow-lg">
                <Handshake className="h-8 w-8" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-[18px] border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
                onClick={onClose}
                type="button"
              >
                Seguir explorando
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#1871D8] px-4 py-3 text-sm font-semibold text-white"
                onClick={onGoToChats}
                type="button"
              >
                <Send className="h-4 w-4" />
                Enviar propuesta
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MatchOverlay;
