import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

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

const industryAccent = {
  Indumentaria: 'rgba(155,142,196,0.6)',
  Belleza: 'rgba(232,197,208,0.6)',
  Cafeteria: 'rgba(160,120,80,0.6)',
  Gastronomia: 'rgba(74,122,60,0.6)',
  Gimnasio: 'rgba(44,62,107,0.6)',
  Tecnologia: 'rgba(45,27,105,0.6)',
  Floreria: 'rgba(200,216,176,0.6)',
  Moda: 'rgba(212,192,168,0.6)',
  Bienestar: 'rgba(168,200,216,0.6)',
  'Marketing Digital': 'rgba(74,32,128,0.6)'
};

function CompanyCard({ company }) {
  const bg = industryBg[company.sector] || industryBg.Tecnologia;
  const accent = industryAccent[company.sector] || 'rgba(24,113,216,0.6)';
  const hasImage = Boolean(company.gallery?.[0]);

  return (
    <motion.article
      className="relative w-full overflow-hidden rounded-[30px] shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
      initial={{ opacity: 0, scale: 0.98, y: 16 }}
      style={{ minHeight: '560px' }}
      transition={{ duration: 0.24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
    >
      {/* Background */}
      {hasImage ? (
        <img
          alt={company.name}
          className="absolute inset-0 h-full w-full object-cover"
          src={company.gallery[0]}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: bg }}>
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: accent }} />
          <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full opacity-20 blur-3xl" style={{ background: accent }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-['Space_Grotesk'] text-[9rem] font-black leading-none opacity-[0.06] text-white">
              {company.logo}
            </span>
          </div>
        </div>
      )}

      {/* Dark overlay for image readability */}
      {hasImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      )}

      {/* Sector badge — top left */}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/20">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
          {company.sector}
        </span>
      </div>

      {/* Glassmorphism bottom panel */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 rounded-b-[30px] px-5 pb-6 pt-5"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.6)'
        }}
      >
        <p className="mb-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <MapPin className="h-3 w-3" />
          {company.location}
        </p>
        <h3 className="font-['Space_Grotesk'] text-xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
          {company.name}
        </h3>
        {company.segments?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {company.segments.slice(0, 3).map((seg) => (
              <span
                className="rounded-full bg-black/6 px-2.5 py-1 text-[11px] font-medium capitalize text-[#333]"
                key={seg}
              >
                {seg}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default CompanyCard;
