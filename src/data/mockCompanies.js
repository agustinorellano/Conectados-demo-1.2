import { instagramProfiles } from './instagramData.js';

const demoCompanies = [
  {
    id: 'bloom-floreria',
    name: 'Bloom Floreria',
    type: 'retail_fisico',
    industry: 'Floreria',
    location: 'Buenos Aires',
    size: '1-5',
    channels: ['local', 'redes', 'whatsapp'],
    objectives: {
      main_goal: 'trafico',
      current_followers: 14200,
      target_followers: 25000,
      engagement_goal: 'alto',
      avg_ticket: 28000,
      monthly_sales_goal: 6500000,
      growth_expected: 20
    },
    alliance_profile: {
      offers: ['espacio', 'audiencia', 'producto'],
      needs: ['visibilidad', 'trafico'],
      open_to_alliance: true,
      preferred_segments: ['indumentaria', 'cafeteria', 'belleza', 'decoracion']
    },
    sales_process: { has_crm: false, follow_up_leads: true, response_time: 'menos_1h', conversion_tracking: false },
    marketing_process: { has_strategy: true, tracks_metrics: true, content_frequency: 'diario', paid_ads: false },
    operations_process: { has_inventory_system: true, has_defined_processes: true, team_trained: true },
    attention_process: { has_support_channel: true, measures_satisfaction: true, response_protocol: true, handles_complaints: true },
    scores: { overall: 7.2, ventas: 6.1, marketing: 7.8, operaciones: 7.0, atencion: 7.4 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'sushi-nakama',
    name: 'Sushi Nakama',
    type: 'ambos',
    industry: 'Gastronomia',
    location: 'Mendoza',
    size: '6-20',
    channels: ['local', 'delivery', 'redes'],
    objectives: {
      main_goal: 'ventas',
      current_followers: 22400,
      target_followers: 40000,
      engagement_goal: 'alto',
      avg_ticket: 35000,
      monthly_sales_goal: 11000000,
      growth_expected: 25
    },
    alliance_profile: {
      offers: ['audiencia', 'espacio', 'clientes'],
      needs: ['ventas', 'branding'],
      open_to_alliance: true,
      preferred_segments: ['indumentaria', 'bebidas', 'bienestar']
    },
    sales_process: { has_crm: true, follow_up_leads: true, response_time: 'menos_1h', conversion_tracking: true },
    marketing_process: { has_strategy: true, tracks_metrics: true, content_frequency: 'diario', paid_ads: true },
    operations_process: { has_inventory_system: true, has_defined_processes: true, team_trained: true },
    attention_process: { has_support_channel: true, measures_satisfaction: true, response_protocol: true, handles_complaints: true },
    scores: { overall: 8.0, ventas: 7.6, marketing: 8.2, operaciones: 7.9, atencion: 8.1 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'core-wellness',
    name: 'Core Wellness',
    type: 'ambos',
    industry: 'Bienestar',
    location: 'Cordoba',
    size: '6-20',
    channels: ['local', 'web', 'redes'],
    objectives: {
      main_goal: 'engagement',
      current_followers: 18700,
      target_followers: 35000,
      engagement_goal: 'alto',
      avg_ticket: 52000,
      monthly_sales_goal: 14000000,
      growth_expected: 30
    },
    alliance_profile: {
      offers: ['audiencia', 'clientes', 'espacio'],
      needs: ['visibilidad', 'canales'],
      open_to_alliance: true,
      preferred_segments: ['indumentaria', 'salud', 'gastronomia']
    },
    sales_process: { has_crm: true, follow_up_leads: true, response_time: 'menos_1h', conversion_tracking: true },
    marketing_process: { has_strategy: true, tracks_metrics: true, content_frequency: 'semanal', paid_ads: true },
    operations_process: { has_inventory_system: true, has_defined_processes: true, team_trained: true },
    attention_process: { has_support_channel: true, measures_satisfaction: true, response_protocol: true, handles_complaints: true },
    scores: { overall: 8.3, ventas: 7.8, marketing: 8.5, operaciones: 8.0, atencion: 8.4 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'moda-sustentable',
    name: 'Moda Sustentable',
    type: 'ecommerce',
    industry: 'Moda',
    location: 'Rosario',
    size: '1-5',
    channels: ['web', 'redes', 'marketplace'],
    objectives: {
      main_goal: 'branding',
      current_followers: 31200,
      target_followers: 55000,
      engagement_goal: 'alto',
      avg_ticket: 44000,
      monthly_sales_goal: 9000000,
      growth_expected: 35
    },
    alliance_profile: {
      offers: ['producto', 'audiencia'],
      needs: ['canales', 'visibilidad', 'ventas'],
      open_to_alliance: true,
      preferred_segments: ['belleza', 'indumentaria', 'accesorios']
    },
    sales_process: { has_crm: false, follow_up_leads: true, response_time: '1_24h', conversion_tracking: true },
    marketing_process: { has_strategy: true, tracks_metrics: true, content_frequency: 'diario', paid_ads: false },
    operations_process: { has_inventory_system: true, has_defined_processes: false, team_trained: true },
    attention_process: { has_support_channel: true, measures_satisfaction: false, response_protocol: true, handles_complaints: true },
    scores: { overall: 7.5, ventas: 6.8, marketing: 8.4, operaciones: 6.9, atencion: 7.2 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'digital-craft',
    name: 'Digital Craft',
    type: 'ecommerce',
    industry: 'Marketing Digital',
    location: 'Buenos Aires',
    size: '6-20',
    channels: ['web', 'redes', 'marketplace'],
    objectives: {
      main_goal: 'ventas',
      current_followers: 48000,
      target_followers: 80000,
      engagement_goal: 'medio',
      avg_ticket: 120000,
      monthly_sales_goal: 28000000,
      growth_expected: 28
    },
    alliance_profile: {
      offers: ['clientes', 'logistica', 'producto'],
      needs: ['branding', 'audiencia'],
      open_to_alliance: true,
      preferred_segments: ['retail', 'indumentaria', 'tecnologia']
    },
    sales_process: { has_crm: true, follow_up_leads: true, response_time: 'menos_1h', conversion_tracking: true },
    marketing_process: { has_strategy: true, tracks_metrics: true, content_frequency: 'diario', paid_ads: true },
    operations_process: { has_inventory_system: true, has_defined_processes: true, team_trained: true },
    attention_process: { has_support_channel: true, measures_satisfaction: true, response_protocol: true, handles_complaints: true },
    scores: { overall: 8.9, ventas: 8.8, marketing: 8.7, operaciones: 9.0, atencion: 8.6 },
    score_history: [],
    onboarding_completed: true
  }
];

const companies = [
  {
    id: 'top-white',
    name: 'Top White',
    type: 'retail_fisico',
    industry: 'Indumentaria',
    location: 'Buenos Aires',
    size: '21-50',
    channels: ['local', 'redes', 'whatsapp'],
    objectives: {
      main_goal: 'ventas',
      current_followers: 18200,
      target_followers: 30000,
      engagement_goal: 'alto',
      avg_ticket: 48500,
      monthly_sales_goal: 18000000,
      growth_expected: 24
    },
    alliance_profile: {
      offers: ['audiencia', 'espacio', 'clientes'],
      needs: ['ventas', 'visibilidad', 'trafico'],
      open_to_alliance: true,
      preferred_segments: ['perfumeria', 'belleza', 'cafeteria', 'accesorios']
    },
    sales_process: {
      has_crm: true,
      follow_up_leads: true,
      response_time: '1_24h',
      conversion_tracking: true
    },
    marketing_process: {
      has_strategy: true,
      tracks_metrics: true,
      content_frequency: 'semanal',
      paid_ads: true
    },
    operations_process: {
      has_inventory_system: true,
      has_defined_processes: true,
      team_trained: true
    },
    attention_process: {
      has_support_channel: true,
      measures_satisfaction: false,
      response_protocol: true,
      handles_complaints: false
    },
    scores: {
      overall: 7.8,
      ventas: 5,
      marketing: 4.5,
      operaciones: 6,
      atencion: 6.5
    },
    score_history: [
      { date: '2026-01-10', overall: 6.4, ventas: 4.5, marketing: 4.2, operaciones: 5.4, atencion: 5.1 },
      { date: '2026-02-10', overall: 6.9, ventas: 4.8, marketing: 4.3, operaciones: 5.8, atencion: 5.7 },
      { date: '2026-03-10', overall: 7.3, ventas: 4.9, marketing: 4.4, operaciones: 5.9, atencion: 6.1 },
      { date: '2026-04-10', overall: 7.8, ventas: 5, marketing: 4.5, operaciones: 6, atencion: 6.5 }
    ],
    onboarding_completed: true
  },
  {
    id: 'luna-beauty',
    name: 'Luna Beauty',
    type: 'ambos',
    industry: 'Belleza',
    location: 'Cordoba',
    size: '6-20',
    channels: ['local', 'web', 'redes'],
    objectives: {
      main_goal: 'branding',
      current_followers: 24100,
      target_followers: 40000,
      engagement_goal: 'alto',
      avg_ticket: 36200,
      monthly_sales_goal: 12000000,
      growth_expected: 28
    },
    alliance_profile: {
      offers: ['producto', 'audiencia', 'clientes'],
      needs: ['visibilidad', 'ventas'],
      open_to_alliance: true,
      preferred_segments: ['indumentaria', 'accesorios', 'retail']
    },
    sales_process: {
      has_crm: true,
      follow_up_leads: true,
      response_time: 'menos_1h',
      conversion_tracking: true
    },
    marketing_process: {
      has_strategy: true,
      tracks_metrics: true,
      content_frequency: 'diario',
      paid_ads: true
    },
    operations_process: {
      has_inventory_system: true,
      has_defined_processes: true,
      team_trained: true
    },
    attention_process: {
      has_support_channel: true,
      measures_satisfaction: true,
      response_protocol: true,
      handles_complaints: true
    },
    scores: { overall: 8.4, ventas: 7.2, marketing: 8.7, operaciones: 7.5, atencion: 8.1 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'cafe-patio',
    name: 'Cafe Patio',
    type: 'retail_fisico',
    industry: 'Cafeteria',
    location: 'Rosario',
    size: '6-20',
    channels: ['local', 'whatsapp', 'redes'],
    objectives: {
      main_goal: 'trafico',
      current_followers: 9600,
      target_followers: 18000,
      engagement_goal: 'medio',
      avg_ticket: 12800,
      monthly_sales_goal: 7800000,
      growth_expected: 17
    },
    alliance_profile: {
      offers: ['espacio', 'audiencia'],
      needs: ['trafico', 'visibilidad', 'canales'],
      open_to_alliance: true,
      preferred_segments: ['indumentaria', 'belleza', 'decoracion']
    },
    sales_process: {
      has_crm: false,
      follow_up_leads: true,
      response_time: '1_24h',
      conversion_tracking: false
    },
    marketing_process: {
      has_strategy: true,
      tracks_metrics: false,
      content_frequency: 'semanal',
      paid_ads: false
    },
    operations_process: {
      has_inventory_system: false,
      has_defined_processes: true,
      team_trained: true
    },
    attention_process: {
      has_support_channel: true,
      measures_satisfaction: false,
      response_protocol: false,
      handles_complaints: true
    },
    scores: { overall: 6.8, ventas: 5.7, marketing: 5.4, operaciones: 6.3, atencion: 5.9 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'fit-studio',
    name: 'Fit Studio',
    type: 'ambos',
    industry: 'Gimnasio',
    location: 'Mendoza',
    size: '21-50',
    channels: ['local', 'web', 'redes', 'whatsapp'],
    objectives: {
      main_goal: 'engagement',
      current_followers: 31800,
      target_followers: 50000,
      engagement_goal: 'alto',
      avg_ticket: 42100,
      monthly_sales_goal: 15600000,
      growth_expected: 22
    },
    alliance_profile: {
      offers: ['audiencia', 'clientes', 'espacio'],
      needs: ['branding', 'ventas'],
      open_to_alliance: true,
      preferred_segments: ['salud', 'belleza', 'indumentaria']
    },
    sales_process: {
      has_crm: true,
      follow_up_leads: true,
      response_time: 'menos_1h',
      conversion_tracking: true
    },
    marketing_process: {
      has_strategy: true,
      tracks_metrics: true,
      content_frequency: 'diario',
      paid_ads: true
    },
    operations_process: {
      has_inventory_system: true,
      has_defined_processes: true,
      team_trained: true
    },
    attention_process: {
      has_support_channel: true,
      measures_satisfaction: true,
      response_protocol: true,
      handles_complaints: true
    },
    scores: { overall: 8.1, ventas: 7.4, marketing: 8.2, operaciones: 7.8, atencion: 7.9 },
    score_history: [],
    onboarding_completed: true
  },
  {
    id: 'tech-hub',
    name: 'Tech Hub',
    type: 'ecommerce',
    industry: 'Tecnologia',
    location: 'Montevideo',
    size: '51-200',
    channels: ['web', 'marketplace', 'redes'],
    objectives: {
      main_goal: 'ventas',
      current_followers: 45100,
      target_followers: 70000,
      engagement_goal: 'medio',
      avg_ticket: 91200,
      monthly_sales_goal: 32000000,
      growth_expected: 31
    },
    alliance_profile: {
      offers: ['producto', 'clientes', 'logistica'],
      needs: ['visibilidad', 'canales'],
      open_to_alliance: true,
      preferred_segments: ['indumentaria', 'retail', 'accesorios']
    },
    sales_process: {
      has_crm: true,
      follow_up_leads: true,
      response_time: 'menos_1h',
      conversion_tracking: true
    },
    marketing_process: {
      has_strategy: true,
      tracks_metrics: true,
      content_frequency: 'diario',
      paid_ads: true
    },
    operations_process: {
      has_inventory_system: true,
      has_defined_processes: true,
      team_trained: true
    },
    attention_process: {
      has_support_channel: true,
      measures_satisfaction: true,
      response_protocol: true,
      handles_complaints: true
    },
    scores: { overall: 8.8, ventas: 8.6, marketing: 8.1, operaciones: 8.9, atencion: 8.4 },
    score_history: [],
    onboarding_completed: true
  }
];

const diagnostics = [
  {
    company_id: 'top-white',
    area: 'ventas',
    problems: [
      {
        title: 'Seguimiento irregular de leads',
        description: 'No todas las oportunidades reciben seguimiento dentro de la misma semana.',
        severity: 'alto',
        impact: 'Se enfria la intencion de compra y cae la conversion.'
      }
    ],
    score: 5,
    main_insight: 'El cuello de botella comercial esta en la consistencia del seguimiento.'
  },
  {
    company_id: 'top-white',
    area: 'marketing',
    problems: [
      {
        title: 'Falta una secuencia post campana',
        description: 'Se genera alcance, pero no hay ritual claro para convertir interes en visitas.',
        severity: 'alto',
        impact: 'Se desperdicia trafico de calidad.'
      }
    ],
    score: 4.5,
    main_insight: 'Marketing atrae atencion, pero no termina de empujarla al local.'
  },
  {
    company_id: 'top-white',
    area: 'operaciones',
    problems: [
      {
        title: 'Checklists no unificados',
        description: 'Cada responsable trabaja con su propio criterio operativo.',
        severity: 'medio',
        impact: 'Se pierde velocidad al ejecutar promociones o activaciones.'
      }
    ],
    score: 6,
    main_insight: 'Operaciones responde bien, pero necesita estandarizacion para escalar.'
  },
  {
    company_id: 'top-white',
    area: 'atencion',
    problems: [
      {
        title: 'No se mide satisfaccion post venta',
        description: 'El equipo resuelve, pero no convierte feedback en aprendizaje.',
        severity: 'medio',
        impact: 'Se repiten reclamos evitables y falta prueba social.'
      }
    ],
    score: 6.5,
    main_insight: 'Atencion funciona mejor que el resto, pero todavia no capitaliza la experiencia del cliente.'
  }
];

const recommendations = [
  {
    company_id: 'top-white',
    area: 'atencion',
    title: 'Implementar sistema de resolucion de quejas',
    description: 'Crear un protocolo simple para registrar, resolver y aprender de cada reclamo.',
    difficulty: 'media',
    impact: 'alto',
    priority: 1,
    status: 'pendiente'
  },
  {
    company_id: 'top-white',
    area: 'atencion',
    title: 'Implementar encuesta post-venta',
    description: 'Medir satisfaccion 24 horas despues de cada compra presencial.',
    difficulty: 'facil',
    impact: 'medio',
    priority: 2,
    status: 'pendiente'
  },
  {
    company_id: 'top-white',
    area: 'operaciones',
    title: 'Capacitar al equipo mensualmente',
    description: 'Una sesion corta por mes con foco en atencion, ventas y protocolo operativo.',
    difficulty: 'media',
    impact: 'alto',
    priority: 3,
    status: 'pendiente'
  },
  {
    company_id: 'top-white',
    area: 'marketing',
    title: 'Diseñar scoring visual para aliados',
    description: 'Mostrar por que una alianza suma ventas, trafico y visibilidad.',
    difficulty: 'media',
    impact: 'alto',
    priority: 4,
    status: 'en_progreso'
  },
  {
    company_id: 'top-white',
    area: 'general',
    title: 'Definir narrativa de Data Plus como motor de alianzas',
    description: 'Ordenar el mensaje comercial para el equipo y el cliente.',
    difficulty: 'facil',
    impact: 'alto',
    priority: 5,
    status: 'aplicada'
  }
];

const tasks = [
  { company_id: 'top-white', title: 'Auditar reclamos del ultimo mes', description: '', area: 'atencion', status: 'hecho', priority: 'alta', assignee_name: 'Paula', due_date: '2026-04-02' },
  { company_id: 'top-white', title: 'Documentar protocolo de devoluciones', description: '', area: 'atencion', status: 'hecho', priority: 'media', assignee_name: 'Paula', due_date: '2026-04-03' },
  { company_id: 'top-white', title: 'Crear tablero de seguimiento de reclamos', description: '', area: 'atencion', status: 'hecho', priority: 'media', assignee_name: 'Juan', due_date: '2026-04-04' },
  { company_id: 'top-white', title: 'Revisar mensajes post venta', description: '', area: 'atencion', status: 'pendiente', priority: 'media', assignee_name: 'Carla', due_date: '2026-04-30' },
  { company_id: 'top-white', title: 'Actualizar playbook de ventas', description: '', area: 'ventas', status: 'hecho', priority: 'alta', assignee_name: 'Mica', due_date: '2026-04-05' },
  { company_id: 'top-white', title: 'Reactivar leads frios', description: '', area: 'ventas', status: 'hecho', priority: 'alta', assignee_name: 'Mica', due_date: '2026-04-07' },
  { company_id: 'top-white', title: 'Armar dashboard comercial semanal', description: '', area: 'ventas', status: 'pendiente', priority: 'media', assignee_name: 'Mica', due_date: '2026-04-28' },
  { company_id: 'top-white', title: 'Definir guion de cierre rapido', description: '', area: 'ventas', status: 'pendiente', priority: 'alta', assignee_name: 'Mica', due_date: '2026-04-29' },
  { company_id: 'top-white', title: 'Lanzar campaña de temporada', description: '', area: 'marketing', status: 'hecho', priority: 'alta', assignee_name: 'Vero', due_date: '2026-04-01' },
  { company_id: 'top-white', title: 'Ordenar calendario de contenidos', description: '', area: 'marketing', status: 'hecho', priority: 'media', assignee_name: 'Vero', due_date: '2026-04-08' },
  { company_id: 'top-white', title: 'Ajustar pauta por audiencia lookalike', description: '', area: 'marketing', status: 'hecho', priority: 'alta', assignee_name: 'Vero', due_date: '2026-04-10' },
  { company_id: 'top-white', title: 'Definir encuesta de branding', description: '', area: 'marketing', status: 'pendiente', priority: 'baja', assignee_name: 'Vero', due_date: '2026-04-27' },
  { company_id: 'top-white', title: 'Configurar evento de trafico al local', description: '', area: 'marketing', status: 'pendiente', priority: 'media', assignee_name: 'Vero', due_date: '2026-04-26' },
  { company_id: 'top-white', title: 'Revisar stock de temporada', description: '', area: 'operaciones', status: 'hecho', priority: 'alta', assignee_name: 'Lucho', due_date: '2026-04-02' },
  { company_id: 'top-white', title: 'Unificar checklists del salon', description: '', area: 'operaciones', status: 'hecho', priority: 'media', assignee_name: 'Lucho', due_date: '2026-04-06' },
  { company_id: 'top-white', title: 'Documentar proceso de reposicion', description: '', area: 'operaciones', status: 'hecho', priority: 'media', assignee_name: 'Lucho', due_date: '2026-04-09' },
  { company_id: 'top-white', title: 'Capacitacion de apertura y cierre', description: '', area: 'operaciones', status: 'pendiente', priority: 'media', assignee_name: 'Lucho', due_date: '2026-04-24' },
  { company_id: 'top-white', title: 'Preparar kit de alianza para corner', description: '', area: 'general', status: 'hecho', priority: 'alta', assignee_name: 'Equipo', due_date: '2026-04-11' },
  { company_id: 'top-white', title: 'Enviar propuesta a Luna Beauty', description: '', area: 'general', status: 'hecho', priority: 'alta', assignee_name: 'Equipo', due_date: '2026-04-12' },
  { company_id: 'top-white', title: 'Validar calendario de activaciones conjuntas', description: '', area: 'general', status: 'hecho', priority: 'media', assignee_name: 'Equipo', due_date: '2026-04-15' },
  { company_id: 'top-white', title: 'Cargar feedback de clientes VIP', description: '', area: 'general', status: 'hecho', priority: 'baja', assignee_name: 'Equipo', due_date: '2026-04-17' },
  { company_id: 'top-white', title: 'Definir propuesta para Fit Studio', description: '', area: 'general', status: 'hecho', priority: 'media', assignee_name: 'Equipo', due_date: '2026-04-19' },
  { company_id: 'top-white', title: 'Agendar capacitacion interna', description: '', area: 'general', status: 'hecho', priority: 'media', assignee_name: 'Equipo', due_date: '2026-04-20' }
];

const alliances = [
  {
    company_a_id: 'top-white',
    company_b_id: 'luna-beauty',
    match_score: 92,
    alliance_type: 'co_marketing',
    status: 'en_negociacion',
    proposal: 'Capsula de temporada con activacion conjunta en local y redes.',
    justification: 'Comparten audiencia aspiracional, ticket compatible y objetivos de visibilidad.',
    results: {
      sales_impact: 18,
      new_clients: 124,
      notes: 'Primer piloto ya validado en redes.'
    }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'cafe-patio',
    match_score: 81,
    alliance_type: 'alianza_fisica',
    status: 'contactada',
    proposal: 'Beneficio cruzado para clientes y eventos de trafico al local.',
    justification: 'Ambas marcas necesitan mas trafico fisico y comparten una misma zona comercial.',
    results: {
      sales_impact: 9,
      new_clients: 44,
      notes: 'Falta definir calendario final.'
    }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'fit-studio',
    match_score: 86,
    alliance_type: 'bundle',
    status: 'sugerida',
    proposal: 'Pack de indumentaria + experiencia fitness para fechas clave.',
    justification: 'La audiencia comparte habitos de compra y afinidad por bienestar e imagen personal.',
    results: {
      sales_impact: 14,
      new_clients: 89,
      notes: 'Alinea bien con branding y engagement.'
    }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'tech-hub',
    match_score: 67,
    alliance_type: 'cross_selling',
    status: 'rechazada',
    proposal: 'Promociones cruzadas con accesorios tech para gifting.',
    justification: 'Buen ticket, pero baja cercania de marca para la audiencia actual.',
    results: {
      sales_impact: 4,
      new_clients: 16,
      notes: 'Se descarto por bajo fit percibido.'
    }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'bloom-floreria',
    match_score: 88,
    alliance_type: 'co_marketing',
    status: 'contactada',
    proposal: 'Activacion conjunta con flores y moda para fechas especiales.',
    justification: 'Audiencias complementarias con alto interes en estetica y regalos.',
    results: { sales_impact: 12, new_clients: 67, notes: 'Primer contacto positivo.' }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'sushi-nakama',
    match_score: 79,
    alliance_type: 'alianza_fisica',
    status: 'sugerida',
    proposal: 'Beneficios cruzados para clientes VIP en fechas clave.',
    justification: 'Ambas marcas apuntan a un publico con alto ticket y lifestyle aspiracional.',
    results: { sales_impact: 8, new_clients: 41, notes: 'Pendiente primer contacto.' }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'core-wellness',
    match_score: 84,
    alliance_type: 'bundle',
    status: 'sugerida',
    proposal: 'Pack bienestar + moda para temporada de verano.',
    justification: 'Fuerte fit en valores de marca y segmento objetivo compartido.',
    results: { sales_impact: 11, new_clients: 72, notes: 'Alta compatibilidad de audiencia.' }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'moda-sustentable',
    match_score: 76,
    alliance_type: 'co_marketing',
    status: 'sugerida',
    proposal: 'Coleccion capsular con foco en moda responsable.',
    justification: 'Valores de marca alineados, audiencias jovenes con sensibilidad sustentable.',
    results: { sales_impact: 9, new_clients: 53, notes: 'Interes mutuo confirmado.' }
  },
  {
    company_a_id: 'top-white',
    company_b_id: 'digital-craft',
    match_score: 71,
    alliance_type: 'cross_selling',
    status: 'sugerida',
    proposal: 'Servicios de marketing digital para potenciar campanas de temporada.',
    justification: 'Complementariedad tecnica con alto potencial de conversion.',
    results: { sales_impact: 7, new_clients: 38, notes: 'Requiere reunion de alineacion.' }
  }
];

const currentCompanyEntity = companies.find((company) => company.id === 'top-white');

const areaMap = {
  ventas: 'Ventas',
  marketing: 'Marketing',
  operaciones: 'Operaciones',
  atencion: 'Atencion al Cliente'
};

const typeMap = {
  retail_fisico: 'Retail fisico',
  ecommerce: 'E-commerce',
  ambos: 'Retail + e-commerce'
};

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function sizeLabel(size) {
  return `${size} personas`;
}

function areaStatus(score) {
  if (score < 5) {
    return 'Prioritario';
  }
  if (score < 6.5) {
    return 'En progreso';
  }
  return 'Estable';
}

function areaColor(score) {
  if (score >= 7) {
    return 'bg-emerald-500';
  }
  if (score >= 5) {
    return 'bg-amber-500';
  }
  return 'bg-blue-500';
}

export const currentCompany = {
  ...currentCompanyEntity,
  logo: initials(currentCompanyEntity.name),
  sector: currentCompanyEntity.industry,
  businessType: typeMap[currentCompanyEntity.type],
  companySize: sizeLabel(currentCompanyEntity.size),
  offer: currentCompanyEntity.alliance_profile.offers.join(', '),
  seeking: currentCompanyEntity.alliance_profile.needs.join(', '),
  objectiveHighlights: [
    currentCompanyEntity.objectives.main_goal,
    `${currentCompanyEntity.objectives.growth_expected}% crecimiento esperado`,
    `${currentCompanyEntity.objectives.avg_ticket.toLocaleString('es-AR')} ticket promedio`
  ],
  segments: currentCompanyEntity.alliance_profile.preferred_segments,
  capacityScore: Math.round(currentCompanyEntity.scores.overall * 10),
  metrics: {
    instagram: `${Math.round(currentCompanyEntity.objectives.current_followers / 1000)}k`,
    tiktok: `${Math.round(currentCompanyEntity.objectives.target_followers / 1000)}k objetivo`,
    physicalSales: `$${Math.round(currentCompanyEntity.objectives.monthly_sales_goal / 1000000)}M`,
    ecommerceSales: currentCompanyEntity.type === 'retail_fisico' ? 'No aplica' : '$5.4M',
    conversion: `${currentCompanyEntity.scores.ventas * 10}%`
  },
  internalAreas: diagnostics
    .filter((diagnostic) => diagnostic.company_id === currentCompanyEntity.id)
    .map((diagnostic) => ({
      name: areaMap[diagnostic.area],
      context: diagnostic.main_insight,
      problems: diagnostic.problems[0]?.description || diagnostic.problems[0]?.impact || '',
      status: areaStatus(diagnostic.score)
    })),
  instagramData: {
    ...instagramProfiles['top-white'],
    followers: currentCompanyEntity.objectives.current_followers,
  },
};

const allCompanies = [...companies, ...demoCompanies];

const companyImages = {
  'bloom-floreria': 'https://images.unsplash.com/photo-1490750967868-88df5691cc0a?w=800&q=80&fit=crop',
  'sushi-nakama': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80&fit=crop',
  'core-wellness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&fit=crop',
  'moda-sustentable': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
  'digital-craft': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop',
  'luna-beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80&fit=crop',
  'cafe-patio': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&fit=crop',
  'fit-studio': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop',
  'tech-hub': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&fit=crop',
};


export const recommendedCompanies = alliances
  .filter(
    (alliance) =>
      alliance.company_a_id === currentCompanyEntity.id &&
      alliance.status !== 'rechazada'
  )
  .map((alliance) => {
    const company = allCompanies.find((item) => item.id === alliance.company_b_id);
    return {
      id: company.id,
      name: company.name,
      logo: initials(company.name),
      sector: company.industry,
      headline: alliance.proposal,
      offer: company.alliance_profile.offers.join(', '),
      seeking: company.alliance_profile.needs.join(', '),
      segments: company.alliance_profile.preferred_segments,
      location: company.location,
      size: sizeLabel(company.size),
      synergyFromThem: Math.round(alliance.match_score * 0.98),
      synergyToThem: Math.round(alliance.match_score * 0.94),
      capacityScore: Math.round(company.scores.overall * 10),
      reciprocityScore: company.alliance_profile.open_to_alliance ? 1.12 : 0.9,
      operationalFitScore: company.scores.operaciones >= 7 ? 1.08 : 0.97,
      multiBenefit: alliance.alliance_type !== 'cross_selling',
      reciprocates: alliance.status !== 'rechazada',
      culture: alliance.justification,
      goals: [
        company.objectives.main_goal,
        `${company.objectives.growth_expected}% crecimiento esperado`
      ],
      stats: {
        audience: `${Math.round(company.objectives.current_followers / 1000)}k audiencia`,
        channels: company.channels.join(' + '),
        conversionLift: `+${alliance.results.sales_impact}%`
      },
      proposal: alliance.proposal,
      allianceStatus: alliance.status,
      gallery: companyImages[company.id] ? [companyImages[company.id]] : [],
      offersArr: company.alliance_profile.offers,
      needsArr: company.alliance_profile.needs,
      description: alliance.justification,
      instagramData: instagramProfiles[company.id]
        ? {
            ...instagramProfiles[company.id],
            followers: company.objectives.current_followers,
          }
        : null,
    };
  });

export const chatConversations = [
  {
    id: 'luna-beauty',
    company: 'Luna Beauty',
    logo: 'LB',
    sector: 'Belleza',
    location: 'Cordoba',
    status: 'En negociacion',
    lastInteraction: 'Hace 12 min',
    activity: 'Activa',
    lastMessage: 'Capsula de temporada con activacion conjunta en local y redes.',
    unread: 3,
    messages: [
      {
        id: 'luna-1',
        sender: 'them',
        text: 'Tenemos buen fit para una accion conjunta en ecommerce y local.',
        time: '09:18'
      },
      {
        id: 'luna-2',
        sender: 'me',
        text: 'Perfecto. Abramos un piloto y lo conectamos con tareas internas.',
        time: '09:24'
      },
      {
        id: 'luna-3',
        sender: 'them',
        text: 'Enviame el brief desde la plataforma y seguimos por aca.',
        time: '09:29'
      }
    ]
  },
  {
    id: 'cafe-patio',
    company: 'Cafe Patio',
    logo: 'CP',
    sector: 'Cafeteria',
    location: 'Rosario',
    status: 'Contactada',
    lastInteraction: 'Ayer',
    activity: 'Seguimiento',
    lastMessage: 'Beneficio cruzado para clientes y eventos de trafico al local.',
    unread: 1,
    messages: [
      {
        id: 'cafe-1',
        sender: 'me',
        text: 'Vemos una oportunidad clara para sumar trafico en fechas clave con una dinamica cruzada.',
        time: '17:10'
      },
      {
        id: 'cafe-2',
        sender: 'them',
        text: 'Nos interesa si podemos llevarlo a una accion rapida en sucursal esta semana.',
        time: '17:18'
      }
    ]
  },
  {
    id: 'internal-marketing',
    company: 'Equipo interno / Marketing',
    logo: 'MK',
    sector: 'Canal interno',
    location: 'Data Plus Workspace',
    status: 'Interno',
    lastInteraction: 'Hoy',
    activity: 'Coordinacion',
    lastMessage: 'Necesitamos assets para la activacion conjunta con Luna Beauty.',
    unread: 0,
    isTeam: true,
    messages: [
      {
        id: 'mk-1',
        sender: 'them',
        text: 'Necesitamos assets para la activacion conjunta con Luna Beauty.',
        time: '08:50'
      },
      {
        id: 'mk-2',
        sender: 'me',
        text: 'Lo vinculo con Workplace y dejamos responsables asignados.',
        time: '09:05'
      }
    ]
  },
  {
    id: 'bloom-floreria-chat',
    company: 'Bloom Floreria',
    logo: 'BF',
    sector: 'Floreria',
    location: 'Buenos Aires',
    status: 'Match activo',
    lastInteraction: 'Hace 1 hora',
    activity: 'Activa',
    lastMessage: 'Genial! Podemos armar algo para San Valentin con flores y coleccion capsular.',
    unread: 2,
    messages: [
      {
        id: 'bloom-1',
        sender: 'me',
        text: 'Hola! Vi tu perfil y creo que tenemos un fit muy bueno para una activacion conjunta.',
        time: '10:05'
      },
      {
        id: 'bloom-2',
        sender: 'them',
        text: 'Genial! Podemos armar algo para San Valentin con flores y coleccion capsular.',
        time: '10:42'
      }
    ]
  },
  {
    id: 'sushi-nakama-chat',
    company: 'Sushi Nakama',
    logo: 'SN',
    sector: 'Gastronomia',
    location: 'Mendoza',
    status: 'Esperando respuesta',
    lastInteraction: 'Ayer',
    activity: 'Seguimiento',
    lastMessage: 'Nos parece interesante la propuesta de beneficios cruzados para clientes VIP.',
    unread: 0,
    messages: [
      {
        id: 'sushi-1',
        sender: 'me',
        text: 'Hola! Tenemos una idea para generar trafico mutuo entre nuestros locales en fechas clave.',
        time: '16:30'
      },
      {
        id: 'sushi-2',
        sender: 'them',
        text: 'Nos parece interesante la propuesta de beneficios cruzados para clientes VIP.',
        time: '17:15'
      },
      {
        id: 'sushi-3',
        sender: 'me',
        text: 'Perfecto, te mando el brief desde la plataforma para que lo revises.',
        time: '17:20'
      }
    ]
  }
];

export const chatPreviews = chatConversations;

export const demoInitialMatch = {
  id: 'bloom-floreria',
  name: 'Bloom Floreria',
  logo: 'BF',
  sector: 'Floreria',
  location: 'Buenos Aires',
  size: '1-5 personas',
  matchKind: 'like'
};

export const recommendationColumns = {
  pending: recommendations
    .filter((item) => item.status === 'pendiente')
    .map((item) => item.title),
  inProgress: recommendations
    .filter((item) => item.status === 'en_progreso')
    .map((item) => item.title),
  done: recommendations
    .filter((item) => item.status === 'aplicada')
    .map((item) => item.title)
};

export const actionItems = recommendations
  .slice()
  .sort((left, right) => left.priority - right.priority)
  .slice(0, 3)
  .map((item) => ({
    title: item.title,
    owner: areaMap[item.area] || 'General',
    priority: item.impact === 'alto' ? 'Alta' : item.impact === 'medio' ? 'Media' : 'Baja'
  }));

export const dashboardData = {
  commerce: {
    name: currentCompany.name,
    category: currentCompany.industry,
    businessType: typeMap[currentCompany.type],
    location: currentCompany.location,
    size: currentCompany.companySize,
    growth: currentCompany.objectives.growth_expected,
    avgTicket: currentCompany.objectives.avg_ticket,
    monthlyGoal: currentCompany.objectives.monthly_sales_goal,
    focus: 'Alianzas rentables con impacto real en ventas'
  },
  taskStats: {
    tasksCompleted: tasks.filter((task) => task.status === 'hecho').length,
    tasksPending: tasks.filter((task) => task.status === 'pendiente').length,
    total: tasks.length
  },
  scoreByPeriod: {
    dia: {
      score: 62,
      bestGap: 8,
      completed: 5,
      pending: 2,
      summary: 'Ritmo de hoy estable, pero todavia con margen para acelerar.'
    },
    semana: {
      score: 74,
      bestGap: 6,
      completed: 17,
      pending: 6,
      summary: 'La semana viene firme y estas a un sprint corto de tu mejor marca.'
    },
    mes: {
      score: 78,
      bestGap: 2,
      completed: 21,
      pending: 3,
      summary: 'El mes esta muy cerca de su pico y conviene sostener consistencia.'
    }
  },
  quickMetrics: [
    {
      label: 'Matches generados',
      value: 245,
      suffix: '',
      change: 12.5,
      trend: 'up',
      tone: 'blue'
    },
    {
      label: 'Empresas interesadas',
      value: 38,
      suffix: '',
      change: 8.2,
      trend: 'up',
      tone: 'emerald'
    },
    {
      label: 'Pitchs enviados',
      value: 64,
      suffix: '',
      change: -2.4,
      trend: 'down',
      tone: 'amber'
    },
    {
      label: 'Acuerdos activos',
      value: alliances.filter((alliance) =>
        ['activa', 'en_negociacion', 'contactada'].includes(alliance.status)
      ).length,
      suffix: '',
      change: 0,
      trend: 'neutral',
      tone: 'slate'
    }
  ],
  areaCards: diagnostics
    .filter((item) => item.company_id === currentCompanyEntity.id)
    .map((item) => ({
      area: item.area,
      name: areaMap[item.area],
      summary: item.problems[0]?.title || item.main_insight,
      cta:
        item.area === 'ventas'
          ? 'Recuperar leads ahora'
          : item.area === 'marketing'
            ? 'Activar secuencia'
            : item.area === 'operaciones'
              ? 'Ordenar procesos'
              : 'Medir satisfaccion',
      periods:
        item.area === 'ventas'
          ? {
              dia: { progress: 44, taskCount: 2, actionsLeft: 2, vsPrevious: -4, vsGoal: -11 },
              semana: { progress: 50, taskCount: 4, actionsLeft: 3, vsPrevious: 10, vsGoal: -5 },
              mes: { progress: 58, taskCount: 6, actionsLeft: 2, vsPrevious: 6, vsGoal: -3 }
            }
          : item.area === 'marketing'
            ? {
                dia: { progress: 41, taskCount: 2, actionsLeft: 3, vsPrevious: -2, vsGoal: -9 },
                semana: { progress: 45, taskCount: 5, actionsLeft: 4, vsPrevious: 5, vsGoal: -8 },
                mes: { progress: 52, taskCount: 7, actionsLeft: 3, vsPrevious: 8, vsGoal: -4 }
              }
            : item.area === 'operaciones'
              ? {
                  dia: { progress: 56, taskCount: 2, actionsLeft: 2, vsPrevious: 4, vsGoal: -6 },
                  semana: { progress: 60, taskCount: 4, actionsLeft: 2, vsPrevious: 7, vsGoal: -4 },
                  mes: { progress: 68, taskCount: 5, actionsLeft: 1, vsPrevious: 9, vsGoal: -2 }
                }
              : {
                  dia: { progress: 59, taskCount: 1, actionsLeft: 2, vsPrevious: 3, vsGoal: -7 },
                  semana: { progress: 65, taskCount: 4, actionsLeft: 2, vsPrevious: 12, vsGoal: -3 },
                  mes: { progress: 72, taskCount: 5, actionsLeft: 1, vsPrevious: 14, vsGoal: 1 }
                }
    })),
  priorityActions: recommendations
    .filter((item) => item.status === 'pendiente')
    .sort((left, right) => left.priority - right.priority)
    .slice(0, 3),
  matchmaking: {
    title: 'Matchmaking',
    description: 'Encontra alianzas estrategicas para crecer mas rapido',
    highlightedAlliance: alliances.find((alliance) => alliance.status === 'en_negociacion')
  }
};

// ─── Demo meetings (pre-populated for calendar) ──────────────────────────────
const today = new Date();
const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const offset = (days) => {
  const d = new Date(today);
  d.setDate(today.getDate() + days);
  return fmt(d);
};

export const demoMeetings = [
  {
    id: 'meet-1',
    title: 'Reunión Bloom Florería',
    company: 'Bloom Florería',
    companyInitials: 'BF',
    date: offset(0),
    time: '15:00',
    endTime: '16:00',
    type: 'video',
    done: false
  },
  {
    id: 'meet-2',
    title: 'Seguimiento Sushi Nakama',
    company: 'Sushi Nakama',
    companyInitials: 'SN',
    date: offset(2),
    time: '11:00',
    endTime: '11:30',
    type: 'video',
    done: false
  },
  {
    id: 'meet-3',
    title: 'Cierre propuesta Luna Beauty',
    company: 'Luna Beauty',
    companyInitials: 'LB',
    date: offset(5),
    time: '14:00',
    endTime: '15:00',
    type: 'video',
    done: false
  },
  {
    id: 'meet-4',
    title: 'Kick-off Core Wellness',
    company: 'Core Wellness',
    companyInitials: 'CW',
    date: offset(9),
    time: '10:00',
    endTime: '11:00',
    type: 'video',
    done: false
  },
  {
    id: 'meet-5',
    title: 'Revisión Digital Craft',
    company: 'Digital Craft',
    companyInitials: 'DC',
    date: offset(14),
    time: '16:00',
    endTime: '16:30',
    type: 'video',
    done: false
  }
];

export {
  alliances,
  companies,
  diagnostics,
  recommendations,
  tasks
};
