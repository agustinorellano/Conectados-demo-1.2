import { Link2, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Misma tipografía de sistema Apple que el resto de Explorar (SF Pro en Apple, Inter de respaldo)
const APPLE_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', system-ui, sans-serif";

const sectorGrad = {
  Indumentaria:       'linear-gradient(135deg, #9B8EC4, #7B6BA8)',
  Belleza:            'linear-gradient(135deg, #E8C5D0, #D4909A)',
  Cafeteria:          'linear-gradient(135deg, #A07850, #6B4228)',
  Gastronomia:        'linear-gradient(135deg, #4A7A3C, #2D5522)',
  Gimnasio:           'linear-gradient(135deg, #2C3E6B, #1A2644)',
  Tecnologia:         'linear-gradient(135deg, #2D1B69, #1A0F42)',
  Floreria:           'linear-gradient(135deg, #8FB87A, #5A8A44)',
  Moda:               'linear-gradient(135deg, #B09070, #806040)',
  Bienestar:          'linear-gradient(135deg, #78A8C0, #4A7890)',
  'Marketing Digital':'linear-gradient(135deg, #4A2080, #2C1050)',
};

function CompanyAvatar({ name, sector, size = 80, from = 'left' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  const bg = sectorGrad[sector] || 'linear-gradient(135deg, #455BE8, #2F43C8)';
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -28 : 28, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 240, delay: 0.1 }}
      className="flex items-center justify-center text-white"
      style={{
        width: size, height: size, borderRadius: size * 0.3, background: bg,
        fontFamily: APPLE_FONT, fontWeight: 700, fontSize: size * 0.32, letterSpacing: '-0.02em',
        boxShadow: '0 14px 30px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.28)',
      }}
    >
      {initials}
    </motion.div>
  );
}

function MatchOverlay({ company, myCompany, onClose, onGoToChats }) {
  const myName = myCompany?.name ?? 'Tu empresa';
  const mySector = myCompany?.sector ?? 'Tecnologia';

  return (
    <AnimatePresence>
      {company ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{ background: 'rgba(4,8,20,0.74)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          onClick={onClose}
          role="dialog"
          aria-label="Conexión detectada"
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] px-7 pb-7 pt-8"
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              background: 'linear-gradient(180deg, #151C30 0%, #0C1122 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
              fontFamily: APPLE_FONT,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Resplandor suave detrás de los logos */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: 'rgba(69,91,232,0.38)' }} />

            {/* Cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <X size={16} className="text-white/70" />
            </button>

            {/* Etiqueta */}
            <p className="relative flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#8FA2FF' }}>
              <Sparkles size={12} /> Conexión detectada
            </p>

            {/* Logos + enlace */}
            <div className="relative mt-7 flex items-center justify-center gap-5">
              <div className="flex w-[92px] flex-col items-center gap-3">
                <CompanyAvatar name={myName} sector={mySector} from="left" />
                <p className="max-w-full truncate text-[13px] font-medium text-white/70">{myName}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 14 }}
                className="relative -mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)', boxShadow: '0 8px 22px rgba(69,91,232,0.55), inset 0 1px 0 rgba(255,255,255,0.3)' }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid rgba(143,162,255,0.7)' }}
                  animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
                <Link2 size={19} strokeWidth={2.2} />
              </motion.div>

              <div className="flex w-[92px] flex-col items-center gap-3">
                <CompanyAvatar name={company.name} sector={company.sector} from="right" />
                <p className="max-w-full truncate text-[13px] font-medium text-white/70">{company.name}</p>
              </div>
            </div>

            {/* Mensaje */}
            <div className="relative mt-8 text-center">
              <h3 className="text-[28px] font-bold leading-[1.1] text-white" style={{ letterSpacing: '-0.03em', fontFamily: APPLE_FONT }}>
                ¡Hay potencial de alianza!
              </h3>
              <p className="mx-auto mt-3 max-w-[340px] text-[15px] leading-[1.55] text-white/60">
                {company.name} muestra alta reciprocidad y un fit claro para construir una propuesta conjunta con valor real.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {['Alta reciprocidad', 'Fit claro'].map(tag => (
                  <span key={tag} className="rounded-full px-3 py-1 text-[12px] font-medium"
                    style={{ color: '#9FB0FF', background: 'rgba(69,91,232,0.16)', border: '1px solid rgba(69,91,232,0.30)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="relative mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-12 flex-1 rounded-2xl transition hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.78)', fontSize: 14, fontWeight: 600 }}
              >
                Seguir explorando
              </button>
              <button
                type="button"
                onClick={onGoToChats}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl transition hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)', boxShadow: '0 10px 24px rgba(69,91,232,0.40)', color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}
              >
                <Send size={15} />
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
