import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

function CompanyCard({ company, score }) {
  return (
    <motion.article
      className="w-full rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(8,33,24,0.08)]"
      initial={{ opacity: 0, scale: 0.98, y: 16 }}
      transition={{ duration: 0.24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1871D8] to-[#0B412F] font-['Space_Grotesk'] text-lg font-bold text-white shadow-sm">
            {company.logoImage ? (
              <img alt={company.name} className="h-full w-full object-cover" src={company.logoImage} />
            ) : (
              company.logo
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#1871D8]">
              {company.sector}
            </p>
            <h3 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              {company.name}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {company.location}
            </p>
          </div>
        </div>

        <div className="rounded-[20px] bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-200">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
            Match
          </p>
          <div className="mt-1 font-['Inter'] text-3xl font-extrabold tracking-[-0.05em] text-[#1A1A1A]">
            {score}%
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] bg-slate-100">
        <img
          alt={`Perfil visual de ${company.name}`}
          className="h-[260px] w-full object-cover"
          src={company.gallery?.[0] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520" fill="none"><rect width="800" height="520" rx="36" fill="%23EEF2F7"/><circle cx="633" cy="122" r="96" fill="%23D7E8FF"/><circle cx="148" cy="402" r="112" fill="%23D9F5E8"/><text x="60" y="94" fill="%231871D8" font-family="Inter,Arial" font-size="18" letter-spacing="6">DATA PLUS</text><text x="60" y="170" fill="%231A1A1A" font-family="Space Grotesk,Arial" font-size="44" font-weight="700">Comercio compatible</text><rect x="60" y="364" width="210" height="18" rx="9" fill="%230B412F" fill-opacity="0.12"/><rect x="60" y="398" width="168" height="14" rx="7" fill="%231871D8" fill-opacity="0.14"/></svg>'}
        />
      </div>

      <div className="mt-6 space-y-4">
        <p className="text-base font-semibold leading-7 text-[#1A1A1A]">{company.headline}</p>
        <p className="text-sm leading-6 text-[#4A4A4A]">{company.fitSummary || company.culture}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {company.segments.slice(0, 4).map((segment) => (
          <span
            className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-[#1871D8]"
            key={segment}
          >
            {segment}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default CompanyCard;
