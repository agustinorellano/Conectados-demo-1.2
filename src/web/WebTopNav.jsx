import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, Bot, BriefcaseBusiness, Building2, CreditCard, Heart,
  MessageSquare, Moon, Search, Settings, Sun, X, Zap,
} from 'lucide-react';
import { THEMES, useTheme } from '../context/ThemeContext';

const MOCK_USER = { name: 'Agustín Orellano', role: 'Admin' };

const NOTIFICATIONS = [
  { id: 1, text: 'Nuevo match con Bloom Florería', sub: 'Score 94% · hace 2 min', dot: '#10B981', unread: true },
  { id: 2, text: 'Luna Beauty respondió tu propuesta', sub: 'hace 15 min', dot: '#3B82F6', unread: true },
  { id: 3, text: 'Alliance Room disponible', sub: 'Bloom · hace 1h', dot: '#8B5CF6', unread: false },
];

// Dashboard y Proyectos están ocultos por la simplificación de producto (las vistas siguen en WebApp.jsx).
const NAV = [
  { id: 'alliances', label: 'Explorar',   icon: BriefcaseBusiness },
  { id: 'likes',     label: 'Likes',      icon: Heart },
  { id: 'chats',     label: 'Chats',      icon: MessageSquare },
  { id: 'profile',   label: 'Mi Empresa', icon: Building2 },
  { id: 'assistant', label: 'Asistente',  icon: Bot },
];

const SEARCH_POOL = [
  { id: 'bloom',   name: 'Bloom Florería',  sector: 'Florería',    score: 94, view: 'alliances' },
  { id: 'luna',    name: 'Luna Beauty',     sector: 'Belleza',     score: 87, view: 'alliances' },
  { id: 'sushi',   name: 'Sushi Nakama',    sector: 'Gastronomía', score: 81, view: 'chats' },
  { id: 'core',    name: 'Core Wellness',   sector: 'Bienestar',   score: 78, view: 'alliances' },
  { id: 'digital', name: 'Digital Craft',   sector: 'Tecnología',  score: 75, view: 'chats' },
  { id: 'cafe',    name: 'Café Patio',      sector: 'Cafetería',   score: 71, view: 'alliances' },
];

const SUGGESTED = [
  { id: 'verde',  name: 'Verde Market',  sector: 'Retail',     score: 91 },
  { id: 'aether', name: 'Aether Studio', sector: 'Diseño',     score: 86 },
  { id: 'nomad',  name: 'Nomad Co.',     sector: 'Tecnología', score: 82 },
];

const PLAN = {
  starter: { label: 'Starter', color: '#3B82F6' },
  growth:  { label: 'Growth',  color: '#8B5CF6' },
  scale:   { label: 'Scale',   color: '#10B981' },
};

const initials = (name = '') => name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'CO';

/**
 * Isla de navegación flotante (estilo Apple / "Dynamic Island").
 * Compacta: muestra solo la sección activa con su nombre. Al pasar el mouse se expande y muestra todos los nombres.
 * Búsqueda, notificaciones y menú de cuenta se abren como paneles justo debajo de la isla.
 */
function WebTopNav({ activeView, onNavigate, userPlan, companyName, likesCount = 0 }) {
  const { theme, toggleTheme } = useTheme();
  // La isla se mantiene azul/navy en ambos temas: usa siempre los tokens oscuros.
  const t = theme === 'light'
    ? { ...THEMES.dark, dropdownBg: 'rgba(27,35,82,0.97)' }
    : THEMES.dark;

  const [hovered, setHovered] = useState(false);
  const [panel, setPanel] = useState(null); // 'search' | 'notif' | 'menu' | null
  const [query, setQuery] = useState('');
  const [readIds, setReadIds] = useState(new Set());

  const unread = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;
  const expanded = hovered || panel !== null;
  const plan = PLAN[userPlan] ?? PLAN.starter;

  const togglePanel = (name) => {
    setPanel(current => (current === name ? null : name));
    if (name === 'notif' && panel !== 'notif') setReadIds(new Set(NOTIFICATIONS.map(n => n.id)));
  };
  const closePanel = () => { setPanel(null); setQuery(''); };
  const go = (view) => { onNavigate(view); closePanel(); };

  const results = query.trim()
    ? SEARCH_POOL.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.sector.toLowerCase().includes(query.toLowerCase()))
    : [];

  const spring = { type: 'spring', stiffness: 420, damping: 36, mass: 0.7 };
  const iconBtn = 'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors';

  return (
    <>
      {panel && <div className="fixed inset-0 z-30" onClick={closePanel} />}

      <header className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-3">
        <motion.nav
          layout
          transition={spring}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          aria-label="Navegación principal"
          className="pointer-events-auto relative flex items-center gap-1 rounded-full p-1.5"
          style={{
            background: theme === 'light' ? 'rgba(27,35,82,0.94)' : 'rgba(10,16,32,0.82)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'saturate(180%) blur(24px)',
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
            boxShadow: '0 12px 40px rgba(15,23,42,0.28), 0 2px 8px rgba(15,23,42,0.18)',
          }}
        >
          {/* Empresa */}
          <button type="button" onClick={() => togglePanel('menu')} aria-label="Cuenta y ajustes"
            className="flex h-10 shrink-0 items-center gap-2 rounded-full pl-1 pr-1 transition hover:bg-white/10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)' }}>
              {initials(companyName)}
            </span>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden whitespace-nowrap pr-1.5 text-[13px] font-semibold text-white">
                  {companyName}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <span className="mx-0.5 h-5 w-px shrink-0 bg-white/10" />

          {/* Secciones */}
          {NAV.map(item => {
            const Icon = item.icon;
            const active = item.id === activeView;
            const showLabel = active || expanded;
            return (
              <button key={item.id} type="button" onClick={() => go(item.id)}
                aria-current={active ? 'page' : undefined} aria-label={item.label} title={item.label}
                className="relative flex h-10 shrink-0 items-center gap-2 rounded-full px-3 transition-colors hover:bg-white/10"
                style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.62)' }}>
                {active && (
                  <motion.span layoutId="top-nav-active" transition={spring}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)', boxShadow: '0 4px 14px rgba(69,91,232,0.45)' }} />
                )}
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className="relative z-10 shrink-0" />
                <AnimatePresence initial={false}>
                  {showLabel && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="relative z-10 overflow-hidden whitespace-nowrap text-[13px] font-semibold">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.id === 'likes' && likesCount > 0 && (
                  <span className="relative z-10 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                    style={{ background: '#F43F5E' }}>{likesCount}</span>
                )}
              </button>
            );
          })}

          <span className="mx-0.5 h-5 w-px shrink-0 bg-white/10" />

          {/* Búsqueda */}
          <button type="button" onClick={() => togglePanel('search')} aria-label="Buscar empresas" title="Buscar"
            className={`${iconBtn} hover:bg-white/10`}
            style={{ color: panel === 'search' ? '#FFFFFF' : 'rgba(255,255,255,0.62)', background: panel === 'search' ? 'rgba(255,255,255,0.12)' : undefined }}>
            <Search size={17} strokeWidth={1.9} />
          </button>

          {/* Notificaciones */}
          <button type="button" onClick={() => togglePanel('notif')} aria-label="Notificaciones" title="Notificaciones"
            className={`${iconBtn} hover:bg-white/10`}
            style={{ color: panel === 'notif' ? '#FFFFFF' : 'rgba(255,255,255,0.62)', background: panel === 'notif' ? 'rgba(255,255,255,0.12)' : undefined }}>
            <Bell size={17} strokeWidth={1.9} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                style={{ background: '#EF4444' }}>{unread}</span>
            )}
          </button>

          {/* ── Paneles (se abren debajo de la isla, sin recortarse) ── */}
          <AnimatePresence>
            {panel && (
              <motion.div
                key={panel}
                initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute top-full mt-3 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-[24px]"
                style={{
                  right: panel === 'menu' ? 'auto' : 0,
                  left: panel === 'menu' ? 0 : 'auto',
                  background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`,
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 20px 50px rgba(15,23,42,0.35)',
                }}
              >
                {panel === 'notif' && (
                  <>
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${t.sidebarDivider}` }}>
                      <span className="text-[13px] font-bold text-white">Notificaciones</span>
                      <button type="button" onClick={closePanel} aria-label="Cerrar" className="text-white/50 transition hover:text-white"><X size={15} /></button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                      {NOTIFICATIONS.map(n => (
                        <div key={n.id} className="flex items-start gap-3 rounded-[16px] px-3 py-3 transition hover:bg-white/5">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: n.dot }} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium leading-snug text-white">{n.text}</p>
                            <p className="mt-0.5 text-[11px] text-white/50">{n.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {panel === 'search' && (
                  <div className="p-3">
                    <div className="flex items-center gap-2 rounded-[14px] px-3 py-2.5"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
                      <Search size={15} className="shrink-0 text-white/50" />
                      <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar empresas…"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40" />
                      {query && (
                        <button type="button" onClick={() => setQuery('')} aria-label="Borrar" className="text-white/50 hover:text-white"><X size={13} /></button>
                      )}
                    </div>

                    <div className="mt-2 max-h-[50vh] overflow-y-auto">
                      {query.trim() ? (
                        results.length > 0 ? results.map(r => (
                          <button key={r.id} type="button" onClick={() => go(r.view)}
                            className="flex w-full items-center justify-between gap-2 rounded-[14px] px-3 py-2.5 text-left transition hover:bg-white/5">
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-white">{r.name}</span>
                              <span className="block text-[11px] text-white/50">{r.sector}</span>
                            </span>
                            <span className="shrink-0 text-[12px] font-bold text-[#7B8CFF]">{r.score}%</span>
                          </button>
                        )) : (
                          <p className="px-3 py-4 text-[13px] text-white/50">Sin resultados para "{query}"</p>
                        )
                      ) : (
                        <>
                          <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                            <Zap size={10} /> Quizás te interesen
                          </p>
                          {SUGGESTED.map(r => (
                            <button key={r.id} type="button" onClick={() => go('alliances')}
                              className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left transition hover:bg-white/5">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[10px] font-black text-white"
                                style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)' }}>
                                {r.name.slice(0, 2).toUpperCase()}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-semibold text-white">{r.name}</span>
                                <span className="block text-[11px] text-white/50">{r.sector}</span>
                              </span>
                              <span className="shrink-0 text-[12px] font-bold text-[#7B8CFF]">{r.score}%</span>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {panel === 'menu' && (
                  <div className="p-2">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)' }}>{initials(companyName)}</span>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-bold text-white">{companyName}</p>
                        <p className="flex items-center gap-1.5 text-[11px] text-white/55">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: plan.color }} />
                          Plan {plan.label} · {MOCK_USER.name}
                        </p>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-white/10" />
                    {[
                      { id: 'pricing',  label: 'Planes',        icon: CreditCard, onClick: () => go('pricing') },
                      { id: 'settings', label: 'Configuración', icon: Settings,   onClick: () => go('settings') },
                      { id: 'theme',    label: theme === 'dark' ? 'Tema claro' : 'Tema oscuro', icon: theme === 'dark' ? Sun : Moon, onClick: toggleTheme },
                    ].map(({ id, label, icon: Icon, onClick }) => (
                      <button key={id} type="button" onClick={onClick}
                        className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-[13px] font-medium text-white/85 transition hover:bg-white/5">
                        <Icon size={16} strokeWidth={1.8} className="text-white/55" /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </>
  );
}

export default WebTopNav;
