import { calculateMatchScore } from './matchmaking';

export const QUICK_QUESTIONS = [
  'Cuales son mis areas mas debiles?',
  'Como puedo mejorar mis ventas?',
  'Que alianzas me recomendas?',
  'Cual es mi proxima accion prioritaria?'
];

export function createWelcomeMessage(companyName) {
  return [
    `Hola, soy tu Asistente Virtual de ${companyName}.`,
    'Estoy para ayudarte a entender el negocio, priorizar ejecucion y descubrir alianzas con impacto real.',
    'Si queres, podemos empezar por ventas, diagnostico de areas o nuevas alianzas.'
  ].join('\n\n');
}

function getWeakAreas(company) {
  return [...company.internalAreas].sort((left, right) => {
    const weight = {
      Prioritario: 3,
      'En progreso': 2,
      Estable: 1
    };

    return (weight[right.status] || 0) - (weight[left.status] || 0);
  });
}

function getTopPartnerships(companies) {
  return [...companies]
    .map((company) => ({
      ...company,
      score: calculateMatchScore(company)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function buildDefaultReply(company, actions, topPartnerships) {
  const firstArea = getWeakAreas(company)[0];
  const firstPartnership = topPartnerships[0];

  return [
    `Resumen rapido para ${company.name}:`,
    `- Hoy miraria primero ${firstArea.name.toLowerCase()}, porque ${firstArea.problems.toLowerCase()}.`,
    `- La mejor alianza inmediata es ${firstPartnership.name} con ${firstPartnership.score}% de match.`,
    `- La accion mas concreta es "${actions[0].title}".`
  ].join('\n');
}

export function buildAssistantReply({
  input,
  company,
  actions,
  recommendations,
  recommendedCompanies,
  matches
}) {
  const normalized = input.toLowerCase();
  const weakAreas = getWeakAreas(company);
  const topPartnerships = getTopPartnerships(recommendedCompanies);
  const pendingRecommendations = recommendations.pending || [];

  if (normalized.includes('debil') || normalized.includes('area')) {
    return [
      'Las areas mas sensibles hoy son:',
      `- ${weakAreas[0].name}: ${weakAreas[0].problems}`,
      `- ${weakAreas[1].name}: ${weakAreas[1].problems}`,
      '',
      'Te recomendaria atacar primero el cuello de botella comercial y despues ordenar el playbook de activacion.'
    ].join('\n');
  }

  if (normalized.includes('venta')) {
    return [
      'Para mejorar ventas haria tres cosas en este orden:',
      '- Crear una propuesta conjunta con un partner fintech para aumentar recurrencia.',
      '- Usar prueba social en el perfil para subir confianza y conversion.',
      `- Ejecutar ya la accion "${actions[0].title}" para no perder momentum comercial.`
    ].join('\n');
  }

  if (normalized.includes('alianza') || normalized.includes('match')) {
    return [
      'Estas son las alianzas que priorizaria:',
      ...topPartnerships.map(
        (partnership, index) =>
          `- ${index + 1}. ${partnership.name} (${partnership.score}%): ${partnership.offer}`
      ),
      '',
      matches.length
        ? `Ya tenes ${matches.length} match${matches.length > 1 ? 'es' : ''} activo${matches.length > 1 ? 's' : ''}, asi que conviene mover propuesta y chat rapido.`
        : 'Todavia no hay matches cerrados, asi que usaria el flujo de swipe para abrir las primeras conversaciones.'
    ].join('\n');
  }

  if (
    normalized.includes('proxima accion') ||
    normalized.includes('prioritaria') ||
    normalized.includes('prioridad')
  ) {
    return [
      'Tu proxima accion prioritaria deberia ser esta:',
      `- ${actions[0].title} (${actions[0].owner})`,
      '',
      `Despues seguiria con "${pendingRecommendations[0] || 'completar el perfil con mas prueba social'}".`
    ].join('\n');
  }

  if (normalized.includes('diagnost') || normalized.includes('empresa')) {
    return [
      `Diagnostico rapido de ${company.name}:`,
      `- Fortaleza: capacidad operativa ${company.capacityScore}/100.`,
      `- Riesgo: ${weakAreas[0].name.toLowerCase()} necesita orden de ejecucion.`,
      `- Oportunidad: ${topPartnerships[0].name} puede acelerar crecimiento y visibilidad.`
    ].join('\n');
  }

  return buildDefaultReply(company, actions, topPartnerships);
}
