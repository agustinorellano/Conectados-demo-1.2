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

/* ── Opportunity helpers ── */
function getUrgentOpps(opportunities) {
  return (opportunities || []).filter(o => o.priority === 'urgente' && o.status !== 'completado');
}

function getActiveOpps(opportunities) {
  return (opportunities || []).filter(o => o.status === 'en_progreso');
}

function getHighValueOpps(opportunities) {
  return (opportunities || []).filter(o => o.isHighValue && o.status !== 'completado');
}

function fmtARS(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'k';
  return '$' + n;
}

export function buildAssistantReply({
  input,
  company,
  actions,
  recommendations,
  recommendedCompanies,
  matches,
  opportunities = [],
}) {
  const normalized = input.toLowerCase();
  const weakAreas = getWeakAreas(company);
  const topPartnerships = getTopPartnerships(recommendedCompanies);
  const pendingRecommendations = recommendations.pending || [];

  const urgentOpps   = getUrgentOpps(opportunities);
  const activeOpps   = getActiveOpps(opportunities);
  const highValueOps = getHighValueOpps(opportunities);

  /* ── Workplace / Opportunities queries ── */
  if (normalized.includes('oportunidad') || normalized.includes('workplace')) {
    if (!opportunities.length) {
      return [
        'Todavía no hay oportunidades en tu Workplace.',
        'Podés crear la primera directamente desde el chat o usando el botón + en el Workplace.'
      ].join('\n');
    }
    const active = activeOpps.length;
    const urgent = urgentOpps.length;
    const totalValue = opportunities.reduce((s, o) => s + (o.estimatedValue || 0), 0);
    return [
      `Tenés ${opportunities.length} oportunidades en el Workplace:`,
      `- ${active} en ejecución activa`,
      urgent > 0 ? `- ⚠️ ${urgent} marcadas como urgentes — requieren atención` : `- Sin urgencias críticas`,
      `- Valor estimado total: ${fmtARS(totalValue)}`,
      '',
      urgentOpps[0]
        ? `Prioridad inmediata: "${urgentOpps[0].title}" con ${urgentOpps[0].partner?.name}.`
        : activeOpps[0]
          ? `Siguiente foco: "${activeOpps[0].title}" con ${activeOpps[0].partner?.name}.`
          : 'Todo en orden por ahora.',
    ].join('\n');
  }

  if (normalized.includes('urgente') || normalized.includes('critico') || normalized.includes('crítico')) {
    if (!urgentOpps.length) {
      return [
        'Buenas noticias: no tenés oportunidades urgentes en este momento.',
        'Podés aprovechar para avanzar en las de prioridad alta antes de que escalen.',
      ].join('\n');
    }
    return [
      `Tenés ${urgentOpps.length} oportunidad${urgentOpps.length > 1 ? 'es urgentes' : ' urgente'}:`,
      ...urgentOpps.map(o => `- "${o.title}" con ${o.partner?.name} (vence ${o.dueDate || 'pronto'})`),
      '',
      'Recomiendo mover estas a "En Ejecución" y asignar responsable esta semana.'
    ].join('\n');
  }

  if (normalized.includes('alto valor') || normalized.includes('revenue') || normalized.includes('ingreso')) {
    if (!highValueOps.length) {
      return 'No tenés oportunidades de alto valor activas todavía. Explorá las alianzas sugeridas para crear nuevas.';
    }
    const totalRev = opportunities.reduce((s, o) => s + (o.results?.revenue || 0), 0);
    return [
      `Tus oportunidades de alto valor activas (${highValueOps.length}):`,
      ...highValueOps.slice(0, 3).map(o => `- "${o.title}" — ${fmtARS(o.estimatedValue)} estimado`),
      '',
      `Revenue real acumulado hasta ahora: ${fmtARS(totalRev)}.`,
      'Empujá el cierre de las que están en revisión para convertir potencial en resultados reales.'
    ].join('\n');
  }

  if (normalized.includes('partner') || normalized.includes('alianza activa') || normalized.includes('alianzas activas')) {
    const partners = [...new Set(activeOpps.map(o => o.partner?.name).filter(Boolean))];
    if (!partners.length) {
      return [
        'No hay alianzas activas en ejecución en este momento.',
        'Te sugiero activar alguna de las oportunidades en Backlog para mantener el momentum.'
      ].join('\n');
    }
    return [
      `Alianzas con actividad activa ahora:`,
      ...partners.map(p => {
        const opps = activeOpps.filter(o => o.partner?.name === p);
        return `- ${p}: ${opps.length} oportunidad${opps.length > 1 ? 'es' : ''} en ejecución`;
      }),
      '',
      `Total: ${partners.length} alianzas moviéndose.`
    ].join('\n');
  }

  if (normalized.includes('plan') || normalized.includes('90 dias') || normalized.includes('90 días') || normalized.includes('trimestre')) {
    const topOpp = highValueOps[0] || urgentOpps[0] || activeOpps[0];
    return [
      `Plan de crecimiento a 90 días para ${company.name}:`,
      '',
      '📌 Mes 1 — Consolidar ejecución',
      topOpp ? `  → Cerrar "${topOpp.title}" con ${topOpp.partner?.name}.` : '  → Activar las 3 oportunidades en backlog con mayor valor.',
      `  → Ejecutar "${actions[0]?.title || 'acción prioritaria de esta semana'}".`,
      '',
      '📌 Mes 2 — Escalar alianzas',
      `  → Abrir 2 nuevas oportunidades con ${topPartnerships[0]?.name} y ${topPartnerships[1]?.name}.`,
      '  → Lanzar co-campaña de brand awareness con el partner más activo.',
      '',
      '📌 Mes 3 — Medir y optimizar',
      '  → Revisar resultados de revenue real vs. estimado.',
      '  → Priorizar las alianzas con mayor ROI para Q4.',
    ].join('\n');
  }

  if (normalized.includes('campaign') || normalized.includes('campaña') || normalized.includes('co-brand') || normalized.includes('cobranding')) {
    return [
      'Ideas de campaña co-branded para este mes:',
      '',
      `1. Bundle de temporada con ${topPartnerships[0]?.name}: combinar producto/servicio con descuento cruzado.`,
      `2. Sorteo conjunto en RRSS con ${topPartnerships[1]?.name}: regalo co-branded, 1 semana de duración.`,
      `3. Newsletter segmentado a bases B2B con ${topPartnerships[2]?.name}: contenido de valor + oferta exclusiva.`,
      '',
      'Para cada campaña necesitás: brief, materiales gráficos, split de ingresos definido y responsable asignado.',
    ].join('\n');
  }

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

  if (normalized.includes('metr') || normalized.includes('kpi') || normalized.includes('conversion')) {
    const totalRev = opportunities.reduce((s, o) => s + (o.results?.revenue || 0), 0);
    const totalLeads = opportunities.reduce((s, o) => s + (o.results?.leads || 0), 0);
    const totalConv = opportunities.reduce((s, o) => s + (o.results?.conversions || 0), 0);
    return [
      `KPIs actuales del Workplace:`,
      `- Leads generados: ${totalLeads}`,
      `- Conversiones totales: ${totalConv}`,
      `- Revenue real: ${fmtARS(totalRev)}`,
      `- Tasa de conversión: ${totalLeads > 0 ? ((totalConv / totalLeads) * 100).toFixed(1) : 0}%`,
      '',
      'Para mejorar la tasa de conversión: foco en las oportunidades en revisión que tienen leads calificados.'
    ].join('\n');
  }

  if (normalized.includes('naming') || normalized.includes('nombre')) {
    return [
      'Ideas de naming para tu alianza:',
      `- "Together by ${company.name}" — evoca colaboración premium.`,
      '- "Duo Club" — simple, memorable, funciona para bundles.',
      '- "[Marca A] × [Marca B]" — formato "collab drop" muy viral en redes.',
      '',
      'Mi favorita para co-branding: el formato × porque es reconocible y escalable a múltiples alianzas.'
    ].join('\n');
  }

  if (normalized.includes('contenido') || normalized.includes('redes') || normalized.includes('social')) {
    return [
      'Ideas de contenido para redes con tu alianza:',
      '',
      '1. Reels "behind the scenes" de la colaboración — genera autenticidad.',
      '2. Story countdown al lanzamiento del bundle — crea urgencia.',
      '3. Post carrusel: "5 razones para el combo [marca A + B]" — alto share.',
      '4. Live conjunto en Instagram con los dos founders.',
      '',
      'Recomendación: empezar con el reel y el carrusel 1 semana antes del lanzamiento.'
    ].join('\n');
  }

  return buildDefaultReply(company, actions, topPartnerships);
}
