const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function calculateMatchScore(company) {
  const base =
    company.synergyFromThem * (company.capacityScore / 100) +
    company.synergyToThem * 0.85;
  const adjusted = base * company.reciprocityScore * company.operationalFitScore;
  const withBonus = company.multiBenefit ? adjusted * 1.06 : adjusted;
  return Math.round(clamp(withBonus / 1.7, 0, 100));
}

export function getMatchTier(score) {
  if (score >= 80) {
    return { label: 'Estrategico', color: 'tier-strong' };
  }

  if (score >= 60) {
    return { label: 'Funcional', color: 'tier-medium' };
  }

  if (score >= 40) {
    return { label: 'Debil', color: 'tier-soft' };
  }

  return { label: 'Oculto', color: 'tier-hidden' };
}

export function shouldRevealCompany(score) {
  return score >= 40;
}

export function willCreateMatch(company, score) {
  return company.reciprocates && score >= 78;
}
