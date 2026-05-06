const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// ─── Layer 1: Seek / Offer alignment ────────────────────────────────────────
// Measures how well what a company offers cross-matches what it needs,
// indicating alliance readiness.
function computeSeekOfferFit(company) {
  const offers = company.offersArr || [];
  const needs = company.needsArr || [];
  if (offers.length === 0 && needs.length === 0) return 0.5;
  // Diversity of offer+need profile signals a mature alliance stance
  return clamp((offers.length + needs.length) / 8, 0.3, 1);
}

// ─── Layer 2: Hard data scores ───────────────────────────────────────────────

// Score Audiencia — segment breadth indicates reach quality
function computeAudienceScore(company) {
  const segments = company.segments || [];
  return clamp(segments.length / 4, 0.3, 1);
}

// Score Producto — depth of offer portfolio
function computeProductScore(company) {
  const offers = company.offersArr || [];
  if (offers.length === 0) return 0.5;
  return clamp(offers.length / 4, 0.4, 1);
}

// Score Espacio — commercial hub location premium
function computeSpaceScore(company) {
  const premiumLocations = [
    'Buenos Aires', 'CABA', 'Palermo', 'Recoleta', 'Rosario',
    'Córdoba', 'Cordoba', 'Mendoza', 'Bariloche'
  ];
  const inPremium = premiumLocations.some((loc) =>
    (company.location || '').includes(loc)
  );
  return inPremium ? 0.9 : 0.62;
}

// Score Logística — operational capacity
function computeLogisticsScore(company) {
  const capacity = company.capacityScore ?? 70;
  return clamp(capacity / 100, 0.3, 1);
}

// ─── Factors: Fit / Friction / Intent / Success / Context ───────────────────

function applyFactors({ base, company, seekOfferFit }) {
  // Fit: alliance-profile alignment bonus
  const fit = 0.55 + seekOfferFit * 0.45;

  // Friction: higher operationalFitScore = less friction
  const opFit = company.operationalFitScore ?? 0.85;
  const friction = 0.65 + opFit * 0.35;

  // Intent: mutual reciprocation signal
  const intent = company.reciprocates ? 1.15 : 0.9;

  // Success: multi-benefit multiplier
  const success = company.multiBenefit ? 1.08 : 1.0;

  // Context: neutral (extensible for seasonality / market signals)
  const context = 1.0;

  return base * fit * friction * intent * success * context;
}

// ─── Commercial action suggestion ────────────────────────────────────────────
export function getCommercialAction(score) {
  if (score >= 80) return 'Evento conjunto';
  if (score >= 65) return 'Promo en redes';
  if (score >= 50) return 'Bundle exploratorio';
  return 'Contacto inicial';
}

// ─── Main scoring function ────────────────────────────────────────────────────
export function calculateMatchScore(company) {

  // ── Legacy path: company has no structured alliance data ──
  if (!company.offersArr && !company.needsArr) {
    const synergyFrom = company.synergyFromThem ?? 70;
    const synergyTo   = company.synergyToThem   ?? 60;
    const capacity    = company.capacityScore    ?? 70;
    const reciprocity = company.reciprocityScore ?? 0.85;
    const opFit       = company.operationalFitScore ?? 0.85;

    const base = synergyFrom * (capacity / 100) + synergyTo * 0.85;
    const adjusted = base * reciprocity * opFit;
    const withBonus = company.multiBenefit ? adjusted * 1.06 : adjusted;
    return Math.round(clamp(withBonus / 1.7, 0, 100));
  }

  // ── New path: full B2B two-layer scoring ──

  // Layer 1
  const seekOfferFit = computeSeekOfferFit(company);

  // Layer 2
  const audienceScore  = computeAudienceScore(company);
  const productScore   = computeProductScore(company);
  const spaceScore     = computeSpaceScore(company);
  const logisticsScore = computeLogisticsScore(company);

  // Weighted composite from hard data (Layer 2)
  const layer2Base =
    audienceScore  * 0.28 +
    productScore   * 0.26 +
    spaceScore     * 0.18 +
    logisticsScore * 0.28;

  // Blend with legacy synergy fields when available
  const hasLegacy = company.synergyFromThem != null;
  const legacyNorm = hasLegacy
    ? ((company.synergyFromThem * ((company.capacityScore ?? 70) / 100) +
        company.synergyToThem * 0.85) *
       (company.reciprocityScore ?? 0.85) *
       (company.operationalFitScore ?? 0.85) *
       (company.multiBenefit ? 1.06 : 1)) / 170
    : null;

  const blended = hasLegacy
    ? layer2Base * 0.45 + legacyNorm * 0.55
    : layer2Base;

  // Apply Fit / Friction / Intent / Success / Context factors
  const withFactors = applyFactors({ base: blended, company, seekOfferFit });

  return Math.round(clamp(withFactors * 100, 0, 100));
}

// ─── Tier classification ──────────────────────────────────────────────────────
export function getMatchTier(score) {
  if (score >= 80) return { label: 'Estrategico', color: 'tier-strong' };
  if (score >= 60) return { label: 'Funcional',   color: 'tier-medium' };
  if (score >= 40) return { label: 'Debil',        color: 'tier-soft'   };
  return              { label: 'Oculto',        color: 'tier-hidden' };
}

// Only show companies that meet the minimum viable score
export function shouldRevealCompany(score) {
  return score >= 40;
}

// A match is created when both parties show intent and score is strong
export function willCreateMatch(company, score) {
  return company.reciprocates && score >= 78;
}
