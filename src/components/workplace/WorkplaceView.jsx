import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Video,
  Target,
  DollarSign,
  CheckCircle2,
  Circle,
  Edit2,
  List,
  LayoutDashboard,
  BarChart2,
  Check,
  Activity,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const PARTNER_COLORS = {
  pink:    { bg: 'bg-pink-500/10',    text: 'text-pink-600',    ring: 'ring-pink-200' },
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-600',    ring: 'ring-blue-200' },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-600',  ring: 'ring-violet-200' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-600',   ring: 'ring-amber-200' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-600',    ring: 'ring-cyan-200' },
  slate:   { bg: 'bg-slate-500/10',   text: 'text-slate-600',   ring: 'ring-slate-200' },
};

const PRIORITY_STYLES = {
  urgente: { dot: 'bg-red-500',   badge: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  alta:    { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' },
  media:   { dot: 'bg-blue-400',  badge: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' },
  baja:    { dot: 'bg-slate-300', badge: 'bg-slate-50 text-slate-500 ring-1 ring-slate-200' },
};

const PRIORITIES = ['urgente', 'alta', 'media', 'baja'];
const COMMERCIAL_STATUSES = ['negociación', 'activo', 'cerrado'];

const COLUMNS = [
  { key: 'backlog',      label: 'Backlog',      color: 'bg-slate-50  border-slate-200'   },
  { key: 'en_progreso',  label: 'En Ejecución', color: 'bg-blue-50   border-blue-200'    },
  { key: 'revision',     label: 'En Revisión',  color: 'bg-amber-50  border-amber-200'   },
  { key: 'completado',   label: 'Cerrado ✓',    color: 'bg-emerald-50 border-emerald-200' },
];

const PARTNERS_LIST = ['Bloom Florería', 'Sushi Nakama', 'Luna Beauty', 'Core Wellness', 'Digital Craft'];
const PARTNER_COLOR_KEYS  = { 'Bloom Florería': 'pink', 'Sushi Nakama': 'blue', 'Luna Beauty': 'violet', 'Core Wellness': 'amber', 'Digital Craft': 'cyan' };
const PARTNER_INITIALS_MAP = { 'Bloom Florería': 'BF', 'Sushi Nakama': 'SN', 'Luna Beauty': 'LB', 'Core Wellness': 'CW', 'Digital Craft': 'DC' };

const PARTNER_OPTIONS = PARTNERS_LIST;
const PARTNER_INIT_MAP = {
  'Bloom Florería': { initials: 'BF', colorKey: 'pink' },
  'Sushi Nakama':   { initials: 'SN', colorKey: 'blue' },
  'Luna Beauty':    { initials: 'LB', colorKey: 'violet' },
  'Core Wellness':  { initials: 'CW', colorKey: 'amber' },
  'Digital Craft':  { initials: 'DC', colorKey: 'cyan' },
};

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------
const MOCK_OPPORTUNITIES = [
  {
    id: 'op1', title: 'Campaña bundle primavera florería × moda',
    partner: { name: 'Bloom Florería', initials: 'BF', colorKey: 'pink' },
    type: 'colaboración', status: 'en_progreso', commercialStatus: 'activo',
    priority: 'urgente', estimatedValue: 85000, valueScale: 4,
    assignees: [{ name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }],
    dueDate: '12 May', isHighValue: true,
    fromMeeting: { title: 'Alliance Room #07', date: '6 May 2026', partner: 'Bloom Florería', participants: ['Agustín O.', 'Valentina Cruz', 'Marcos Linares'] },
    description: 'Co-branding primaveral entre florería y tienda de moda. Bundle de regalo + descuento cruzado en temporada alta. Meta: 300 tickets combinados.',
    subtasks: [
      { id: 's1-1', text: 'Definir packaging co-branded', done: true },
      { id: 's1-2', text: 'Acordar split de ingresos', done: true },
      { id: 's1-3', text: 'Diseñar flyer digital', done: false },
      { id: 's1-4', text: 'Lanzar campaña en RRSS', done: false },
    ],
    activity: [
      { id: 'a1-1', user: 'AO', action: 'movió la oportunidad a En Ejecución', time: 'Hace 2h' },
      { id: 'a1-2', user: 'VC', action: 'completó "Acordar split de ingresos"', time: 'Hace 5h' },
    ],
    comments: [{ id: 'c1-1', user: 'Agustín O.', initials: 'AO', text: 'Confirmamos el split 60/40 con Bloom. Avanzamos al diseño.', time: 'Hace 3h' }],
    results: { leads: 45, conversions: 12, revenue: 0 }, area: 'marketing', companyName: 'Bloom Florería',
  },
  {
    id: 'op2', title: 'Happy Hour conjunto viernes — café × co-working',
    partner: { name: 'Sushi Nakama', initials: 'SN', colorKey: 'blue' },
    type: 'evento', status: 'backlog', commercialStatus: 'negociación',
    priority: 'alta', estimatedValue: 42000, valueScale: 3,
    assignees: [{ name: 'Valentina Cruz', initials: 'VC', colorKey: 'violet' }, { name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }],
    dueDate: '20 May', isHighValue: false, fromMeeting: null,
    description: 'Evento mensual viernes tarde. Happy hour con descuento 20% para clientes de ambos negocios.',
    subtasks: [
      { id: 's2-1', text: 'Enviar propuesta a Sushi Nakama', done: false },
      { id: 's2-2', text: 'Definir fecha de lanzamiento', done: false },
      { id: 's2-3', text: 'Crear landing de evento', done: false },
    ],
    activity: [{ id: 'a2-1', user: 'VC', action: 'creó la oportunidad', time: 'Hace 1d' }],
    comments: [], results: { leads: 0, conversions: 0, revenue: 0 }, area: 'ventas', companyName: 'Sushi Nakama',
  },
  {
    id: 'op3', title: 'Paquete wellness + beauty — Luna × Core',
    partner: { name: 'Luna Beauty', initials: 'LB', colorKey: 'violet' },
    type: 'promoción', status: 'en_progreso', commercialStatus: 'activo',
    priority: 'alta', estimatedValue: 67000, valueScale: 4,
    assignees: [{ name: 'Marcos Linares', initials: 'ML', colorKey: 'cyan' }],
    dueDate: '18 May', isHighValue: true,
    fromMeeting: { title: 'Alliance Room #05', date: '28 Abr 2026', partner: 'Luna Beauty', participants: ['Agustín O.', 'Marcos Linares', 'Sofía Reyes'] },
    description: 'Bundle mensual: sesión de yoga + facial personalizado. Precio especial para clientas de ambas marcas.',
    subtasks: [
      { id: 's3-1', text: 'Estructurar precio de paquete', done: true },
      { id: 's3-2', text: 'Preparar contrato de colaboración', done: false },
      { id: 's3-3', text: 'Foto shoot producto', done: false },
      { id: 's3-4', text: 'Email marketing segmentado', done: false },
    ],
    activity: [
      { id: 'a3-1', user: 'ML', action: 'completó "Estructurar precio de paquete"', time: 'Hace 6h' },
      { id: 'a3-2', user: 'AO', action: 'agregó comentario', time: 'Hace 8h' },
    ],
    comments: [{ id: 'c3-1', user: 'Agustín O.', initials: 'AO', text: 'Luna confirmó que puede absorber 60 paquetes mensuales. Subimos la meta.', time: 'Hace 8h' }],
    results: { leads: 28, conversions: 7, revenue: 28000 }, area: 'marketing', companyName: 'Luna Beauty',
  },
  {
    id: 'op4', title: 'Pop-up tienda efímera centro comercial',
    partner: { name: 'Digital Craft', initials: 'DC', colorKey: 'cyan' },
    type: 'activación', status: 'revision', commercialStatus: 'activo',
    priority: 'urgente', estimatedValue: 120000, valueScale: 5,
    assignees: [{ name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }, { name: 'Sofía Reyes', initials: 'SR', colorKey: 'pink' }],
    dueDate: '10 May', isHighValue: true,
    fromMeeting: { title: 'Alliance Room #09', date: '5 May 2026', partner: 'Digital Craft', participants: ['Agustín O.', 'Sofía Reyes', 'Valentina Cruz'] },
    description: 'Pop-up de 4 días en Dot Baires. Espacio compartido con Digital Craft para demo de productos digitales + físicos.',
    subtasks: [
      { id: 's4-1', text: 'Reservar espacio en Dot', done: true },
      { id: 's4-2', text: 'Diseño de stand co-branded', done: true },
      { id: 's4-3', text: 'Contratar personal de promotoras', done: true },
      { id: 's4-4', text: 'Aprobación de materiales legales', done: false },
      { id: 's4-5', text: 'Campaña previa en redes', done: false },
    ],
    activity: [
      { id: 'a4-1', user: 'SR', action: 'envió a revisión', time: 'Hace 4h' },
      { id: 'a4-2', user: 'AO', action: 'completó "Contratar personal de promotoras"', time: 'Hace 1d' },
    ],
    comments: [{ id: 'c4-1', user: 'Sofía Reyes', initials: 'SR', text: 'Legales está revisando el contrato de Dot. Esperamos respuesta mañana.', time: 'Hace 4h' }],
    results: { leads: 80, conversions: 18, revenue: 54000 }, area: 'ventas', companyName: 'Digital Craft',
  },
  {
    id: 'op5', title: 'Descuento cruzado café × librería artesanal',
    partner: { name: 'Core Wellness', initials: 'CW', colorKey: 'amber' },
    type: 'promoción', status: 'completado', commercialStatus: 'cerrado',
    priority: 'media', estimatedValue: 30000, valueScale: 2,
    assignees: [{ name: 'Valentina Cruz', initials: 'VC', colorKey: 'violet' }],
    dueDate: '30 Abr', isHighValue: false, fromMeeting: null,
    description: 'Programa de descuento cruzado 15% entre clientes de café y librería. Duración: 30 días.',
    subtasks: [
      { id: 's5-1', text: 'Configurar cupones digitales', done: true },
      { id: 's5-2', text: 'Capacitar equipo de caja', done: true },
      { id: 's5-3', text: 'Medir resultados semana 1', done: true },
      { id: 's5-4', text: 'Cierre y reporte final', done: true },
    ],
    activity: [{ id: 'a5-1', user: 'VC', action: 'marcó como completado', time: 'Hace 3d' }],
    comments: [], results: { leads: 120, conversions: 44, revenue: 31200 }, area: 'marketing', companyName: 'Core Wellness',
  },
  {
    id: 'op6', title: 'Sorteo conjunto redes sociales mayo',
    partner: { name: 'Bloom Florería', initials: 'BF', colorKey: 'pink' },
    type: 'activación', status: 'backlog', commercialStatus: 'negociación',
    priority: 'media', estimatedValue: 22000, valueScale: 2,
    assignees: [{ name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }],
    dueDate: '25 May', isHighValue: false, fromMeeting: null,
    description: 'Sorteo colaborativo en Instagram y TikTok. Premio: gift box combinada de ambas marcas.',
    subtasks: [
      { id: 's6-1', text: 'Definir premio y bases del sorteo', done: false },
      { id: 's6-2', text: 'Diseñar piezas gráficas', done: false },
      { id: 's6-3', text: 'Publicar y gestionar interacciones', done: false },
    ],
    activity: [{ id: 'a6-1', user: 'AO', action: 'creó la oportunidad', time: 'Hace 2d' }],
    comments: [], results: { leads: 0, conversions: 0, revenue: 0 }, area: 'marketing', companyName: 'Bloom Florería',
  },
  {
    id: 'op7', title: 'Newsletter conjunto clientes B2B',
    partner: { name: 'Sushi Nakama', initials: 'SN', colorKey: 'blue' },
    type: 'colaboración', status: 'en_progreso', commercialStatus: 'activo',
    priority: 'baja', estimatedValue: 15000, valueScale: 1,
    assignees: [{ name: 'Valentina Cruz', initials: 'VC', colorKey: 'violet' }],
    dueDate: '31 May', isHighValue: false, fromMeeting: null,
    description: 'Newsletter mensual co-branded dirigido a bases de clientes B2B.',
    subtasks: [
      { id: 's7-1', text: 'Redactar contenido mes mayo', done: true },
      { id: 's7-2', text: 'Diseño del template', done: false },
      { id: 's7-3', text: 'Envío y tracking', done: false },
    ],
    activity: [{ id: 'a7-1', user: 'VC', action: 'redactó el contenido de mayo', time: 'Hace 1d' }],
    comments: [], results: { leads: 15, conversions: 3, revenue: 0 }, area: 'marketing', companyName: 'Sushi Nakama',
  },
  {
    id: 'op8', title: 'Experiencia wellness corporativa para empresas',
    partner: { name: 'Core Wellness', initials: 'CW', colorKey: 'amber' },
    type: 'evento', status: 'revision', commercialStatus: 'negociación',
    priority: 'alta', estimatedValue: 95000, valueScale: 4,
    assignees: [{ name: 'Marcos Linares', initials: 'ML', colorKey: 'cyan' }, { name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }],
    dueDate: '22 May', isHighValue: true, fromMeeting: null,
    description: 'Paquete wellness para empresas: taller de mindfulness + clases de yoga + snack saludable.',
    subtasks: [
      { id: 's8-1', text: 'Definir propuesta de valor corporativa', done: true },
      { id: 's8-2', text: 'Crear deck de presentación', done: true },
      { id: 's8-3', text: 'Presentar a 5 empresas piloto', done: false },
      { id: 's8-4', text: 'Cerrar primer contrato', done: false },
    ],
    activity: [{ id: 'a8-1', user: 'ML', action: 'envió a revisión después de presentación piloto', time: 'Hace 12h' }],
    comments: [{ id: 'c8-1', user: 'Marcos Linares', initials: 'ML', text: 'TechGroup SA mostró interés. Agendamos demo para el jueves.', time: 'Hace 12h' }],
    results: { leads: 12, conversions: 0, revenue: 0 }, area: 'ventas', companyName: 'Core Wellness',
  },
  {
    id: 'op9', title: 'Campaña Día del Libro — librería × café cultural',
    partner: { name: 'Digital Craft', initials: 'DC', colorKey: 'cyan' },
    type: 'evento', status: 'completado', commercialStatus: 'cerrado',
    priority: 'media', estimatedValue: 38000, valueScale: 3,
    assignees: [{ name: 'Sofía Reyes', initials: 'SR', colorKey: 'pink' }],
    dueDate: '23 Abr', isHighValue: false, fromMeeting: null,
    description: 'Evento especial Día del Libro: lecturas en vivo, firma de autores y café de autor. 200 asistentes.',
    subtasks: [
      { id: 's9-1', text: 'Contactar autores invitados', done: true },
      { id: 's9-2', text: 'Decoración y ambientación', done: true },
      { id: 's9-3', text: 'Cobertura en prensa local', done: true },
      { id: 's9-4', text: 'Post-evento y métricas', done: true },
    ],
    activity: [{ id: 'a9-1', user: 'SR', action: 'cerró la oportunidad con éxito', time: 'Hace 1sem' }],
    comments: [], results: { leads: 200, conversions: 68, revenue: 41200 }, area: 'marketing', companyName: 'Digital Craft',
  },
  {
    id: 'op10', title: 'Alianza delivery premium — restaurante × app',
    partner: { name: 'Sushi Nakama', initials: 'SN', colorKey: 'blue' },
    type: 'colaboración', status: 'backlog', commercialStatus: 'negociación',
    priority: 'alta', estimatedValue: 78000, valueScale: 4,
    assignees: [], dueDate: '15 Jun', isHighValue: true,
    fromMeeting: { title: 'Alliance Room #08', date: '1 May 2026', partner: 'Sushi Nakama', participants: ['Agustín O.', 'Valentina Cruz'] },
    description: 'Integración de delivery de alto valor: packaging premium co-branded, protocolo de entrega especial.',
    subtasks: [
      { id: 's10-1', text: 'Definir criterios de pedido premium', done: false },
      { id: 's10-2', text: 'Diseñar unboxing experience', done: false },
      { id: 's10-3', text: 'Negociar términos con plataformas', done: false },
    ],
    activity: [{ id: 'a10-1', user: 'AO', action: 'creó desde Alliance Room #08', time: 'Hace 5d' }],
    comments: [], results: { leads: 0, conversions: 0, revenue: 0 }, area: 'ventas', companyName: 'Sushi Nakama',
  },
  {
    id: 'op11', title: 'Programa de fidelidad unificado — app compartida',
    partner: { name: 'Luna Beauty', initials: 'LB', colorKey: 'violet' },
    type: 'colaboración', status: 'en_progreso', commercialStatus: 'activo',
    priority: 'alta', estimatedValue: 150000, valueScale: 5,
    assignees: [{ name: 'Agustín O.', initials: 'AO', colorKey: 'emerald' }, { name: 'Marcos Linares', initials: 'ML', colorKey: 'cyan' }],
    dueDate: '30 Jun', isHighValue: true, fromMeeting: null,
    description: 'Programa de puntos unificado entre 3+ marcas aliadas. App móvil con wallet de beneficios.',
    subtasks: [
      { id: 's11-1', text: 'Definir estructura de puntos y beneficios', done: true },
      { id: 's11-2', text: 'Brief para desarrollo de app', done: true },
      { id: 's11-3', text: 'MVP con 2 marcas piloto', done: false },
      { id: 's11-4', text: 'Beta testing con 100 usuarios', done: false },
      { id: 's11-5', text: 'Lanzamiento oficial', done: false },
    ],
    activity: [{ id: 'a11-1', user: 'ML', action: 'completó el brief de desarrollo', time: 'Hace 3d' }],
    comments: [{ id: 'c11-1', user: 'Agustín O.', initials: 'AO', text: 'Confirmamos presupuesto para el MVP. Arrancamos la semana que viene.', time: 'Hace 2d' }],
    results: { leads: 0, conversions: 0, revenue: 0 }, area: 'operaciones', companyName: 'Luna Beauty',
  },
  {
    id: 'op12', title: 'Capacitación ventas cruzadas equipo conjunto',
    partner: { name: 'Core Wellness', initials: 'CW', colorKey: 'amber' },
    type: 'activación', status: 'backlog', commercialStatus: 'negociación',
    priority: 'baja', estimatedValue: 18000, valueScale: 2,
    assignees: [{ name: 'Valentina Cruz', initials: 'VC', colorKey: 'violet' }],
    dueDate: '10 Jun', isHighValue: false, fromMeeting: null,
    description: 'Taller de ventas cruzadas para equipos de ambas empresas. Duración: 1 día.',
    subtasks: [
      { id: 's12-1', text: 'Diseñar contenido del taller', done: false },
      { id: 's12-2', text: 'Agendar fecha con Core Wellness', done: false },
    ],
    activity: [{ id: 'a12-1', user: 'VC', action: 'creó la oportunidad', time: 'Hace 4d' }],
    comments: [], results: { leads: 0, conversions: 0, revenue: 0 }, area: 'operaciones', companyName: 'Core Wellness',
  },
];

// ---------------------------------------------------------------------------
// ADAPT TASK (backward compat)
// ---------------------------------------------------------------------------
function adaptTask(t) {
  return {
    id: t.id, title: t.title,
    partner: { name: t.companyName || 'Sin partner', initials: (t.companyName || 'SP').slice(0, 2).toUpperCase(), colorKey: 'slate' },
    type: 'colaboración',
    status: t.status === 'pendiente' ? 'backlog' : t.status === 'en_progreso' ? 'en_progreso' : t.status === 'hecho' ? 'completado' : 'backlog',
    commercialStatus: 'activo', priority: t.priority || 'media', estimatedValue: 0, valueScale: 2,
    assignees: t.assignee_name ? [{ name: t.assignee_name, initials: t.assignee_name.slice(0, 2).toUpperCase(), colorKey: 'emerald' }] : [],
    dueDate: null, isHighValue: false, fromMeeting: null, description: '',
    subtasks: [], activity: [], comments: [], results: { leads: 0, conversions: 0, revenue: 0 },
    area: t.area || 'general', companyName: t.companyName || '',
  };
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function fmtARS(n) { return '$' + n.toLocaleString('es-AR'); }

function Avatar({ initials, colorKey, size = 'sm' }) {
  const c = PARTNER_COLORS[colorKey] || PARTNER_COLORS.slate;
  const sz = size === 'lg' ? 'w-10 h-10 text-sm' : size === 'md' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[10px]';
  return (
    <span className={`${sz} ${c.bg} ${c.text} ring-2 ${c.ring} inline-flex items-center justify-center rounded-full font-bold shrink-0`}>
      {initials}
    </span>
  );
}

function PriorityBadge({ priority, onClick }) {
  const s = PRIORITY_STYLES[priority] || PRIORITY_STYLES.baja;
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.badge} transition-opacity hover:opacity-80`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {priority}
    </button>
  );
}

// ---------------------------------------------------------------------------
// OPPORTUNITY CARD — clean structure per spec
// ---------------------------------------------------------------------------
function OpportunityCard({ opp, onOpen }) {
  const pc = PARTNER_COLORS[opp.partner.colorKey] || PARTNER_COLORS.slate;
  const ps = PRIORITY_STYLES[opp.priority] || PRIORITY_STYLES.baja;
  const completedSubtasks = opp.subtasks.filter(s => s.done).length;
  const totalSubtasks = opp.subtasks.length;

  return (
    <motion.article
      onClick={() => onOpen(opp)}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(20,30,48,0.10)' }}
      transition={{ duration: 0.15 }}
      className="rounded-[20px] bg-white ring-1 ring-slate-100 p-4 shadow-sm cursor-pointer select-none"
    >
      {/* Partner row */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar initials={opp.partner.initials} colorKey={opp.partner.colorKey} size="sm" />
        <span className={`text-xs font-semibold truncate ${pc.text}`}>{opp.partner.name}</span>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          {opp.isHighValue && (
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">⚡ Alto valor</span>
          )}
          {opp.fromMeeting && (
            <span className="rounded-full bg-violet-50 text-violet-700 px-2 py-0.5 text-[10px] font-semibold">🎥</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold text-slate-800 leading-snug mb-1">{opp.title}</h3>

      {/* Subtitle: value or description */}
      {opp.estimatedValue > 0 ? (
        <p className="text-[13px] font-bold text-emerald-700 mb-3">{fmtARS(opp.estimatedValue)} est.</p>
      ) : (
        <p className="text-[12px] text-slate-400 mb-3 truncate">{opp.description || 'Sin descripción'}</p>
      )}

      {/* Progress bar (if subtasks) */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-400">{completedSubtasks}/{totalSubtasks} tareas</p>
        </div>
      )}

      {/* Footer: priority + date + status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ps.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`} />
          {opp.priority}
        </span>
        {opp.dueDate && (
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3" />
            {opp.dueDate}
          </span>
        )}
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          opp.commercialStatus === 'activo'     ? 'bg-emerald-50 text-emerald-700' :
          opp.commercialStatus === 'negociación' ? 'bg-blue-50 text-blue-700' :
          'bg-slate-100 text-slate-500'
        }`}>
          {opp.commercialStatus}
        </span>
      </div>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// NEW CARD FORM
// ---------------------------------------------------------------------------
function NewCardForm({ status, onCancel, onCreate }) {
  const [title, setTitle] = useState('');
  const [partnerName, setPartnerName] = useState(PARTNER_OPTIONS[0]);
  const [type, setType] = useState('colaboración');
  const [valor, setValor] = useState('');
  const [priority, setPriority] = useState('media');

  const handleCreate = () => {
    if (!title.trim()) return;
    const pi = PARTNER_INIT_MAP[partnerName] || { initials: partnerName.slice(0, 2).toUpperCase(), colorKey: 'slate' };
    onCreate({
      id: `op-${Date.now()}`, title: title.trim(),
      partner: { name: partnerName, ...pi }, type, status,
      commercialStatus: 'negociación', priority, estimatedValue: parseInt(valor) || 0,
      valueScale: 2, assignees: [], dueDate: null, isHighValue: false, fromMeeting: null,
      description: '', subtasks: [],
      activity: [{ id: `a-${Date.now()}`, user: 'AO', action: 'creó la oportunidad', time: 'Ahora' }],
      comments: [], results: { leads: 0, conversions: 0, revenue: 0 }, area: 'general', companyName: partnerName,
    });
  };

  return (
    <div className="space-y-3">
      <input
        autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        placeholder="Título de la oportunidad"
        className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <div className="grid grid-cols-2 gap-2">
        <select value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
          className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none">
          {PARTNER_OPTIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none">
          {['colaboración', 'evento', 'promoción', 'activación'].map((t) => <option key={t}>{t}</option>)}
        </select>
        <input type="number" value={valor} onChange={(e) => setValor(e.target.value)}
          placeholder="Valor estimado"
          className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none">
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={handleCreate}
          className="flex-1 rounded-[14px] bg-[#141E30] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A2C45]">
          Crear oportunidad
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 rounded-[14px] border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAB
// ---------------------------------------------------------------------------
function FAB({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="fixed bottom-[90px] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#141E30] text-white transition active:scale-95 md:bottom-8"
      style={{ boxShadow: '0 8px 32px rgba(20,30,48,0.35), 0 2px 8px rgba(20,30,48,0.2)' }}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// NEW CARD MODAL (FAB target)
// ---------------------------------------------------------------------------
function NewCardModal({ onClose, onCreate, defaultStatus }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="w-full rounded-t-[24px] bg-white p-6 shadow-2xl md:max-w-md md:rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-800">Nueva oportunidad</h3>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <NewCardForm
          status={defaultStatus || 'backlog'}
          onCancel={onClose}
          onCreate={(card) => { onCreate(card); onClose(); }}
        />
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FILTER PILLS — horizontal scroll
// ---------------------------------------------------------------------------
function FilterPills({ partnerFilter, setPartnerFilter, quickFilter, setQuickFilter, priorityFilter, setPriorityFilter }) {
  const activeCount = [partnerFilter, quickFilter, priorityFilter !== 'all' ? priorityFilter : null].filter(Boolean).length;

  const clearAll = () => { setPartnerFilter(null); setQuickFilter(null); setPriorityFilter('all'); };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      {/* Partner pills */}
      {PARTNERS_LIST.map((name) => {
        const ck = PARTNER_COLOR_KEYS[name];
        const pc = PARTNER_COLORS[ck] || PARTNER_COLORS.slate;
        const initials = PARTNER_INITIALS_MAP[name];
        const isActive = partnerFilter === name;
        return (
          <button key={name} type="button"
            onClick={() => setPartnerFilter(isActive ? null : name)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
              isActive ? 'bg-[#141E30] text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-white/60' : `${pc.bg.replace('/10', '')} bg-opacity-60`}`}
              style={{ backgroundColor: isActive ? undefined : undefined }}
            />
            {initials}
          </button>
        );
      })}

      {/* Divider */}
      <div className="h-5 w-px shrink-0 bg-slate-200" />

      {/* Quick filters */}
      {[
        { id: 'high_value',   label: '⚡ Alto valor' },
        { id: 'high_priority', label: '🔴 Urgente' },
        { id: 'from_meeting', label: '🎥 Alliance' },
      ].map(({ id, label }) => (
        <button key={id} type="button"
          onClick={() => setQuickFilter(quickFilter === id ? null : id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
            quickFilter === id ? 'bg-[#141E30] text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}

      {/* Clear */}
      {activeCount > 0 && (
        <button type="button" onClick={clearAll}
          className="shrink-0 flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-500 transition hover:bg-slate-200">
          <X className="h-3 w-3" /> Limpiar
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MOBILE KANBAN — tab strip + single column
// ---------------------------------------------------------------------------
function MobileKanban({ filtered, onOpen, onAddCard }) {
  const [activeTab, setActiveTab] = useState('backlog');

  const tabCards = useMemo(
    () => filtered.filter((o) => o.status === activeTab),
    [filtered, activeTab]
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab strip */}
      <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none]">
        {COLUMNS.map(({ key, label }) => {
          const count = filtered.filter((o) => o.status === key).length;
          const isActive = activeTab === key;
          return (
            <button key={key} type="button" onClick={() => setActiveTab(key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                isActive ? 'bg-[#141E30] text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-[11px] font-normal ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        <AnimatePresence initial={false}>
          {tabCards.map((opp) => (
            <motion.div key={opp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <OpportunityCard opp={opp} onOpen={onOpen} />
            </motion.div>
          ))}
        </AnimatePresence>

        {tabCards.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-slate-200 bg-white py-12 text-center">
            <p className="text-sm font-medium text-slate-400">Sin oportunidades</p>
            <p className="mt-1 text-xs text-slate-300">Usá el botón + para crear una</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DESKTOP KANBAN BOARD — drag & drop multi-column
// ---------------------------------------------------------------------------
function KanbanBoard({ filtered, onDrop, onOpen, onAddCard }) {
  const [dragOver, setDragOver] = useState(null);
  const [addingTo, setAddingTo] = useState(null);

  const handleDrop = (e, colKey) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDrop(id, colKey);
  };

  return (
    <div className="flex flex-1 gap-4 overflow-x-auto overflow-y-hidden pb-1">
      {COLUMNS.map(({ key, label, color }) => {
        const cards = filtered.filter((o) => o.status === key);
        const isOver = dragOver === key;
        return (
          <div key={key}
            onDragOver={(e) => { e.preventDefault(); setDragOver(key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => handleDrop(e, key)}
            className={`flex flex-col rounded-[20px] border ${color} min-w-[260px] w-[260px] shrink-0 transition-all ${isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between rounded-t-[20px] border-b px-4 py-3 ${color}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-slate-500">{cards.length}</span>
              </div>
              <button type="button" onClick={() => setAddingTo(addingTo === key ? null : key)}
                className="p-1 rounded-lg hover:bg-white/60 transition text-slate-400 hover:text-slate-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4">
              <AnimatePresence>
                {addingTo === key && (
                  <motion.div key="new-form" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm">
                      <NewCardForm
                        status={key}
                        onCancel={() => setAddingTo(null)}
                        onCreate={(card) => { onAddCard(card); setAddingTo(null); }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {cards.length === 0 && addingTo !== key ? (
                <div className="rounded-[16px] border border-dashed border-slate-200 bg-white/50 p-5 text-center">
                  <p className="text-xs text-slate-400">Arrastrá una oportunidad aquí</p>
                </div>
              ) : (
                cards.map((opp) => (
                  <div key={opp.id} draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', opp.id)}>
                    <OpportunityCard opp={opp} onOpen={onOpen} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LIST VIEW (desktop)
// ---------------------------------------------------------------------------
function ListView({ filtered, onOpen }) {
  return (
    <div className="flex-1 overflow-y-auto rounded-[24px] bg-white ring-1 ring-slate-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['Oportunidad', 'Partner', 'Estado', 'Prioridad', 'Valor est.', 'Vence'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((opp) => {
            const colLabel = COLUMNS.find((c) => c.key === opp.status)?.label || opp.status;
            const ps = PRIORITY_STYLES[opp.priority] || PRIORITY_STYLES.baja;
            return (
              <tr key={opp.id} onClick={() => onOpen(opp)}
                className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition">
                <td className="px-4 py-3 font-medium text-slate-800 max-w-[220px]">
                  <p className="truncate">{opp.title}</p>
                  {opp.fromMeeting && <span className="text-[10px] text-violet-600 font-medium">🎥 Alliance Room</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar initials={opp.partner.initials} colorKey={opp.partner.colorKey} size="sm" />
                    <span className="text-xs text-slate-600 whitespace-nowrap">{opp.partner.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-medium">{colLabel}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ps.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`} />{opp.priority}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-700 tabular-nums whitespace-nowrap">
                  {opp.estimatedValue > 0 ? fmtARS(opp.estimatedValue) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{opp.dueDate || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <p className="text-sm">No hay oportunidades con los filtros actuales.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RIGHT PANEL (desktop only)
// ---------------------------------------------------------------------------
const ALERTS = [
  { id: 'al1', icon: '⚠', label: 'Campaña Luna Beauty sin actividad 7 días', oppId: 'op3', severity: 'warning' },
  { id: 'al2', icon: '🔴', label: 'Cotización Sushi Nakama vence mañana', oppId: 'op2', severity: 'danger' },
  { id: 'al3', icon: '💡', label: '3 oportunidades listas para cerrar', oppId: null, severity: 'info' },
];

const PARTNER_METRICS = [
  { name: 'Bloom Florería', initials: 'BF', colorKey: 'pink', opps: 3, revenue: 120000 },
  { name: 'Sushi Nakama',   initials: 'SN', colorKey: 'blue', opps: 2, revenue: 65000 },
  { name: 'Luna Beauty',    initials: 'LB', colorKey: 'violet', opps: 2, revenue: 40000 },
];

function RightPanel({ opportunities, onFilterMetric, onOpenAlert }) {
  const totalRevenue = opportunities.reduce((sum, o) => sum + o.results.revenue, 0);
  const activeCount  = opportunities.filter((o) => o.status === 'en_progreso').length;
  const highValueCount = opportunities.filter((o) => o.isHighValue).length;

  return (
    <aside className="w-[260px] shrink-0 space-y-4 overflow-y-auto">
      {/* Key metrics */}
      <div className="rounded-[20px] bg-white ring-1 ring-slate-100 shadow-sm p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Resumen</p>
        <div className="space-y-2">
          {[
            { label: 'Revenue generado', value: fmtARS(totalRevenue), sub: '↑ +18% este mes', filter: 'revenue', color: 'emerald' },
            { label: 'En ejecución', value: String(activeCount), sub: 'oportunidades', filter: 'active', color: 'blue' },
            { label: 'Alto valor', value: String(highValueCount), sub: 'oportunidades', filter: 'high_value', color: 'amber' },
          ].map(({ label, value, sub, filter, color }) => (
            <button key={filter} type="button" onClick={() => onFilterMetric(filter)}
              className={`w-full flex items-center justify-between rounded-[14px] bg-${color}-50 ring-1 ring-${color}-100 px-3 py-2.5 hover:ring-${color}-300 transition`}>
              <div className="text-left">
                <p className={`text-[11px] text-${color}-600 font-medium`}>{label}</p>
                <p className={`text-lg font-bold text-${color}-700`}>{value}</p>
              </div>
              <p className={`text-[10px] text-${color}-400`}>{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="rounded-[20px] bg-white ring-1 ring-slate-100 shadow-sm p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Alertas</p>
        <ul className="space-y-2">
          {ALERTS.map((alert) => (
            <li key={alert.id}>
              <div className={`flex items-start gap-2 rounded-[14px] p-2.5 ${
                alert.severity === 'danger'  ? 'bg-red-50 ring-1 ring-red-100' :
                alert.severity === 'warning' ? 'bg-amber-50 ring-1 ring-amber-100' :
                'bg-blue-50 ring-1 ring-blue-100'
              }`}>
                <span className="mt-0.5 text-sm">{alert.icon}</span>
                <p className="flex-1 text-xs leading-snug text-slate-600">{alert.label}</p>
                {alert.oppId && (
                  <button type="button" onClick={() => onOpenAlert(alert.oppId)}
                    className="text-[10px] font-semibold text-blue-600 whitespace-nowrap hover:underline">
                    Ver
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Partners activos */}
      <div className="rounded-[20px] bg-white ring-1 ring-slate-100 shadow-sm p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Partners activos</p>
        <ul className="space-y-1">
          {PARTNER_METRICS.map(({ name, initials, colorKey, opps, revenue }) => (
            <li key={name}>
              <button type="button" onClick={() => onFilterMetric(`partner:${name}`)}
                className="flex w-full items-center gap-2.5 rounded-[14px] px-2 py-2 hover:bg-slate-50 transition">
                <Avatar initials={initials} colorKey={colorKey} size="md" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="truncate text-xs font-semibold text-slate-700">{name}</p>
                  <p className="text-[10px] text-slate-400">{opps} opps · {fmtARS(revenue)}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// CARD DETAIL MODAL (unchanged)
// ---------------------------------------------------------------------------
function CardDetailModal({ opp, onClose }) {
  const [tab, setTab] = useState(opp._openTab || 'resumen');
  const [title, setTitle] = useState(opp.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [description, setDescription] = useState(opp.description);
  const [subtasks, setSubtasks] = useState(opp.subtasks);
  const [newSubtask, setNewSubtask] = useState('');
  const [comments, setComments] = useState(opp.comments);
  const [activity, setActivity] = useState(opp.activity);
  const [commentText, setCommentText] = useState('');
  const [results, setResults] = useState(opp.results);
  const [editingResults, setEditingResults] = useState(false);
  const [resultsForm, setResultsForm] = useState({ ...opp.results });
  const [priority, setPriority] = useState(opp.priority);
  const [commercialStatus, setCommercialStatus] = useState(opp.commercialStatus);

  const completedCount = subtasks.filter((s) => s.done).length;

  const toggleSubtask = (id) => setSubtasks((prev) => prev.map((s) => s.id === id ? { ...s, done: !s.done } : s));
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: `s-${Date.now()}`, text: newSubtask.trim(), done: false }]);
    setNewSubtask('');
  };
  const addComment = () => {
    if (!commentText.trim()) return;
    const entry = { id: `c-${Date.now()}`, user: 'Agustín O.', initials: 'AO', text: commentText.trim(), time: 'Ahora' };
    setComments((prev) => [...prev, entry]);
    setActivity((prev) => [...prev, { id: `a-${Date.now()}`, user: 'AO', action: `comentó: "${commentText.trim().slice(0, 40)}"`, time: 'Ahora' }]);
    setCommentText('');
  };
  const saveResults = () => { setResults(resultsForm); setEditingResults(false); };
  const cyclePriority = () => { const idx = PRIORITIES.indexOf(priority); setPriority(PRIORITIES[(idx + 1) % PRIORITIES.length]); };
  const cycleStatus   = () => { const idx = COMMERCIAL_STATUSES.indexOf(commercialStatus); setCommercialStatus(COMMERCIAL_STATUSES[(idx + 1) % COMMERCIAL_STATUSES.length]); };

  const tabs = ['resumen', 'subtareas', 'actividad', 'resultados'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-slate-100 bg-white p-6 pb-4">
          <div className="flex items-start gap-3">
            <Avatar initials={opp.partner.initials} colorKey={opp.partner.colorKey} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-medium text-slate-400">{opp.partner.name}</p>
              {editingTitle ? (
                <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                  className="w-full border-b-2 border-blue-400 bg-transparent text-xl font-bold text-slate-800 outline-none"
                />
              ) : (
                <h2 className="cursor-text text-xl font-bold leading-tight text-slate-800 hover:text-blue-700 transition"
                  onClick={() => setEditingTitle(true)} title="Clic para editar">
                  {title} <Edit2 className="inline h-3.5 w-3.5 ml-1 text-slate-300" />
                </h2>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={priority} onClick={cyclePriority} />
                <button type="button" onClick={cycleStatus}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 hover:opacity-80 transition">
                  {commercialStatus}
                </button>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-500">{opp.type}</span>
              </div>
            </div>
            <button type="button" onClick={onClose}
              className="ml-2 shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-1 border-b border-slate-100">
            {tabs.map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`rounded-t-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  tab === t ? 'border-b-2 border-[#141E30] text-[#141E30]' : 'text-slate-400 hover:text-slate-600'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* RESUMEN */}
          {tab === 'resumen' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                  className="w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-400">Responsables</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {opp.assignees.map((a) => (
                      <div key={a.name} className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                        <Avatar initials={a.initials} colorKey={a.colorKey} size="sm" />
                        <span className="text-xs text-slate-600">{a.name}</span>
                      </div>
                    ))}
                    <button type="button" className="rounded-full border border-dashed border-slate-300 px-2 py-1 text-[10px] text-slate-400 hover:border-slate-400">
                      + Agregar
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-400">Detalles</label>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /><span>{opp.dueDate || 'Sin fecha'}</span></div>
                    <div className="flex items-center gap-2"><Target className="h-4 w-4 text-slate-400" /><span className="capitalize">{opp.type}</span></div>
                    <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-slate-400" /><span className="font-semibold text-emerald-700">{fmtARS(opp.estimatedValue)}</span></div>
                  </div>
                </div>
              </div>
              {opp.fromMeeting && (
                <div className="rounded-[16px] bg-violet-50 p-4 ring-1 ring-violet-200">
                  <div className="flex items-start gap-3">
                    <Video className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-violet-800">Origen: {opp.fromMeeting.title} · {opp.fromMeeting.date}</p>
                      <p className="mt-0.5 text-xs text-violet-600">
                        {opp.fromMeeting.partner} — {opp.fromMeeting.participants.map((p) => p.split(' ').map((w) => w[0]).join('')).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUBTAREAS */}
          {tab === 'subtareas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Completadas {completedCount}/{subtasks.length}</span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: subtasks.length ? `${(completedCount / subtasks.length) * 100}%` : '0%' }} />
                </div>
              </div>
              <ul className="space-y-2">
                {subtasks.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => toggleSubtask(s.id)}
                      className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-slate-50 transition">
                      {s.done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <Circle className="h-4 w-4 shrink-0 text-slate-300" />}
                      <span className={`text-sm ${s.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{s.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2">
                <input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                  placeholder="+ Nueva subtarea"
                  className="flex-1 rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                <button type="button" onClick={addSubtask}
                  className="rounded-[14px] bg-[#141E30] px-3 py-2 text-white transition hover:bg-[#1A2C45]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ACTIVIDAD */}
          {tab === 'actividad' && (
            <div className="space-y-4">
              <ul className="space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <Avatar initials={a.user} colorKey="emerald" size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700"><span className="font-semibold">{a.user}</span> {a.action}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {comments.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <Avatar initials={c.initials} colorKey="emerald" size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{c.user}</p>
                        <p className="text-sm text-slate-600">{c.text}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{c.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={2}
                  placeholder="Agregar comentario..."
                  className="flex-1 resize-none rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                <button type="button" onClick={addComment} disabled={!commentText.trim()}
                  className="rounded-[14px] bg-[#141E30] px-3 text-white transition hover:bg-[#1A2C45] disabled:opacity-40">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* RESULTADOS */}
          {tab === 'resultados' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Leads', key: 'leads', icon: Target, color: 'blue' },
                  { label: 'Conversiones', key: 'conversions', icon: TrendingUp, color: 'emerald' },
                  { label: 'Ingresos', key: 'revenue', icon: DollarSign, color: 'amber' },
                ].map(({ label, key, icon: Icon, color }) => (
                  <div key={key} className={`rounded-[16px] bg-${color}-50 p-4 ring-1 ring-${color}-200 text-center`}>
                    <Icon className={`mx-auto mb-2 h-5 w-5 text-${color}-500`} />
                    <p className={`text-2xl font-bold text-${color}-700`}>
                      {key === 'revenue' ? fmtARS(results[key]) : results[key]}
                    </p>
                    <p className={`mt-1 text-xs text-${color}-500`}>{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[16px] bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="mb-3 text-sm font-semibold text-slate-600">Proyectado vs real</p>
                <div className="flex items-center justify-between text-sm">
                  <div><p className="text-xs text-slate-400">Proyectado</p><p className="font-bold text-slate-700">{fmtARS(opp.estimatedValue)}</p></div>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <div><p className="text-xs text-slate-400">Real</p><p className="font-bold text-emerald-700">{fmtARS(results.revenue)}</p></div>
                  <div>
                    <p className="text-xs text-slate-400">Ejecución</p>
                    <p className="font-bold text-blue-700">{opp.estimatedValue > 0 ? `${Math.round((results.revenue / opp.estimatedValue) * 100)}%` : '—'}</p>
                  </div>
                </div>
              </div>
              {editingResults ? (
                <div className="space-y-3 rounded-[16px] border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">Actualizar métricas</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['leads', 'conversions', 'revenue'].map((key) => (
                      <div key={key}>
                        <label className="mb-1 block text-[10px] font-medium capitalize text-blue-600">{key}</label>
                        <input type="number" value={resultsForm[key]}
                          onChange={(e) => setResultsForm((prev) => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                          className="w-full rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={saveResults} className="flex-1 rounded-xl bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition">Guardar</button>
                    <button type="button" onClick={() => setEditingResults(false)} className="flex-1 rounded-xl border border-blue-200 py-1.5 text-xs text-blue-600 hover:bg-white transition">Cancelar</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setEditingResults(true)}
                  className="w-full rounded-[16px] border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 transition">
                  Actualizar métricas
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WORKPLACE VIEW (MAIN)
// ---------------------------------------------------------------------------
function WorkplaceView({ currentArea = 'general', onTaskMove, tasks = [] }) {
  const [opportunities, setOpportunities] = useState(() => [
    ...MOCK_OPPORTUNITIES,
    ...tasks.map(adaptTask),
  ]);
  const [view, setView] = useState('kanban');
  const [selectedCard, setSelectedCard] = useState(null);
  const [quickFilter, setQuickFilter] = useState(null);
  const [partnerFilter, setPartnerFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCard, setShowNewCard] = useState(false);

  // Filtered list
  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      if (searchQuery &&
        !opp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !opp.partner.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (partnerFilter && opp.partner.name !== partnerFilter) return false;
      if (priorityFilter !== 'all' && opp.priority !== priorityFilter) return false;
      if (quickFilter === 'high_value' && !opp.isHighValue) return false;
      if (quickFilter === 'high_priority' && !['alta', 'urgente'].includes(opp.priority)) return false;
      if (quickFilter === 'from_meeting' && !opp.fromMeeting) return false;
      return true;
    });
  }, [opportunities, searchQuery, partnerFilter, priorityFilter, quickFilter]);

  // Handlers
  const handleDrop = useCallback((id, newStatus) => {
    setOpportunities((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    if (onTaskMove) onTaskMove(id, newStatus);
  }, [onTaskMove]);

  const handleOpen = useCallback((opp) => setSelectedCard({ ...opp, _openTab: 'resumen' }), []);

  const handleAddCard = useCallback((card) => setOpportunities((prev) => [...prev, card]), []);

  const handleFilterMetric = useCallback((filter) => {
    if (filter === 'high_value') setQuickFilter('high_value');
    else if (filter.startsWith('partner:')) {
      const name = filter.replace('partner:', '');
      setPartnerFilter((prev) => prev === name ? null : name);
    }
  }, []);

  const handleOpenAlert = useCallback((oppId) => {
    const found = opportunities.find((o) => o.id === oppId);
    if (found) setSelectedCard({ ...found, _openTab: 'resumen' });
  }, [opportunities]);

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 160px)', overflow: 'hidden' }}>

      {/* ── Search bar + controls ── */}
      <div className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 ring-1 ring-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar oportunidades..."
            className="w-full rounded-[14px] border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Count badge */}
        <span className="hidden whitespace-nowrap text-xs text-slate-400 sm:block">
          {filtered.length} oportunidades
        </span>

        {/* View toggle — desktop only */}
        <div className="hidden gap-0.5 rounded-[14px] bg-slate-100 p-1 md:flex">
          <button type="button" onClick={() => setView('kanban')}
            className={`rounded-[10px] p-1.5 transition ${view === 'kanban' ? 'bg-white shadow-sm text-[#141E30]' : 'text-slate-400 hover:text-slate-600'}`}>
            <LayoutDashboard className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setView('list')}
            className={`rounded-[10px] p-1.5 transition ${view === 'list' ? 'bg-white shadow-sm text-[#141E30]' : 'text-slate-400 hover:text-slate-600'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <FilterPills
        partnerFilter={partnerFilter}
        setPartnerFilter={setPartnerFilter}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* ── Content area ── */}
      <div className="flex min-w-0 flex-1 gap-5 overflow-hidden">

        {/* Mobile: tab kanban (hidden md+) */}
        <div className="flex flex-1 flex-col overflow-hidden md:hidden">
          <MobileKanban
            filtered={filtered}
            onOpen={handleOpen}
            onAddCard={handleAddCard}
          />
        </div>

        {/* Desktop: multi-col kanban or list (hidden on mobile) */}
        <div className="hidden flex-1 flex-col gap-4 overflow-hidden md:flex">
          {view === 'kanban' ? (
            <KanbanBoard
              filtered={filtered}
              onDrop={handleDrop}
              onOpen={handleOpen}
              onAddCard={handleAddCard}
            />
          ) : (
            <ListView filtered={filtered} onOpen={handleOpen} />
          )}
        </div>

        {/* Desktop: right panel (hidden on mobile) */}
        <div className="hidden md:block">
          <RightPanel
            opportunities={opportunities}
            onFilterMetric={handleFilterMetric}
            onOpenAlert={handleOpenAlert}
          />
        </div>
      </div>

      {/* ── FAB ── */}
      <FAB onClick={() => setShowNewCard(true)} />

      {/* ── Modals ── */}
      <AnimatePresence>
        {showNewCard && (
          <NewCardModal
            key="new-card-modal"
            onClose={() => setShowNewCard(false)}
            onCreate={handleAddCard}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal
            key={selectedCard.id}
            opp={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorkplaceView;
