import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, BriefcaseBusiness, Building2, CreditCard,
  LayoutDashboard, MessageSquare, PanelsTopLeft,
  Search, Settings, Zap, X,
} from 'lucide-react';

const mainNav = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'alliances',  label: 'Match',      icon: BriefcaseBusiness },
  { id: 'chats',      label: 'Chats',      icon: MessageSquare },
  { id: 'workplace',  label: 'Workplace',  icon: PanelsTopLeft },
  { id: 'assistant',  label: 'Asistente',  icon: Bot },
  { id: 'profile',    label: 'Empresa',    icon: Building2 },
];

const bottomNav = [
  { id: 'pricing',  label: 'Planes',        icon: CreditCard },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const planLabel = { starter: 'Starter', growth: 'Growth', scale: 'Scale' };
const planColor = { starter: '#3B82F6', growth: '#8B5CF6', scale: '#10B981' };

/* Quick search results pool */
const SEARCH_POOL = [
  { id: 'bloom',   name: 'Bloom Florería',  sector: 'Florería',    score: 94, view: 'alliances' },
  { id: 'luna',    name: 'Luna Beauty',     sector: 'Belleza',     score: 87, view: 'alliances' },
  { id: 'sushi',   name: 'Sushi Nakama',    sector: 'Gastronomía', score: 81, view: 'chats' },
  { id: 'core',    name: 'Core Wellness',   sector: 'Bienestar',   score: 78, view: 'alliances' },
  { id: 'digital', name: 'Digital Craft',   sector: 'Tecnología',  score: 75, view: 'chats' },
  { id: 'cafe',    name: 'Café Patio',      sector: 'Cafetería',   score: 71, view: 'alliances' },
];

/* Sidebar recommendations (top matches not yet connected) */
const RECOMMENDATIONS = [
  { id: 'verde',  name: 'Verde Market',  sector: 'Retail',     score: 91 },
  { id: 'aether', name: 'Aether Studio', sector: 'Diseño',     score: 86 },
  { id: 'nomad',  name: 'Nomad Co.',     sector: 'Tecnología', score: 82 },
];

function WebSidebar({ activeView, onNavigate, userPlan, companyName }) {
  const [query, setQuery]         = useState('');
  const [searchFocus, setFocus]   = useState(false);

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
        background: 'linear-gradient(180deg, rgba(8,14,28,0.98) 0%, rgba(6,10,22,0.98) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
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
            <p className="truncate text-sm font-semibold text-white leading-tight">Conectados</p>
            <p className="truncate text-[11px] text-white/40 leading-tight mt-0.5">{companyName}</p>
          </div>
        </div>

        {/* Plan badge */}
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: planColor[userPlan] ?? '#3B82F6' }} />
          <span className="text-[11px] font-semibold text-white/55">Plan {planLabel[userPlan] ?? userPlan}</span>
        </div>
      </div>

      {/* ── Global search ── */}
      <div className="px-3 mb-4 relative">
        <div
          className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 transition-all"
          style={{
            background: searchFocus ? 'rgba(24,113,216,0.12)' : 'rgba(255,255,255,0.06)',
            border: searchFocus ? '1px solid rgba(24,113,216,0.35)' : '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <Search size={13} style={{ color: searchFocus ? '#4A9FFF' : 'rgba(255,255,255,0.30)', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            placeholder="Buscar empresas…"
            className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/25 min-w-0"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="shrink-0 text-white/25 hover:text-white/50 transition">
              <X size={11} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              className="absolute left-3 right-3 top-full mt-1.5 z-50 rounded-[14px] overflow-hidden"
              style={{ background: 'rgba(14,22,44,0.98)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            >
              {results.length > 0 ? results.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { onNavigate(r.view); setQuery(''); setFocus(false); }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-white/85 truncate">{r.name}</p>
                    <p className="text-[10px] text-white/35">{r.sector}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold" style={{ color: '#4A9FFF' }}>{r.score}%</span>
                </button>
              )) : (
                <div className="px-3 py-3 text-[12px] text-white/30">Sin resultados para "{query}"</div>
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
              style={isActive ? { background: 'rgba(24,113,216,0.18)', color: '#fff' } : { color: 'rgba(255,255,255,0.45)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="web-nav-active"
                  className="absolute inset-0 rounded-[12px]"
                  style={{ background: 'rgba(24,113,216,0.15)', border: '1px solid rgba(24,113,216,0.30)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.7}
                className="relative z-10 shrink-0"
                style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.35)' }}
              />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}

        {/* ── Quizás te interesen ── */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 px-3 mb-2">
            <Zap size={10} style={{ color: '#4A9FFF' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Quizás te interesen</span>
          </div>
          {RECOMMENDATIONS.map(rec => (
            <button
              key={rec.id}
              type="button"
              onClick={() => onNavigate('alliances')}
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left transition hover:bg-white/[0.05]"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[9px] font-black text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}
              >
                {rec.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-white/65">{rec.name}</p>
                <p className="text-[9px] text-white/30">{rec.sector}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold" style={{ color: '#4A9FFF' }}>{rec.score}%</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Bottom nav ── */}
      <div className="flex flex-col gap-0.5 px-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
              style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.40)' }}
            >
              <Icon
                size={16}
                strokeWidth={1.7}
                className="shrink-0"
                style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.30)' }}
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
