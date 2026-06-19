import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, BriefcaseBusiness, Building2, CreditCard,
  LayoutDashboard, MessageSquare, PanelsTopLeft,
  Search, Settings, X, Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const mainNav = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'alliances',  label: 'Explorar',   icon: BriefcaseBusiness },
  { id: 'chats',      label: 'Chats',      icon: MessageSquare },
  { id: 'workplace',  label: 'Proyectos', icon: PanelsTopLeft },
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
  const [query, setQuery]       = useState('');
  const [searchFocus, setFocus] = useState(false);

  const results = query.trim().length >= 1
    ? SEARCH_POOL.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.sector.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = searchFocus && query.trim().length >= 1;

  return (
    <aside
      className="flex h-full w-[220px] shrink-0 flex-col py-5"
      style={{
        background: t.sidebarBg,
        borderRight: `1px solid ${t.sidebarBorder}`,
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* ── Logo + company ── */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1871D8 0%, #0A3D7A 100%)' }}
          >
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight" style={{ color: t.text1 }}>Conectados</p>
            <p className="truncate text-[11px] leading-tight mt-0.5" style={{ color: t.text3 }}>{companyName}</p>
          </div>
        </div>

        {/* Plan badge */}
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ background: t.planBg, border: `1px solid ${t.planBorder}` }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: planColor[userPlan] ?? '#3B82F6' }} />
          <span className="text-[11px] font-semibold" style={{ color: t.planText }}>Plan {planLabel[userPlan] ?? userPlan}</span>
        </div>
      </div>

      {/* ── Global search ── */}
      <div className="px-3 mb-4 relative">
        <div
          className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 transition-all"
          style={{
            background: searchFocus ? t.searchFocusBg : t.searchBg,
            border: `1px solid ${searchFocus ? t.searchFocusBorder : t.searchBorder}`,
          }}
        >
          <Search size={13} style={{ color: searchFocus ? t.accent : t.searchIcon, flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            placeholder="Buscar empresas…"
            className="flex-1 bg-transparent text-[12px] outline-none min-w-0"
            style={{ color: t.searchText }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="shrink-0 transition"
              style={{ color: t.text3 }}>
              <X size={11} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              className="absolute left-3 right-3 top-full mt-1.5 z-50 rounded-[14px] overflow-hidden"
              style={{ background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            >
              {results.length > 0 ? results.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { onNavigate(r.view); setQuery(''); setFocus(false); }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition"
                  style={{ ':hover': { background: t.surface } }}
                  onMouseEnter={e => e.currentTarget.style.background = t.surface}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
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

      {/* ── Main nav ── */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 overflow-hidden">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
              style={{ color: isActive ? t.navTextActive : t.navText }}
            >
              {isActive && (
                <motion.div
                  layoutId="web-nav-active"
                  className="absolute inset-0 rounded-[12px]"
                  style={{ background: t.accentActive, border: `1px solid ${t.accentBorder}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.7}
                className="relative z-10 shrink-0"
                style={{ color: isActive ? t.navIconActive : t.navIcon }}
              />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}

        {/* ── Quizás te interesen ── */}
        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${t.sidebarDivider}` }}>
          <div className="flex items-center gap-1.5 px-3 mb-2">
            <Zap size={10} style={{ color: t.accentMid }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.text3 }}>Quizás te interesen</span>
          </div>
          {RECOMMENDATIONS.map(rec => (
            <button
              key={rec.id}
              type="button"
              onClick={() => onNavigate('alliances')}
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left transition"
              onMouseEnter={e => e.currentTarget.style.background = t.surface}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[9px] font-black text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}
              >
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

      {/* ── Bottom nav + theme toggle ── */}
      <div className="flex flex-col gap-0.5 px-3 pt-3" style={{ borderTop: `1px solid ${t.sidebarDivider}` }}>
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
              style={{ color: isActive ? t.navTextActive : t.navText }}
            >
              <Icon
                size={16}
                strokeWidth={1.7}
                className="shrink-0"
                style={{ color: isActive ? t.navIconActive : t.navIcon }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

      </div>
    </aside>
  );
}

export default WebSidebar;
