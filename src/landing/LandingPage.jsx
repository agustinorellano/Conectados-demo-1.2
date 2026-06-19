import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Bot, BriefcaseBusiness, Check, ChevronDown,
  Eye, Globe, LayoutDashboard, Link2, MessageSquare, PanelsTopLeft,
  Sparkles, Tag, TrendingUp, Users, Video, Zap, Star, Menu, X
} from 'lucide-react';
import HeroSection from './components/HeroSection';

/* ─── palette ──────────────────────────────────────────────── */
const C = {
  bg:       '#EEF2FF',
  bgMid:    '#F8FAFF',
  bgCard:   '#FFFFFF',
  blue:     '#2563EB',
  blueLight:'#3B82F6',
  green:    '#10B981',
  border:   '#E2E8F4',
  text:     '#64748B',
  heading:  '#0F172A',
};

/* ─── animated counter ─────────────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) raw.set(to);
  }, [inView, to, raw]);

  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── fade-in section wrapper ──────────────────────────────── */
function FadeUp({ children, delay = 0, className = '', style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── section label ────────────────────────────────────────── */
function Label({ children, color = C.blueLight }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
      style={{ color, background: `${color}14`, border: `1px solid ${color}28` }}
    >
      {children}
    </span>
  );
}

/* ─── navbar ───────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-4 pointer-events-none">
      <motion.header
        className="pointer-events-auto w-full max-w-5xl transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(7,12,24,0.92)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          border: scrolled ? '1px solid rgba(255,255,255,0.10)' : `1px solid ${C.border}`,
          borderRadius: 999,
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.35)'
            : '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
      <div className="flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
            C
          </div>
          <span className="font-['Space_Grotesk'] text-[15px] font-bold" style={{ color: scrolled ? '#fff' : C.heading }}>Conectados</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {['Producto', 'Cómo funciona', 'El circuito', 'Precios', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-').replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')}`}
              className="text-[13px] font-medium transition"
              style={{ color: scrolled ? 'rgba(255,255,255,0.55)' : C.text }}
              onMouseEnter={e => e.currentTarget.style.color = scrolled ? '#fff' : C.heading}
              onMouseLeave={e => e.currentTarget.style.color = scrolled ? 'rgba(255,255,255,0.55)' : C.text}>
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a href="/web" className="text-[13px] font-medium transition" style={{ color: scrolled ? 'rgba(255,255,255,0.55)' : C.text }}>
            Iniciar sesión
          </a>
          <a href="/web"
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}>
            Empezar gratis
          </a>
        </div>

        {/* Mobile menu button */}
        <button type="button" className="md:hidden transition" style={{ color: scrolled ? 'rgba(255,255,255,0.6)' : C.text }} onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
            style={{ background: 'rgba(7,12,24,0.97)' }}
          >
            <div className="space-y-1 px-6 py-4">
              {['Producto', 'Cómo funciona', 'El circuito', 'Precios', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-').replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-[14px] font-medium text-white/60 transition hover:text-white">
                  {item}
                </a>
              ))}
              <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                <a href="/web" className="block text-center py-2.5 text-[14px] font-medium text-white/55">Iniciar sesión</a>
                <a href="/web" className="block text-center rounded-full py-3 text-[14px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)' }}>
                  Empezar gratis
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.header>
    </div>
  );
}

/* ─── logos carousel ───────────────────────────────────────── */
const LOGOS = [
  'Bloom Florería', 'Sushi Nakama', 'Luna Beauty', 'Core Wellness',
  'Digital Craft', 'Café Patio', 'Top White', 'Aether Studio',
  'Verde Market', 'Nomad Co.', 'Kinetic Lab', 'Pulse Agency',
];

function LogosCarousel() {
  return (
    <div className="relative overflow-hidden py-2">
      <div className="flex gap-8 animate-[scroll_28s_linear_infinite]"
        style={{ width: 'max-content' }}>
        {[...LOGOS, ...LOGOS].map((name, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0">
            <div className="h-6 w-6 rounded-md text-[9px] font-bold flex items-center justify-center"
              style={{ background: '#E2E8F4', color: C.text }}>
              {name.slice(0,2).toUpperCase()}
            </div>
            <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: '#94A3B8' }}>{name}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: `linear-gradient(to right, ${C.bgMid}, transparent)` }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: `linear-gradient(to left, ${C.bgMid}, transparent)` }} />
    </div>
  );
}

/* ─── feature section ──────────────────────────────────────── */
function FeatureSection({ label, labelColor, title, description, side = 'left', children, id, bg }) {
  return (
    <section id={id} className="py-24 px-6" style={{ background: bg || C.bgMid }}>
      <div className={`mx-auto max-w-6xl flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20 ${side === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <FadeUp className="flex-1 space-y-6">
          <Label color={labelColor}>{label}</Label>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold leading-tight lg:text-4xl" style={{ color: C.heading }}>
            {title}
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: C.text }}>{description}</p>
        </FadeUp>
        <FadeUp delay={0.1} className="flex-1">
          {children}
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── match mockup card ────────────────────────────────────── */
function MatchMockup() {
  const [active, setActive] = useState(0);
  const cards = [
    {
      name: 'Alma Indumentaria', type: 'Indumentaria', location: 'Rosario, Santa Fe', followers: '5.1k',
      score: 92, color: '#2563EB',
      tags: [
        { label: 'Co-marketing', icon: <Users size={12} strokeWidth={2} /> },
        { label: 'Descuentos', icon: <Tag size={12} strokeWidth={2} /> },
        { label: 'Visibilidad', icon: <Eye size={12} strokeWidth={2} /> },
      ],
      logo: (
        <svg width="88" height="60" viewBox="0 0 88 60" fill="none">
          <text x="2" y="36" fontFamily="Inter, system-ui, sans-serif" fontSize="28" fontWeight="300" letterSpacing="-0.5" fill="#1E2A3A">alma</text>
          <text x="2" y="52" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.8" fill="#1E2A3A" opacity="0.55">Indumentaria</text>
        </svg>
      ),
    },
    {
      name: 'Verde Luz', type: 'Tienda de plantas', location: 'Palermo, CABA', followers: '2.8k',
      score: 87, color: '#10B981',
      tags: [
        { label: 'Co-marketing', icon: <Users size={12} strokeWidth={2} /> },
        { label: 'Descuentos', icon: <Tag size={12} strokeWidth={2} /> },
        { label: 'Visibilidad', icon: <Eye size={12} strokeWidth={2} /> },
      ],
      logo: (
        <svg width="88" height="60" viewBox="0 0 88 60" fill="none">
          <text x="2" y="36" fontFamily="Inter, system-ui, sans-serif" fontSize="28" fontWeight="300" letterSpacing="-0.5" fill="#1E2A3A">verde</text>
          <text x="2" y="52" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.8" fill="#1E2A3A" opacity="0.55">Tienda de plantas</text>
        </svg>
      ),
    },
  ];
  const card = cards[active];

  return (
    <div className="overflow-hidden rounded-[28px]"
      style={{ background: '#fff', border: '1px solid #E2E8F4', boxShadow: '0 8px 48px rgba(37,99,235,0.10)' }}>
      <div className="p-6 space-y-4">

        {/* Score badge + counter */}
        <div className="flex items-center justify-between">
          <Label color={card.color}>Match {card.score}%</Label>
          <span className="text-[11px] font-semibold" style={{ color: C.text }}>{active + 1} de {cards.length}</span>
        </div>

        {/* Company card — like img 2 */}
        <div className="rounded-[18px] p-4 space-y-3" style={{ background: '#F8FAFF', border: '1px solid #E2E8F4' }}>

          {/* Logo + info side by side */}
          <div className="flex items-center gap-4">
            {card.logo}
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-bold leading-tight" style={{ color: C.heading }}>{card.name}</p>
              <p className="text-[12px] mt-0.5" style={{ color: C.text }}>{card.type}</p>
              <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: C.text }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.63 3.5 6.5 3.5 6.5s3.5-3.87 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="#94A3B8"/></svg>
                {card.location} · {card.followers} seguidores
              </p>
            </div>
          </div>

          {/* Score bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium" style={{ color: C.text }}>Compatibilidad</span>
              <span className="text-[12px] font-bold" style={{ color: card.color }}>{card.score}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: '#E2E8F4' }}>
              <motion.div key={active} className="h-full rounded-full"
                style={{ background: card.color }}
                initial={{ width: 0 }}
                animate={{ width: `${card.score}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {card.tags.map(t => (
              <span key={t.label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                style={{ background: '#F0F4FF', color: card.color, border: '1px solid #E2E8F4' }}>
                <span style={{ color: card.color, opacity: 0.8 }}>{t.icon}</span>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setActive(v => (v + 1) % cards.length)}
            className="rounded-[14px] py-3 text-[13px] font-semibold transition hover:bg-slate-50"
            style={{ border: '1px solid #E2E8F4', color: C.text }}>
            Pasar
          </button>
          <button type="button"
            className="rounded-[14px] py-3 text-[13px] font-bold text-white transition"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 4px 16px rgba(37,99,235,0.30)' }}>
            Conectar →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── alliance room mockup ─────────────────────────────────── */
function AllianceRoomMockup() {
  const companies = [
    {
      name: 'Top White',
      type: 'Indumentaria · CABA',
      role: 'Anfitrión',
      score: 91,
      logo: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="12" fill="#EEF2FF"/>
          {/* Abstract T shape — minimal wordmark style */}
          <rect x="11" y="13" width="22" height="3.5" rx="1.75" fill="#2563EB"/>
          <rect x="19.25" y="16.5" width="5.5" height="15" rx="2" fill="#2563EB"/>
        </svg>
      ),
    },
    {
      name: 'Bloom Florería',
      type: 'Florería · Palermo',
      role: 'Invitado',
      score: 91,
      logo: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="12" fill="#F0FDF4"/>
          {/* Flower icon — 4 petals + center */}
          <ellipse cx="22" cy="16" rx="3" ry="5" fill="#10B981" opacity="0.85"/>
          <ellipse cx="22" cy="28" rx="3" ry="5" fill="#10B981" opacity="0.85"/>
          <ellipse cx="16" cy="22" rx="5" ry="3" fill="#10B981" opacity="0.85"/>
          <ellipse cx="28" cy="22" rx="5" ry="3" fill="#10B981" opacity="0.85"/>
          <circle cx="22" cy="22" r="4" fill="#059669"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-[28px]"
      style={{ background: '#fff', border: '1px solid #E2E8F4', boxShadow: '0 8px 48px rgba(37,99,235,0.10)' }}>
      <div className="p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Label color="#7C3AED"><Video size={11} /> Alliance Room</Label>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-medium" style={{ color: C.text }}>En vivo</span>
          </div>
        </div>

        {/* Company cards */}
        <div className="grid grid-cols-2 gap-3">
          {companies.map(p => (
            <div key={p.name} className="rounded-[18px] p-4 space-y-3"
              style={{ background: '#F8FAFF', border: '1px solid #E2E8F4' }}>
              {/* Logo */}
              <div>{p.logo}</div>
              {/* Info */}
              <div>
                <p className="text-[13px] font-bold leading-tight" style={{ color: C.heading }}>{p.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: C.text }}>{p.type}</p>
              </div>
              {/* Role badge */}
              <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold"
                style={{ background: p.role === 'Anfitrión' ? '#EEF2FF' : '#F0FDF4', color: p.role === 'Anfitrión' ? '#2563EB' : '#059669' }}>
                {p.role}
              </span>
            </div>
          ))}
        </div>

        {/* AI Notes */}
        <div className="rounded-[14px] p-3" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} style={{ color: '#7C3AED' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#7C3AED' }}>IA tomando notas</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: '#6D28D9' }}>
            "Acordaron campaña primavera con split 60/40. Próximo paso: presentación de branding el lunes."
          </p>
          <div className="mt-2.5 flex gap-1.5 flex-wrap">
            {['3 acuerdos', '2 tareas', 'Score 91'].map(t => (
              <span key={t} className="rounded-full px-2.5 py-1 text-[9px] font-semibold"
                style={{ background: '#EDE9FE', color: '#7C3AED' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── workplace mockup ─────────────────────────────────────── */
function WorkplaceMockup() {
  const cols = [
    { label: 'Backlog', dot: '#94A3B8', items: ['Sorteo RRSS', 'Newsletter B2B'] },
    { label: 'Ejecución', dot: '#3B82F6', items: ['Campaña bundle'] },
    { label: 'Revisión', dot: '#F59E0B', items: ['Pop-up Dot', 'Pack wellness'] },
    { label: 'Cerrado ✓', dot: '#10B981', items: ['Día del libro'] },
  ];

  return (
    <div className="overflow-hidden rounded-[28px]"
      style={{ background: '#fff', border: '1px solid #E2E8F4', boxShadow: '0 8px 48px rgba(37,99,235,0.10)' }}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] flex items-center justify-center" style={{ background: '#EEF2FF' }}>
              <PanelsTopLeft size={18} style={{ color: '#2563EB' }} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wider" style={{ color: C.heading }}>Workplace</p>
              <p className="text-[10px]" style={{ color: C.text }}>Gestión de alianzas</p>
            </div>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: '#EEF2FF', color: '#2563EB' }}>6 alianzas activas</span>
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-4 gap-2">
          {cols.map(col => (
            <div key={col.label} className="space-y-1.5">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: col.dot }} />
                <span className="text-[9px] font-semibold uppercase tracking-wide truncate" style={{ color: C.text }}>{col.label}</span>
              </div>
              {col.items.map(item => (
                <div key={item} className="rounded-[10px] px-2.5 py-2 text-[9px] font-medium"
                  style={{ background: '#F8FAFF', border: '1px solid #E2E8F4', color: C.heading }}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Revenue row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: C.border }}>
          {[
            { label: 'Pipeline', value: '$382k', trend: '↑ 18%', color: '#2563EB' },
            { label: 'Revenue', value: '$124k', trend: '↑ 12%', color: '#10B981' },
            { label: 'Alianzas', value: '6', trend: 'Activas', color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="rounded-[10px] p-2 text-center" style={{ background: '#F8FAFF' }}>
              <p className="font-['Space_Grotesk'] text-[15px] font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[8px] font-semibold mt-0.5" style={{ color: m.color }}>{m.trend}</p>
              <p className="text-[8px] mt-0.5" style={{ color: C.text }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AI mockup ────────────────────────────────────────────── */
function AIMockup() {
  const messages = [
    { role: 'user', text: '¿Con qué empresa debería hacer alianza este mes?' },
    { role: 'ai', text: 'Basado en tu perfil y actividad reciente, Bloom Florería tiene una compatibilidad del 94%. Su audiencia complementa perfectamente la tuya y están en época de alta demanda.' },
    { role: 'ai', text: 'También detecté una oportunidad con Core Wellness para una campaña wellness + moda de alto valor estimado en $85.000.', isAction: true },
  ];

  return (
    <div className="overflow-hidden rounded-[28px]"
      style={{ background: '#fff', border: '1px solid #E2E8F4', boxShadow: '0 8px 48px rgba(37,99,235,0.10)' }}>
      <div className="p-6 space-y-3">
        <Label color="#2563EB"><Bot size={11} /> Asistente IA</Label>
        <div className="space-y-3 max-h-[220px] overflow-hidden">
          {messages.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-[11px] leading-relaxed`}
                style={{
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                    : m.isAction
                      ? '#F5F3FF'
                      : '#F8FAFF',
                  color: m.role === 'user'
                    ? '#fff'
                    : m.isAction ? '#6D28D9' : C.text,
                  border: m.isAction ? '1px solid #DDD6FE' : m.role === 'user' ? 'none' : '1px solid #E2E8F4',
                }}>
                {m.isAction && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={10} style={{ color: '#7C3AED' }} />
                    <span className="text-[9px] font-semibold" style={{ color: '#7C3AED' }}>Oportunidad detectada</span>
                  </div>
                )}
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
          style={{ background: '#F8FAFF', border: '1px solid #E2E8F4' }}>
          <input className="flex-1 bg-transparent text-[11px] outline-none" style={{ color: C.text }} placeholder="Preguntá algo..." readOnly />
          <ArrowRight size={13} style={{ color: C.border }} />
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────── */
const FAQS = [
  { q: '¿Qué tipo de empresas pueden usar Conectados?', a: 'Conectados está diseñado para cualquier negocio que quiera crecer a través de alianzas: dueños de PYMES, emprendedores, directores comerciales, jefes de alianzas y representantes de marca en cualquier industria.' },
  { q: '¿Cómo funciona el sistema de matching?', a: 'Nuestro algoritmo analiza tu perfil de empresa, industria, audiencia, lo que ofrecés y lo que buscás para calcular un score de compatibilidad con cada empresa de la plataforma. Solo te mostramos matches relevantes.' },
  { q: '¿Puedo probar Conectados gratis?', a: 'Sí. El plan Starter es gratuito e incluye hasta 10 matches diarios, acceso al chat y al Workplace. Para funciones avanzadas como IA y Alliance Room podés upgradar en cualquier momento.' },
  { q: '¿Qué es el Alliance Room?', a: 'Es un espacio de negociación colaborativa en tiempo real. Podés reunirte con tus aliados, y nuestra IA toma notas automáticamente, detecta acuerdos y genera tareas a partir de la reunión.' },
  { q: '¿Mis datos están seguros?', a: 'Sí. Toda la información de tu empresa es confidencial y solo visible para vos y las empresas con las que elegís conectar. No compartimos datos con terceros.' },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-24 px-6" style={{ background: C.bg }}>
      <div className="mx-auto max-w-3xl">
        <FadeUp className="mb-16 text-center space-y-4">
          <Label color={C.blue}>FAQ</Label>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold lg:text-4xl" style={{ color: C.heading }}>
            Preguntas frecuentes
          </h2>
        </FadeUp>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="overflow-hidden rounded-[18px]"
                style={{ background: '#fff', border: `1px solid ${open === i ? `${C.blue}40` : C.border}`, boxShadow: '0 2px 12px rgba(37,99,235,0.05)' }}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[14px] font-semibold" style={{ color: C.heading }}>{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <ChevronDown size={16} className="shrink-0" style={{ color: C.text }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}>
                      <p className="px-5 pb-5 text-[13px] leading-relaxed" style={{ color: C.text }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── testimonials ─────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Valentina Cruz', role: 'Directora comercial · Luna Beauty', text: 'En menos de 2 semanas encontramos 3 alianzas estratégicas que nunca hubiéramos logrado por cuenta propia. El sistema de matching es increíblemente preciso.', score: 5 },
  { name: 'Marcos Linares', role: 'CEO · Core Wellness', text: 'El Alliance Room cambió la forma en que negociamos. Tenemos las notas, los acuerdos y las tareas automatizadas. Ahorramos horas de trabajo por reunión.', score: 5 },
  { name: 'Sofía Reyes', role: 'Jefa de alianzas · Digital Craft', text: 'El Workplace nos permite ver el pipeline completo de alianzas en un solo lugar. Antes lo manejábamos en planillas. Ahora es todo en tiempo real.', score: 5 },
];

/* ─── simplified pricing ───────────────────────────────────── */
const PLANS = [
  {
    name: 'Starter', price: 'Gratis', period: 'para siempre',
    color: '#3B82F6', featured: false,
    features: ['10 matches diarios', 'Chat con aliados', 'Workplace básico', 'Perfil de empresa', 'Soporte por email'],
  },
  {
    name: 'Growth', price: '$49', period: 'USD / mes',
    color: '#8B5CF6', featured: true,
    features: ['Matches ilimitados', 'Alliance Room', 'Asistente IA', '1 Boost mensual', 'Analítica avanzada', 'Soporte prioritario'],
  },
  {
    name: 'Scale', price: '$129', period: 'USD / mes',
    color: '#10B981', featured: false,
    features: ['Todo en Growth', 'Outreach directo', 'API access', 'Multi-empresa', 'Account manager', 'SLA garantizado'],
  },
];

/* ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.heading }}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
      `}</style>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── LOGOS ────────────────────────────────────────── */}
      <section className="border-y py-10 px-6" style={{ borderColor: C.border, background: C.bgMid }}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: C.text }}>
            Empresas que ya están conectadas
          </p>
          <LogosCarousel />
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────── */}
      <section id="cómo-funciona" className="py-24 px-6" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, #2563EB)' }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: '#2563EB' }}>Cómo funciona</span>
              <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, #2563EB)' }} />
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold lg:text-4xl" style={{ color: '#0F172A' }}>
              Tres pasos para tu próxima alianza
            </h2>
            <p className="mx-auto max-w-xl text-[15px]" style={{ color: '#64748B' }}>
              Desde crear tu perfil hasta cerrar acuerdos, todo el proceso ocurre dentro de Conectados.
            </p>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01', icon: Users, color: '#2563EB',
                title: 'Creá tu perfil de marca',
                desc: 'Contás quién sos, qué ofrecés y qué buscás en un aliado. Subís tu imagen, industria, audiencia y capacidades de activación.',
              },
              {
                step: '02', icon: Zap, color: '#2563EB',
                title: 'Hacé match con aliados compatibles',
                desc: 'El algoritmo analiza decenas de variables y te muestra las empresas con mayor compatibilidad real. Swipeás, guardás y conectás.',
              },
              {
                step: '03', icon: TrendingUp, color: '#2563EB',
                title: 'Gestioná y cerrá alianzas',
                desc: 'Desde la negociación en el Alliance Room hasta el seguimiento en el Workplace. Todo el ciclo de vida de tu alianza en un lugar.',
              },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.1}>
                <div className="relative h-full rounded-[24px] p-8 space-y-6"
                  style={{ background: '#fff', border: '1px solid #E8EFFE', boxShadow: '0 4px 24px rgba(37,99,235,0.06)' }}>
                  {/* Step number */}
                  <span className="font-['Space_Grotesk'] text-[13px] font-bold" style={{ color: '#2563EB' }}>{item.step}</span>

                  {/* Icon circle */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: '#EFF6FF' }}>
                    <item.icon size={28} style={{ color: '#2563EB' }} strokeWidth={1.6} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-['Space_Grotesk'] text-[18px] font-bold" style={{ color: '#0F172A' }}>{item.title}</h3>
                    <p className="text-[14px] leading-relaxed" style={{ color: '#64748B' }}>{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATCH INTELIGENTE ────────────────────────────── */}
      <FeatureSection
        id="match-inteligente"
        label="Match Inteligente"
        labelColor="#3B82F6"
        side="left"
        title="El algoritmo que entiende tu negocio"
        description="No es un simple filtro. Analizamos industria, audiencia, lo que ofrecés, lo que buscás, ubicación y más de 20 variables para calcular un score de compatibilidad real. Solo ves empresas que pueden generar valor mutuo."
      >
        <MatchMockup />
      </FeatureSection>

      {/* ── ALLIANCE ROOM ────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.bgMid }}>
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <FadeUp delay={0.1}>
            <AllianceRoomMockup />
          </FadeUp>
          <FadeUp className="space-y-6">
            <Label color="#7C3AED"><Video size={11} /> Alliance Room</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold leading-tight lg:text-4xl" style={{ color: C.heading }}>
              Tu sala de negociación colaborativa
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: C.text }}>
              Reuníte con tus aliados en tiempo real. Nuestra IA toma notas automáticamente, detecta acuerdos, genera tareas y crea un resumen ejecutivo al finalizar. Nunca más perdés lo que acordaron.
            </p>
            <ul className="space-y-3">
              {['Notas automáticas por IA', 'Detección de acuerdos y compromisos', 'Tareas generadas desde la reunión', 'Score de momentum de la alianza'].map(f => (
                <li key={f} className="flex items-center gap-3 text-[13px]" style={{ color: C.text }}>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: '#F5F3FF' }}>
                    <Check size={11} style={{ color: '#7C3AED' }} strokeWidth={2.5} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ── WORKPLACE ────────────────────────────────────── */}
      <FeatureSection
        id="workplace"
        label="Workplace"
        labelColor="#F59E0B"
        side="left"
        title="El pipeline de tus alianzas comerciales"
        description="Gestioná todas tus oportunidades, tareas y acuerdos en un kanban diseñado para alianzas B2B. Visualizá el valor de tu pipeline, el estado de cada colaboración y el revenue generado en tiempo real."
      >
        <WorkplaceMockup />
      </FeatureSection>

      {/* ── CIRCUITO ─────────────────────────────────────── */}
      <section id="el-circuito" style={{ background: C.bg, padding: '112px 24px 128px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <FadeUp style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, rgba(74,159,255,0.5))' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2563EB' }}>El circuito</span>
              <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, rgba(74,159,255,0.5))' }} />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: C.heading, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
              De un match a un negocio,<br />todo en Conectados
            </h2>
            <p style={{ fontSize: 16, color: C.text, maxWidth: 480, margin: '0 auto' }}>
              Cada alianza recorre el mismo camino. Una plataforma que acompaña cada etapa del proceso.
            </p>
          </FadeUp>

          {/* 5 cards grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" style={{ position: 'relative' }}>

            {/* Connector line — only visible on 5-col layout */}
            <div className="hidden lg:block" style={{
              position: 'absolute',
              top: 64, left: 'calc(10% + 8px)', right: 'calc(10% + 8px)',
              height: 2,
              background: 'linear-gradient(to right, rgba(24,113,216,0.2) 0%, #1871D8 30%, #1871D8 70%, #4A9FFF 100%)',
              zIndex: 0,
            }} />

            {[
              {
                num: '01', label: 'Alianza', desc: 'Encontrás empresas afines mediante match inteligente y scoring de compatibilidad.',
                icon: <Link2 size={24} color="#4A9FFF" strokeWidth={2} />,
                accent: '#1871D8',
                visual: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[['CafePro', '#2563EB'], ['NutriApp', '#0891B2'], ['FitBrand', '#7C3AED']].map(([name, clr]) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: clr, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                          {name[0]}
                        </div>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{name}</span>
                        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                num: '02', label: 'Chat', desc: 'Primera conversación directa entre las dos empresas. Sin intermediarios.',
                icon: <MessageSquare size={24} color="#4A9FFF" strokeWidth={2} />,
                accent: '#0891B2',
                visual: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ background: 'rgba(24,113,216,0.15)', border: '1px solid rgba(24,113,216,0.25)', borderRadius: '12px 12px 12px 4px', padding: '7px 10px', fontSize: 10, color: 'rgba(255,255,255,0.8)', maxWidth: '80%' }}>
                      Hola! Vi tu perfil y creo que podemos hacer algo juntos 👋
                    </div>
                    <div style={{ alignSelf: 'flex-end', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px 12px 4px 12px', padding: '7px 10px', fontSize: 10, color: 'rgba(255,255,255,0.8)', maxWidth: '80%' }}>
                      Me interesa. ¿Cuándo hablamos?
                    </div>
                    <div style={{ background: 'rgba(24,113,216,0.15)', border: '1px solid rgba(24,113,216,0.25)', borderRadius: '12px 12px 12px 4px', padding: '7px 10px', fontSize: 10, color: 'rgba(255,255,255,0.8)', maxWidth: '70%' }}>
                      Mañana a las 10 AM 🎯
                    </div>
                  </div>
                ),
              },
              {
                num: '03', label: 'Workplace', desc: 'Espacio compartido con tareas, acuerdos y seguimiento de la alianza.',
                icon: <PanelsTopLeft size={24} color="#4A9FFF" strokeWidth={2} />,
                accent: '#F59E0B',
                visual: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {[
                      { text: 'Definir propuesta de valor', done: true, color: '#10B981' },
                      { text: 'Alinear canales de distribución', done: true, color: '#10B981' },
                      { text: 'Validar con área legal', done: false, color: '#F59E0B' },
                      { text: 'Activar primera campaña', done: false, color: '#6B7280' },
                    ].map(t => (
                      <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${t.color}`, background: t.done ? t.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {t.done && <Check size={8} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: 9.5, color: t.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                num: '04', label: 'Proyecto', desc: 'Activación conjunta. Campaña en marcha con métricas compartidas.',
                icon: <Zap size={24} color="#4A9FFF" strokeWidth={2} />,
                accent: '#8B5CF6',
                visual: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      {[40, 60, 45, 80, 70, 95].map((h, i) => (
                        <div key={i} style={{ width: 12, height: h * 0.7, borderRadius: 4, background: i === 5 ? '#4A9FFF' : 'rgba(74,159,255,0.25)' }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Sem 1</span>
                      <span style={{ fontSize: 9, color: '#4A9FFF', fontWeight: 700 }}>+58% reach</span>
                    </div>
                  </div>
                ),
              },
              {
                num: '05', label: 'Negocio', desc: 'Revenue medible, clientes nuevos y KPIs compartidos entre aliados.',
                icon: <TrendingUp size={24} color="#fff" strokeWidth={2} />,
                accent: '#1871D8',
                highlight: true,
                visual: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>+$48K</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 8px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>340</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Clientes nuevos</div>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 8px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80' }}>92%</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Retención</div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((step, i) => (
              <FadeUp key={step.label} delay={i * 0.08} style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  borderRadius: 20,
                  background: step.highlight
                    ? 'linear-gradient(145deg, #0E2F6E, #0A1F4E)'
                    : 'linear-gradient(145deg, #0F172A, #0D1526)',
                  border: step.highlight
                    ? '1px solid rgba(74,159,255,0.4)'
                    : '1px solid rgba(255,255,255,0.08)',
                  padding: '24px 20px 20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: step.highlight
                    ? '0 8px 40px rgba(24,113,216,0.3)'
                    : '0 4px 24px rgba(0,0,0,0.18)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>

                  {/* Subtle top glow */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: step.highlight ? 'rgba(74,159,255,0.4)' : 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                  {step.highlight && (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ position: 'absolute', inset: -2, borderRadius: 22, border: '1.5px solid rgba(74,159,255,0.4)', pointerEvents: 'none' }}
                    />
                  )}

                  {/* Number + Icon row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em',
                    }}>
                      {step.num}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Visual mockup area */}
                  <div style={{
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 12,
                    padding: '12px 10px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    {step.visual}
                  </div>

                  {/* Label + desc */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASISTENTE IA ─────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.bg }}>
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <FadeUp delay={0.1}>
            <AIMockup />
          </FadeUp>
          <FadeUp className="space-y-6">
            <Label color={C.blue}><Bot size={11} /> Asistente IA</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold leading-tight lg:text-4xl" style={{ color: C.heading }}>
              Tu estratega de alianzas siempre disponible
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: C.text }}>
              El asistente analiza tu actividad, detecta oportunidades, sugiere el próximo aliado ideal y te ayuda a redactar propuestas. Es como tener un director de alianzas disponible 24/7.
            </p>
            <ul className="space-y-3">
              {['Sugerencias de aliados basadas en tu perfil', 'Detección automática de oportunidades', 'Redacción de propuestas personalizadas', 'Alertas de seguimiento inteligentes'].map(f => (
                <li key={f} className="flex items-center gap-3 text-[13px]" style={{ color: C.text }}>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: '#EEF2FF' }}>
                    <Check size={11} style={{ color: C.blue }} strokeWidth={2.5} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ── MÉTRICAS ─────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.bgMid }}>
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label color={C.blue}>Resultados reales</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold lg:text-4xl" style={{ color: C.heading }}>
              Números que hablan por sí solos
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { value: 500, suffix: '+', label: 'Empresas activas', color: '#2563EB', icon: Users },
              { value: 2400, suffix: '+', label: 'Matches realizados', color: '#0891B2', icon: Zap },
              { value: 890, suffix: '+', label: 'Alianzas cerradas', color: '#7C3AED', icon: BriefcaseBusiness },
              { value: 1200000, prefix: '$', suffix: '+', label: 'Valor generado', color: '#059669', icon: TrendingUp },
            ].map((m, i) => (
              <FadeUp key={m.label} delay={i * 0.08}>
                <div className="rounded-[24px] p-6 text-center space-y-3"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(37,99,235,0.06)' }}>
                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px]"
                      style={{ background: `${m.color}12` }}>
                      <m.icon size={18} style={{ color: m.color }} strokeWidth={1.8} />
                    </div>
                  </div>
                  <p className="font-['Space_Grotesk'] text-3xl font-bold lg:text-4xl" style={{ color: m.color }}>
                    <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p className="text-[12px]" style={{ color: C.text }}>{m.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALES ────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.bg }}>
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label color={C.blue}>Casos de éxito</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold lg:text-4xl" style={{ color: C.heading }}>
              Lo que dicen nuestros usuarios
            </h2>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="h-full rounded-[24px] p-6 space-y-4"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(37,99,235,0.06)' }}>
                  <div className="flex gap-1">
                    {Array.from({ length: t.score }).map((_, j) => (
                      <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: C.text }}>"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: C.border }}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                      {t.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: C.heading }}>{t.name}</p>
                      <p className="text-[11px]" style={{ color: C.text }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ──────────────────────────────────────── */}
      <section id="precios" className="py-24 px-6" style={{ background: C.bgMid }}>
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label color={C.blue}>Precios</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold lg:text-4xl" style={{ color: C.heading }}>
              Empezá gratis, crecé cuando quieras
            </h2>
            <p className="text-[15px]" style={{ color: C.text }}>Sin tarjeta de crédito. Sin compromisos.</p>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.1}>
                <div className="relative h-full rounded-[24px] p-6 space-y-6"
                  style={{
                    background: plan.featured ? `linear-gradient(160deg, ${plan.color}10, #fff)` : '#fff',
                    border: plan.featured ? `1.5px solid ${plan.color}50` : `1px solid ${C.border}`,
                    boxShadow: plan.featured ? `0 8px 40px ${plan.color}20` : '0 2px 16px rgba(37,99,235,0.06)',
                  }}>
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full px-3 py-1 text-[10px] font-bold text-white"
                        style={{ background: plan.color }}>Más popular</span>
                    </div>
                  )}

                  <div>
                    <Label color={plan.color}>{plan.name}</Label>
                    <div className="mt-4 flex items-end gap-1.5">
                      <span className="font-['Space_Grotesk'] text-4xl font-bold" style={{ color: C.heading }}>{plan.price}</span>
                      <span className="pb-1 text-[12px]" style={{ color: C.text }}>{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-[13px]" style={{ color: C.text }}>
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${plan.color}15` }}>
                          <Check size={10} style={{ color: plan.color }} strokeWidth={2.8} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href="/web"
                    className="block w-full rounded-full py-3 text-center text-[13px] font-bold transition hover:-translate-y-0.5"
                    style={plan.featured
                      ? { background: `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`, color: 'white', boxShadow: `0 6px 24px ${plan.color}30` }
                      : { border: `1.5px solid ${C.border}`, color: C.text }}>
                    {plan.name === 'Starter' ? 'Empezar gratis' : `Elegir ${plan.name}`}
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FAQ />

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.bgMid }}>
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <div className="relative overflow-hidden rounded-[32px] px-8 py-16 space-y-8"
              style={{
                background: 'linear-gradient(145deg, #0F172A, #0D1526)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
              }}>
              <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full blur-[80px] opacity-20"
                style={{ background: '#2563EB' }} />

              <div className="space-y-4">
                <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-5xl leading-tight">
                  Tu próxima alianza ya está esperando.
                </h2>
                <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Más de 500 empresas ya están generando acuerdos en Conectados. Sumate gratis hoy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a href="/web"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 10px 40px rgba(37,99,235,0.45)' }}>
                  Empezar gratis
                  <ArrowRight size={16} />
                </a>
                <a href="#cómo-funciona"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold transition"
                  style={{ border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.6)' }}>
                  Ver cómo funciona
                </a>
              </div>

              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Sin tarjeta de crédito · Gratis para siempre en plan Starter
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: C.border, background: C.bgMid }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>C</div>
                <span className="font-['Space_Grotesk'] text-[15px] font-bold" style={{ color: C.heading }}>Conectados</span>
              </div>
              <p className="text-[13px] leading-relaxed max-w-xs" style={{ color: C.text }}>
                La plataforma de matching comercial para empresas, marcas y emprendedores.
              </p>
            </div>
            {[
              { title: 'Producto', links: ['Match', 'Alliance Room', 'Workplace', 'Asistente IA'] },
              { title: 'Legal', links: ['Privacidad', 'Términos', 'Cookies'] },
            ].map(col => (
              <div key={col.title} className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.heading }}>{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[13px] transition hover:text-blue-600" style={{ color: C.text }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: C.border }}>
            <p className="text-[12px]" style={{ color: C.text }}>© 2026 Conectados. Todos los derechos reservados.</p>
            <div className="flex items-center gap-1.5">
              <Globe size={12} style={{ color: C.text }} />
              <span className="text-[12px]" style={{ color: C.text }}>Argentina · Latinoamérica</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
