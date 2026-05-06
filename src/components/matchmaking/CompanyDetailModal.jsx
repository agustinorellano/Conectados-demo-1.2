import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MapPin, X } from 'lucide-react';

const industryBg = {
  Indumentaria: 'radial-gradient(ellipse at 60% 0%, #9B8EC4 0%, #7B6BA8 40%, #C4A882 100%)',
  Belleza: 'radial-gradient(ellipse at 50% 0%, #E8C5D0 0%, #D4909A 45%, #B06070 100%)',
  Cafeteria: 'radial-gradient(ellipse at 30% 10%, #A07850 0%, #6B4228 50%, #3D2510 100%)',
  Gastronomia: 'radial-gradient(ellipse at 50% 0%, #4A7A3C 0%, #2D5522 50%, #1A3310 100%)',
  Gimnasio: 'radial-gradient(ellipse at 70% 0%, #2C3E6B 0%, #1A2644 50%, #0D1425 100%)',
  Tecnologia: 'radial-gradient(ellipse at 60% 10%, #2D1B69 0%, #1A0F42 50%, #0A0820 100%)',
  Floreria: 'radial-gradient(ellipse at 40% 0%, #C8D8B0 0%, #8FB87A 40%, #5A8A44 100%)',
  Moda: 'radial-gradient(ellipse at 50% 10%, #D4C0A8 0%, #B09070 45%, #806040 100%)',
  Bienestar: 'radial-gradient(ellipse at 60% 0%, #A8C8D8 0%, #78A8C0 40%, #4A7890 100%)',
  'Marketing Digital': 'radial-gradient(ellipse at 60% 0%, #4A2080 0%, #2C1050 50%, #100820 100%)'
};

function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${tones[tone]}`}>
      {children}
    </span>
  );
}

function CompanyDetailModal({ company, onClose, onLike }) {
  if (!company) return null;

  const bg = industryBg[company.sector] || industryBg.Tecnologia;
  const hasImage = Boolean(company.gallery?.[0]);

  const offersArr = company.offersArr || company.offer?.split(', ') || [];
  const needsArr = company.needsArr || company.seeking?.split(', ') || [];
  const segments = company.segments || [];

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
          exit={{ opacity: 0, y: 60 }}
          initial={{ opacity: 0, y: 60 }}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          {/* HEADER */}
          <div className="relative h-52 overflow-hidden" style={{ background: bg }}>
            {hasImage && (
              <img
                alt={company.name}
                className="absolute inset-0 h-full w-full object-cover"
                src={company.gallery[0]}
              />
            )}
            {hasImage && <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />}

            <button
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                {company.sector}
              </p>
              <h2 className="mt-1 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white">
                {company.name}
              </h2>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/75">
                <MapPin className="h-3.5 w-3.5" />
                {company.location}
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-h-[60vh] space-y-5 overflow-y-auto p-5">
            {/* Perfil de Empresa */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Perfil de Empresa
              </p>
              <p className="mt-2 text-sm leading-6 text-[#4A4A4A]">
                {company.description || company.culture || company.headline}
              </p>
              {company.size && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip>{company.size}</Chip>
                  {company.businessType && <Chip>{company.businessType}</Chip>}
                </div>
              )}
            </section>

            {/* Perfil de Alianza */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Perfil de Alianza
              </p>

              {offersArr.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-medium text-slate-500">Que ofrece</p>
                  <div className="flex flex-wrap gap-1.5">
                    {offersArr.map((tag) => (
                      <Chip key={tag} tone="emerald">{tag}</Chip>
                    ))}
                  </div>
                </div>
              )}

              {needsArr.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-medium text-slate-500">Que busca</p>
                  <div className="flex flex-wrap gap-1.5">
                    {needsArr.map((tag) => (
                      <Chip key={tag} tone="blue">{tag}</Chip>
                    ))}
                  </div>
                </div>
              )}

              {segments.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-medium text-slate-500">Segmentos clave</p>
                  <div className="flex flex-wrap gap-1.5">
                    {segments.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* CTA */}
          <div className="flex gap-2.5 border-t border-slate-100 p-4">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-[18px] bg-[#22c55e] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#16a34a] hover:shadow-md"
              onClick={() => { onLike(); onClose(); }}
              type="button"
            >
              <Heart className="h-4 w-4" />
              Dar LIKE
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-[18px] bg-slate-100 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
              onClick={onClose}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CompanyDetailModal;
