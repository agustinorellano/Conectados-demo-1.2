export const INDUSTRY_OPTIONS = [
  'Indumentaria',
  'Gastronomia',
  'Tecnologia',
  'Belleza',
  'Fitness',
  'Educacion',
  'Turismo',
  'Servicios profesionales',
  'Retail'
];

export const ALLIANCE_TAG_OPTIONS = [
  'Visibilidad',
  'Base de clientes',
  'Producto fisico',
  'Servicios',
  'Descuentos cruzados',
  'Eventos',
  'Colaboraciones'
];

export function normalizeValue(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function createInitialProfile(company) {
  const [city, country = 'Argentina'] = company.location.split(',').map((item) => item.trim());

  return {
    name: company.name,
    industries: [company.industry],
    description:
      'Marca orientada a crecimiento comercial con foco en alianzas que convierten trafico y visibilidad en ventas.',
    location: {
      city,
      country
    },
    branches: [
      {
        address: 'Av. Santa Fe 2431',
        city,
        country
      }
    ],
    logoImage: company.logoImage || null,
    gallery:
      company.gallery ||
      [
        createScenePlaceholder('#1871D8', '#141E30', 'Visual merchandising'),
        createScenePlaceholder('#141E30', '#35577D', 'Equipo y local')
      ],
    socialLinks: {
      instagram: company.socialLinks?.instagram || 'https://instagram.com/conectados.demo',
      tiktok: company.socialLinks?.tiktok || 'https://tiktok.com/@conectados.demo',
      linkedin: company.socialLinks?.linkedin || 'https://linkedin.com/company/conectados-demo'
    },
    allianceProfile: {
      offers: company.alliance_profile.offers.map(formatTagLabel),
      needs: company.alliance_profile.needs.map(formatTagLabel),
      keySegments: company.alliance_profile.preferred_segments.map(formatSegmentLabel)
    }
  };
}

export function formatTagLabel(tag) {
  const labels = {
    audiencia: 'Base de clientes',
    espacio: 'Eventos',
    clientes: 'Base de clientes',
    producto: 'Producto fisico',
    logistica: 'Servicios',
    ventas: 'Visibilidad',
    visibilidad: 'Visibilidad',
    trafico: 'Colaboraciones',
    canales: 'Descuentos cruzados',
    branding: 'Colaboraciones',
    engagement: 'Eventos'
  };

  return labels[tag] || tag;
}

export function formatSegmentLabel(segment) {
  const labels = {
    cafeteria: 'Gastronomia',
    indumentaria: 'Indumentaria',
    gastronomia: 'Gastronomia',
    perfumeria: 'Belleza',
    gimnasio: 'Fitness',
    decoracion: 'Retail',
    tecnologia: 'Tecnologia',
    accesorios: 'Retail',
    belleza: 'Belleza',
    turismo: 'Turismo',
    entretenimiento: 'Servicios profesionales',
    educacion: 'Educacion',
    retail: 'Retail',
    otros: 'Retail'
  };

  return labels[segment] || segment;
}

function overlapCount(leftValues = [], rightValues = []) {
  const rightSet = new Set(rightValues.map(normalizeValue));
  return leftValues.filter((value) => rightSet.has(normalizeValue(value))).length;
}

function createScenePlaceholder(start, end, label) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420" fill="none">
      <rect width="640" height="420" rx="36" fill="url(#g)"/>
      <circle cx="522" cy="92" r="72" fill="rgba(255,255,255,0.16)"/>
      <circle cx="134" cy="296" r="96" fill="rgba(255,255,255,0.1)"/>
      <rect x="58" y="278" width="228" height="18" rx="9" fill="rgba(255,255,255,0.9)"/>
      <rect x="58" y="310" width="168" height="14" rx="7" fill="rgba(255,255,255,0.62)"/>
      <text x="58" y="100" fill="white" font-family="Inter, Arial, sans-serif" font-size="18" letter-spacing="4" opacity="0.78">CONECTADOS</text>
      <text x="58" y="150" fill="white" font-family="Space Grotesk, Arial, sans-serif" font-size="40" font-weight="700">${label}</text>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="640" y2="420" gradientUnits="userSpaceOnUse">
          <stop stop-color="${start}"/>
          <stop offset="1" stop-color="${end}"/>
        </linearGradient>
      </defs>
    </svg>`
  )}`;
}

export function buildCompanyFromProfile(baseCompany, profile) {
  const location = `${profile.location.city}, ${profile.location.country}`;
  const primaryIndustry = profile.industries[0] || baseCompany.industry;

  return {
    ...baseCompany,
    name: profile.name,
    industry: primaryIndustry,
    sector: primaryIndustry,
    logo: profile.name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),
    logoImage: profile.logoImage,
    location,
    branches: profile.branches,
    description: profile.description,
    gallery: profile.gallery,
    socialLinks: profile.socialLinks,
    segments: profile.allianceProfile.keySegments,
    alliance_profile: {
      ...baseCompany.alliance_profile,
      offers: profile.allianceProfile.offers,
      needs: profile.allianceProfile.needs,
      preferred_segments: profile.allianceProfile.keySegments
    },
    offer: profile.allianceProfile.offers.join(', '),
    seeking: profile.allianceProfile.needs.join(', '),
    industries: profile.industries
  };
}

export function personalizeRecommendedCompanies(baseCompanies, profile) {
  return baseCompanies.map((company) => {
    const offerTags = company.offer.split(',').map((item) => item.trim());
    const needTags = company.seeking.split(',').map((item) => item.trim());
    const industryOverlap = overlapCount(
      [...profile.industries, ...profile.allianceProfile.keySegments],
      [company.sector, ...company.segments]
    );
    const offerNeedFit = overlapCount(profile.allianceProfile.offers, needTags);
    const needOfferFit = overlapCount(profile.allianceProfile.needs, offerTags);
    const bonus = Math.min(18, industryOverlap * 4 + offerNeedFit * 5 + needOfferFit * 5);

    return {
      ...company,
      synergyFromThem: Math.min(100, company.synergyFromThem + bonus),
      synergyToThem: Math.min(100, company.synergyToThem + Math.round(bonus * 0.8)),
      fitSummary:
        bonus > 0
          ? `Ajustado segun tu perfil: +${bonus} puntos por industria, oferta y busqueda.`
          : 'Compatibilidad base sin ajuste adicional por perfil.'
    };
  });
}
