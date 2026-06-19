import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Bot, BriefcaseBusiness, Building2, CreditCard,
  LayoutDashboard, MessageSquare, PanelsTopLeft,
  Search, Settings, X, Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MOCK_USER = { name: 'Agustín Orellano', role: 'Admin' };

const NOTIFICATIONS = [
  { id: 1, text: 'Nuevo match con Bloom Florería', sub: 'Score 94% · hace 2 min', dot: '#10B981', unread: true },
  { id: 2, text: 'Luna Beauty respondió tu propuesta', sub: 'hace 15 min', dot: '#3B82F6', unread: true },
  { id: 3, text: 'Alliance Room disponible', sub: 'Bloom · hace 1h', dot: '#8B5CF6', unread: false },
];

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'CO';
}

const mainNav = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'alliances',  label: 'Explorar',   icon: BriefcaseBusiness },
  { id: 'chats',      label: 'Chats',      icon: MessageSquare },
  { id: 'workplace',  label: 'Proyectos',  icon: PanelsTopLeft },
  { id: 'assistant',  label: 'Asistente',  icon: Bot },
  { id: 'profile',    label: 'Empresa',    icon: Building2 },
];

const bottomNav = [
  { id: 'pricing',  label: 'Planes',        icon: CreditCard },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const planLabel = { starter: 'Starter', growth: 'Growth', scale: 'Scale' };
const planColor = { starter: '#3B82F6', growth: '#8B5CF6', scale: '#10B981' };

const SEARCH_POOL = [
  { id: 'bloom',   name: 'Bloom Florería',  sector: 'Florería',    score: 94, view: 'alliances' },
  { id: 'luna',    name: 'Luna Beauty',     sector: 'Belleza',     score: 87, view: 'alliances' },
  { id: 'sushi',   name: 'Sushi Nakama',    sector: 'Gastronomía', score: 81, view: 'chats' },
  { id: 'core',    name: 'Core Wellness',   sector: 'Bienestar',   score: 78, view: 'alliances' },
  { id: 'digital', name: 'Digital Craft',   sector: 'Tecnología',  score: 75, view: 'chats' },
  { id: 'cafe',    name: 'Café Patio',      sector: 'Cafetería',   score: 71, view: 'alliances' },
];

const RECOMMENDATIONS = [
  { id: 'verde',  name: 'Verde Market',  sector: 'Retail',     score: 91 },
  { id: 'aether', name: 'Aether Studio', sector: 'Diseño',     score: 86 },
  { id: 'nomad',  name: 'Nomad Co.',     sector: 'Tecnología', score: 82 },
];

function WebSidebar({ activeView, onNavigate, userPlan, companyName }) {
  const { t } = useTheme();
  const [expanded, setExpanded]   = useState(false);
  const [query, setQuery]         = useState('');
  const [searchFocus, setFocus]   = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds]     = useState(new Set());

  const unreadCount    = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;
  const markAllRead    = () => setReadIds(new Set(NOTIFICATIONS.map(n => n.id)));
  const companyInitials = getInitials(companyName);
  const userInitials    = getInitials(MOCK_USER.name);

  const results = query.trim().length >= 1
    ? SEARCH_POOL.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.sector.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const showDropdown = searchFocus && query.trim().length >= 1;

  const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 };

  return (
    <motion.aside
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => { setExpanded(false); setNotifOpen(false); }}
      animate={{ width: expanded ? 232 : 64 }}
      transition={spring}
      className="relative z-40 m-3 flex shrink-0 flex-col overflow-hidden self-start"
      style={{
        background: t.sidebarBg,
        border: `1px solid ${t.sidebarBorder}`,
        borderRadius: 24,
        boxShadow: expanded
          ? '0 8px 40px rgba(24,113,216,0.18), 0 2px 12px rgba(0,0,0,0.22)'
          : '0 4px 20px rgba(0,0,0,0.18)',
        transition: 'box-shadow 0.3s ease, background 0.3s ease',
      }}
    >
      {/* ── COLLAPSED VIEW (icons only) ── */}
      <motion.div
        animate={{ opacity: expanded ? 0 : 1 }}
        transition={{ duration: 0.12 }}
        className="absolute inset-0 flex flex-col items-center py-4 gap-1"
        style={{ pointerEvents: expanded ? 'none' : 'auto' }}
      >
        {/* Company avatar */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[11px] font-bold text-white mb-3"
          style={{ background: 'linear-gradient(135deg, #1871D8 0%, #0A3D7A 100%)' }}
        >
          {companyInitials}
        </div>

        {/* Nav icons */}
        {mainNav.map(item => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="relative flex h-9 w-9 items-center justify-center rounded-[10px] transition-all"
              style={{ background: isActive ? t.accentActive : 'transparent' }}
              title={item.label}
            >
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.7}
                style={{ color: isActive ? t.navIconActive : t.navIcon }} />
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-1 w-8 shrink-0 rounded-full" style={{ height: 1, background: t.sidebarDivider }} />

        {/* Bell */}
        <div className="relative">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-[10px]">
            <Bell size={16} strokeWidth={1.7} style={{ color: t.navIcon }} />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: '#EF4444' }}>
              {unreadCount}
            </span>
          )}
        </div>

        {/* Bottom icons */}
        {bottomNav.map(item => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button key={item.id} type="button" onClick={() => onNavigate(item.id)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-all"
              style={{ background: isActive ? t.accentActive : 'transparent' }}
              title={item.label}>
              <Icon size={16} strokeWidth={1.7} style={{ color: isActive ? t.navIconActive : t.navIcon }} />
            </button>
          );
        })}
      </motion.div>

      {/* ── EXPANDED VIEW (full content) ── */}
      <motion.div
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.15, delay: expanded ? 0.08 : 0 }}
        className="flex flex-col h-full py-4 min-w-[232px]"
        style={{ pointerEvents: expanded ? 'auto' : 'none' }}
      >
        {/* Header */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #1871D8 0%, #0A3D7A 100%)' }}>
              {companyInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold leading-tight" style={{ color: t.text1 }}>{companyName}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: planColor[userPlan] ?? '#3B82F6' }} />
                <span className="text-[10px] font-semibold" style={{ color: t.text3 }}>Plan {planLabel[userPlan] ?? userPlan}</span>
              </div>
            </div>
            {/* Bell */}
            <div className="relative shrink-0">
              <button type="button"
                onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markAllRead(); }}
                className="relative flex h-8 w-8 items-center justify-center rounded-[10px] transition-all"
                style={{ background: notifOpen ? t.accentActive : 'transparent' }}>
                <Bell size={15} strokeWidth={1.8} style={{ color: t.navIcon }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: '#EF4444' }}>{unreadCount}</span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 z-50 w-[220px] rounded-[16px] overflow-hidden"
                    style={{ background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
                    <div className="px-3 py-2.5 flex items-center justify-between"
                      style={{ borderBottom: `1px solid ${t.surfaceBorder}` }}>
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: t.text3 }}>Notificaciones</span>
                      <button type="button" onClick={() => setNotifOpen(false)} style={{ color: t.text3 }}><X size={12} /></button>
                    </div>
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className="flex items-start gap-2.5 px-3 py-2.5 transition"
                        style={{ background: (!n.unread || readIds.has(n.id)) ? 'transparent' : t.accentActive }}
                        onMouseEnter={e => e.currentTarget.style.background = t.surface}
                        onMouseLeave={e => e.currentTarget.style.background = (!n.unread || readIds.has(n.id)) ? 'transparent' : t.accentActive}>
                        <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: n.dot }} />
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium leading-snug" style={{ color: t.text1 }}>{n.text}</p>
                          <p className="mt-0.5 text-[10px]" style={{ color: t.text3 }}>{n.sub}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User row */}
          <div className="flex items-center gap-2 rounded-[12px] px-2.5 py-2" style={{ background: t.surface }}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)' }}>
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold leading-tight" style={{ color: t.text1 }}>{MOCK_USER.name}</p>
              <p className="text-[10px]" style={{ color: t.text3 }}>{MOCK_USER.role}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 mb-4 relative">
          <div className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 transition-all"
            style={{
              background: searchFocus ? t.searchFocusBg : t.searchBg,
              border: `1px solid ${searchFocus ? t.searchFocusBorder : t.searchBorder}`,
            }}>
            <Search size={13} style={{ color: searchFocus ? t.accent : t.searchIcon, flexShrink: 0 }} />
            <input type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 150)}
              placeholder="Buscar empresas…"
              className="flex-1 bg-transparent text-[12px] outline-none min-w-0"
              style={{ color: t.searchText }} />
            {query && (
              <button type="button" onClick={() => setQuery('')} style={{ color: t.text3 }}><X size={11} /></button>
            )}
          </div>
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
                className="absolute left-3 right-3 top-full mt-1.5 z-50 rounded-[14px] overflow-hidden"
                style={{ background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                {results.length > 0 ? results.map(r => (
                  <button key={r.id} type="button"
                    onClick={() => { onNavigate(r.view); setQuery(''); setFocus(false); }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition"
                    onMouseEnter={e => e.currentTarget.style.background = t.surface}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold truncate" style={{ color: t.text1 }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color: t.text3 }}>{r.sector}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold" style={{ color: t.accentMid }}>{r.score}%</span>
                  </button>
                )) : (
                  <div className="px-3 py-3 text-[12px]" style={{ color: t.text3 }}>Sin resultados para "{query}"</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 overflow-hidden">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeView;
            return (
              <button key={item.id} type="button" onClick={() => onNavigate(item.id)}
                className="relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
                style={{ color: isActive ? t.navTextActive : t.navText }}>
                {isActive && (
                  <motion.div layoutId="web-nav-active" className="absolute inset-0 rounded-[12px]"
                    style={{ background: t.accentActive, border: `1px solid ${t.accentBorder}` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} className="relative z-10 shrink-0"
                  style={{ color: isActive ? t.navIconActive : t.navIcon }} />
                <span className="relative z-10 whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}

          {/* Quizás te interesen */}
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${t.sidebarDivider}` }}>
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Zap size={10} style={{ color: t.accentMid }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: t.text3 }}>Quizás te interesen</span>
            </div>
            {RECOMMENDATIONS.map(rec => (
              <button key={rec.id} type="button" onClick={() => onNavigate('alliances')}
                className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left transition"
                onMouseEnter={e => e.currentTarget.style.background = t.surface}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[9px] font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
                  {rec.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold" style={{ color: t.text2 }}>{rec.name}</p>
                  <p className="text-[9px]" style={{ color: t.text3 }}>{rec.sector}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold" style={{ color: t.accentMid }}>{rec.score}%</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom nav */}
        <div className="flex flex-col gap-0.5 px-3 pt-3" style={{ borderTop: `1px solid ${t.sidebarDivider}` }}>
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeView;
            return (
              <button key={item.id} type="button" onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
                style={{ color: isActive ? t.navTextActive : t.navText }}>
                <Icon size={16} strokeWidth={1.7} className="shrink-0"
                  style={{ color: isActive ? t.navIconActive : t.navIcon }} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.aside>
  );
}

export default WebSidebar;
