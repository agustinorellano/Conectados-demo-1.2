import { Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

function CompanyAvatar({ name, sector, size = 64 }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  const bg = sectorGrad[sector] || 'linear-gradient(135deg, #1871D8, #0A3D7A)';
  return (
    <div
      className="flex items-center justify-center rounded-[20px] font-['Space_Grotesk'] font-black text-white shadow-lg"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.3, letterSpacing: '-0.02em' }}
    >
      {initials}
    </div>
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
          style={{ background: 'rgba(4,8,20,0.82)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] p-7"
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              background: 'linear-gradient(160deg, #0D1628 0%, #101929 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              <X size={14} className="text-white/50" />
            </button>

            {/* Label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: '#4A9FFF' }}>
              ✦ Conexión detectada
            </p>

            {/* Logos row */}
            <div className="mt-5 flex items-center justify-center gap-0">
              {/* My company */}
              <div className="flex flex-col items-center gap-2">
                <CompanyAvatar name={myName} sector={mySector} size={68} />
                <p className="text-[11px] font-semibold text-white/50 max-w-[80px] text-center leading-tight">{myName}</p>
              </div>

              {/* Connector */}
              <div className="flex flex-col items-center mx-3">
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, type: 'spring', damping: 16 }}
                >
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="rounded-full"
                      style={{ width: i === 1 ? 8 : 5, height: i === 1 ? 8 : 5, background: '#4A9FFF' }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </motion.div>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">alianza</p>
              </div>

              {/* Their company */}
              <div className="flex flex-col items-center gap-2">
                <CompanyAvatar name={company.name} sector={company.sector} size={68} />
                <p className="text-[11px] font-semibold text-white/50 max-w-[80px] text-center leading-tight">{company.name}</p>
              </div>
            </div>

            {/* Headline */}
            <h3 className="mt-6 font-['Space_Grotesk'] text-[22px] font-bold tracking-tight text-white leading-tight">
              ¡Hay potencial de alianza!
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-white/50">
              {company.name} muestra alta reciprocidad y un fit claro para construir una propuesta conjunta con valor real.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-[18px] py-3 text-[13px] font-semibold text-white/50 transition hover:text-white/70"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                Seguir explorando
              </button>
              <button
                type="button"
                onClick={onGoToChats}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[18px] py-3 text-[13px] font-semibold text-white transition"
                style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)', boxShadow: '0 8px 24px rgba(24,113,216,0.35)' }}
              >
                <Send size={14} />
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
