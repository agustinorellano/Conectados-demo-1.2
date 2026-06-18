import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Bot, BriefcaseBusiness, Check, ChevronDown,
  Globe, LayoutDashboard, MessageSquare, PanelsTopLeft,
  Sparkles, TrendingUp, Users, Video, Zap, Star, Menu, X
} from 'lucide-react';
import HeroSection from './components/HeroSection';

/* ─── palette ──────────────────────────────────────────────── */
const C = {
  bg:      '#070C18',
  bgMid:   '#0A0F1E',
  bgCard:  '#0F1828',
  blue:    '#1871D8',
  blueLight:'#4A9FFF',
  green:   '#10B981',
  border:  'rgba(255,255,255,0.07)',
  text:    'rgba(255,255,255,0.55)',
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
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
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

/* ─── hero mockup ──────────────────────────────────────────── */
function HeroMockup() {
  return (
    <div className="relative w-full max-w-[600px] mx-auto select-none">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 blur-[80px] opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #1871D8 0%, transparent 70%)' }} />

      {/* Main screen */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[20px]"
        style={{
          background: 'linear-gradient(160deg, #0D1526 0%, #0A0F1E 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5">
            {['#FF5F57','#FFBD2E','#28CA41'].map(c => (
              <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-full px-3 py-1"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-white/40">conectados.app</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[160px_1fr] gap-0">
          {/* Sidebar */}
          <div className="border-r border-white/[0.05] p-3 space-y-1">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: false },
              { icon: BriefcaseBusiness, label: 'Match', active: true },
              { icon: MessageSquare, label: 'Mensajes', active: false },
              { icon: PanelsTopLeft, label: 'Workplace', active: false },
              { icon: Bot, label: 'Asistente', active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label}
                className="flex items-center gap-2 rounded-[8px] px-2.5 py-2"
                style={{ background: active ? 'rgba(24,113,216,0.18)' : 'transparent' }}>
                <Icon size={13} style={{ color: active ? '#60A5FA' : 'rgba(255,255,255,0.30)' }} strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-[11px] font-medium" style={{ color: active ? 'white' : 'rgba(255,255,255,0.35)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Match view preview */}
          <div className="p-4 space-y-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">Match del día</p>
            {[
              { name: 'Bloom Florería', sector: 'Florería · CABA', score: 94, color: '#10B981' },
              { name: 'Luna Beauty', sector: 'Belleza · Palermo', score: 87, color: '#8B5CF6' },
              { name: 'Sushi Nakama', sector: 'Gastronomía · Recoleta', score: 81, color: '#3B82F6' },
            ].map((c, i) => (
              <motion.div key={c.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3 rounded-[12px] px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${c.color}80, ${c.color}40)` }}>
                  {c.name.slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white/85 truncate">{c.name}</p>
                  <p className="text-[9px] text-white/35">{c.sector}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full" style={{ background: c.color }} />
                  <span className="text-[10px] font-bold" style={{ color: c.color }}>{c.score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating metric — top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', damping: 20 }}
        className="absolute -right-4 top-8 rounded-[14px] px-3.5 py-2.5"
        style={{
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.25)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={13} className="text-emerald-400" />
          <div>
            <p className="text-[10px] font-bold text-emerald-400">+34% matches</p>
            <p className="text-[9px] text-white/35">este mes</p>
          </div>
        </div>
      </motion.div>

      {/* Floating match badge — bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.1, type: 'spring', damping: 20 }}
        className="absolute -left-4 bottom-10 rounded-[14px] px-3.5 py-2.5"
        style={{
          background: 'rgba(24,113,216,0.14)',
          border: '1px solid rgba(24,113,216,0.28)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-blue-400" />
          <div>
            <p className="text-[10px] font-bold text-blue-300">Nuevo match</p>
            <p className="text-[9px] text-white/35">Bloom Florería · 94%</p>
          </div>
        </div>
      </motion.div>

      {/* Floating alliance badge — bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: 'spring', damping: 20 }}
        className="absolute -right-2 -bottom-4 rounded-[14px] px-3.5 py-2.5"
        style={{
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.25)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <Check size={13} className="text-violet-400" />
          <div>
            <p className="text-[10px] font-bold text-violet-300">Alianza cerrada</p>
            <p className="text-[9px] text-white/35">$85.000 generados</p>
          </div>
        </div>
      </motion.div>
    </div>
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
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,12,24,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
            C
          </div>
          <span className="font-['Space_Grotesk'] text-[15px] font-bold text-white">Conectados</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {['Producto', 'Cómo funciona', 'Precios', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              className="text-[13px] font-medium text-white/50 transition hover:text-white">
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a href="/web" className="text-[13px] font-medium text-white/55 transition hover:text-white">
            Iniciar sesión
          </a>
          <a href="/web"
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}>
            Empezar gratis
          </a>
        </div>

        {/* Mobile menu button */}
        <button type="button" className="md:hidden text-white/60" onClick={() => setMenuOpen(v => !v)}>
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
              {['Producto', 'Cómo funciona', 'Precios', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
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
            <div className="h-6 w-6 rounded-md text-[9px] font-bold text-white flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              {name.slice(0,2).toUpperCase()}
            </div>
            <span className="text-[13px] font-semibold text-white/35 whitespace-nowrap">{name}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: `linear-gradient(to right, ${C.bg}, transparent)` }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: `linear-gradient(to left, ${C.bg}, transparent)` }} />
    </div>
  );
}

/* ─── feature section ──────────────────────────────────────── */
function FeatureSection({ label, labelColor, title, description, side = 'left', children, id, bg }) {
  const light = !!bg
  return (
    <section id={id} className="py-24 px-6" style={bg ? { background: bg } : {}}>
      <div className={`mx-auto max-w-6xl flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20 ${side === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <FadeUp className="flex-1 space-y-6">
          <Label color={labelColor}>{label}</Label>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold leading-tight lg:text-4xl" style={{ color: light ? '#0F172A' : '#fff' }}>
            {title}
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: light ? '#64748B' : C.text }}>{description}</p>
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
    { name: 'Bloom Florería', sector: 'Florería · CABA', score: 94, tags: ['Co-marketing', 'Eventos', 'Visibilidad'], color: '#10B981' },
    { name: 'Luna Beauty', sector: 'Belleza · Palermo', score: 87, tags: ['Cross-selling', 'Redes sociales'], color: '#8B5CF6' },
  ];
  const card = cards[active];

  return (
    <div className="overflow-hidden rounded-[24px]"
      style={{ background: 'linear-gradient(160deg, #0D1526 0%, #0A0F1E 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
      <div className="p-5 space-y-4">
        {/* Score badge */}
        <div className="flex items-center justify-between">
          <Label color={card.color}>Match {card.score}%</Label>
          <div className="flex gap-1.5">
            {cards.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} type="button"
                className="h-1.5 rounded-full transition-all"
                style={{ width: i === active ? 20 : 6, background: i === active ? card.color : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>

        {/* Company card */}
        <div className="rounded-[18px] p-4 space-y-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[14px] flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${card.color}80, ${card.color}30)` }}>
              {card.name.slice(0,2)}
            </div>
            <div>
              <p className="text-[15px] font-bold text-white">{card.name}</p>
              <p className="text-[12px]" style={{ color: C.text }}>{card.sector}</p>
            </div>
          </div>

          {/* Score bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] text-white/35">Compatibilidad</span>
              <span className="text-[11px] font-bold" style={{ color: card.color }}>{card.score}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <motion.div key={active} className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}80)` }}
                initial={{ width: 0 }}
                animate={{ width: `${card.score}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {card.tags.map(tag => (
              <span key={tag} className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={{ background: `${card.color}14`, color: card.color, border: `1px solid ${card.color}28` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setActive(v => (v + 1) % cards.length)}
            className="rounded-[14px] py-3 text-[13px] font-semibold text-white/60 transition hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
            Siguiente
          </button>
          <button type="button"
            className="rounded-[14px] py-3 text-[13px] font-bold text-white transition"
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.30)' }}>
            Conectar →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── alliance room mockup ─────────────────────────────────── */
function AllianceRoomMockup() {
  return (
    <div className="overflow-hidden rounded-[24px]"
      style={{ background: 'linear-gradient(160deg, #0D1526 0%, #0A0F1E 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Label color="#8B5CF6"><Video size={11} /> Alliance Room</Label>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-white/40">En vivo</span>
          </div>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Top White', role: 'Anfitrión', color: '#141E30' },
            { name: 'Bloom Florería', role: 'Invitado', color: '#10B981' },
          ].map(p => (
            <div key={p.name} className="rounded-[14px] p-3 space-y-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="h-10 w-full rounded-[10px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}80)` }}>
                <span className="text-white font-bold text-[11px]">{p.name.slice(0,2).toUpperCase()}</span>
              </div>
              <p className="text-[10px] font-semibold text-white/70">{p.name}</p>
              <p className="text-[9px]" style={{ color: C.text }}>{p.role}</p>
            </div>
          ))}
        </div>

        {/* AI Notes */}
        <div className="rounded-[14px] p-3"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[10px] font-semibold text-violet-300">IA tomando notas</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: C.text }}>
            "Acordaron campaña primavera con split 60/40. Próximo paso: presentación de branding el lunes."
          </p>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            {['3 acuerdos', '2 tareas', 'Score 91'].map(t => (
              <span key={t} className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-violet-300"
                style={{ background: 'rgba(139,92,246,0.14)' }}>{t}</span>
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
    { label: 'Backlog', color: 'rgba(255,255,255,0.10)', items: ['Sorteo RRSS', 'Newsletter B2B'] },
    { label: 'En ejecución', color: '#3B82F6', items: ['Campaña bundle'] },
    { label: 'Revisión', color: '#F59E0B', items: ['Pop-up Dot', 'Pack wellness'] },
    { label: 'Cerrado ✓', color: '#10B981', items: ['Día del libro'] },
  ];

  return (
    <div className="overflow-hidden rounded-[24px]"
      style={{ background: 'linear-gradient(160deg, #0D1526 0%, #0A0F1E 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Label color="#F59E0B"><PanelsTopLeft size={11} /> Workplace</Label>
          <span className="text-[10px]" style={{ color: C.text }}>6 alianzas activas</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {cols.map(col => (
            <div key={col.label} className="space-y-1.5">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: col.color }} />
                <span className="text-[9px] font-semibold text-white/40 truncate">{col.label}</span>
              </div>
              {col.items.map(item => (
                <div key={item} className="rounded-[8px] px-2 py-2 text-[9px] font-medium text-white/70"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Revenue row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.06]">
          {[
            { label: 'Pipeline', value: '$382k', color: '#3B82F6' },
            { label: 'Revenue', value: '$124k', color: '#10B981' },
            { label: 'Alianzas', value: '6', color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <p className="font-['Space_Grotesk'] text-[14px] font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: C.text }}>{m.label}</p>
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
    <div className="overflow-hidden rounded-[24px]"
      style={{ background: 'linear-gradient(160deg, #0D1526 0%, #0A0F1E 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
      <div className="p-5 space-y-3">
        <Label color="#4A9FFF"><Bot size={11} /> Asistente IA</Label>
        <div className="space-y-3 max-h-[220px] overflow-hidden">
          {messages.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-[11px] leading-relaxed ${
                m.role === 'user'
                  ? 'text-white'
                  : m.isAction
                    ? 'text-violet-200'
                    : 'text-white/75'
              }`}
                style={{
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #1871D8, #1459B0)'
                    : m.isAction
                      ? 'rgba(139,92,246,0.12)'
                      : 'rgba(255,255,255,0.06)',
                  border: m.isAction ? '1px solid rgba(139,92,246,0.22)' : 'none',
                }}>
                {m.isAction && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={10} className="text-violet-400" />
                    <span className="text-[9px] font-semibold text-violet-400">Oportunidad detectada</span>
                  </div>
                )}
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <input className="flex-1 bg-transparent text-[11px] text-white/50 outline-none" placeholder="Preguntá algo..." readOnly />
          <ArrowRight size={13} className="text-white/30" />
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
    <section id="faq" className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <FadeUp className="mb-16 text-center space-y-4">
          <Label>FAQ</Label>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-4xl">
            Preguntas frecuentes
          </h2>
        </FadeUp>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="overflow-hidden rounded-[18px]"
                style={{ background: 'rgba(15,24,40,0.8)', border: `1px solid ${open === i ? 'rgba(24,113,216,0.30)' : 'rgba(255,255,255,0.07)'}` }}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[14px] font-semibold text-white/85">{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <ChevronDown size={16} className="shrink-0 text-white/40" />
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
    <div className="min-h-screen" style={{ background: C.bg, color: 'white' }}>
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
      <section className="border-y py-10 px-6" style={{ borderColor: C.border, background: 'rgba(255,255,255,0.015)' }}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: C.text }}>
            Empresas que ya están conectadas
          </p>
          <LogosCarousel />
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────── */}
      <section id="cómo-funciona" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label>Cómo funciona</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-4xl">
              Tres pasos para tu próxima alianza
            </h2>
            <p className="mx-auto max-w-xl text-[15px]" style={{ color: C.text }}>
              Desde crear tu perfil hasta cerrar acuerdos, todo el proceso ocurre dentro de Conectados.
            </p>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01', icon: Users, color: '#3B82F6',
                title: 'Creá tu perfil de marca',
                desc: 'Contás quién sos, qué ofrecés y qué buscás en un aliado. Subís tu imagen, industria, audiencia y capacidades de activación.',
              },
              {
                step: '02', icon: Zap, color: '#1871D8',
                title: 'Hacé match con aliados compatibles',
                desc: 'El algoritmo analiza decenas de variables y te muestra las empresas con mayor compatibilidad real. Swipeás, guardás y conectás.',
              },
              {
                step: '03', icon: TrendingUp, color: '#10B981',
                title: 'Gestioná y cerrá alianzas',
                desc: 'Desde la negociación en el Alliance Room hasta el seguimiento en el Workplace. Todo el ciclo de vida de tu alianza en un lugar.',
              },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.1}>
                <div className="relative h-full rounded-[24px] p-6 space-y-4"
                  style={{ background: 'rgba(15,24,40,0.8)', border: `1px solid ${C.border}` }}>
                  <div className="absolute -top-3 left-6">
                    <span className="font-['Space_Grotesk'] text-[11px] font-bold"
                      style={{ color: item.color }}>{item.step}</span>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                    style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
                    <item.icon size={20} style={{ color: item.color }} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-[17px] font-bold text-white">{item.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: C.text }}>{item.desc}</p>
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
        bg="#EEF2FF"
        title="El algoritmo que entiende tu negocio"
        description="No es un simple filtro. Analizamos industria, audiencia, lo que ofrecés, lo que buscás, ubicación y más de 20 variables para calcular un score de compatibilidad real. Solo ves empresas que pueden generar valor mutuo."
      >
        <img
          src="/match-mockup.png"
          alt="Match inteligente"
          style={{ width: '100%', maxWidth: 560, display: 'block' }}
        />
      </FeatureSection>

      {/* ── ALLIANCE ROOM ────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2 lg:items-center lg:flex-row-reverse">
          <FadeUp delay={0.1}>
            <AllianceRoomMockup />
          </FadeUp>
          <FadeUp className="space-y-6">
            <Label color="#8B5CF6"><Video size={11} /> Alliance Room</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold leading-tight text-white lg:text-4xl">
              Tu sala de negociación colaborativa
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: C.text }}>
              Reuníte con tus aliados en tiempo real. Nuestra IA toma notas automáticamente, detecta acuerdos, genera tareas y crea un resumen ejecutivo al finalizar. Nunca más perdés lo que acordaron.
            </p>
            <ul className="space-y-3">
              {['Notas automáticas por IA', 'Detección de acuerdos y compromisos', 'Tareas generadas desde la reunión', 'Score de momentum de la alianza'].map(f => (
                <li key={f} className="flex items-center gap-3 text-[13px]" style={{ color: C.text }}>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                    <Check size={11} className="text-violet-400" strokeWidth={2.5} />
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

      {/* ── ASISTENTE IA ─────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <FadeUp delay={0.1}>
            <AIMockup />
          </FadeUp>
          <FadeUp className="space-y-6">
            <Label color={C.blueLight}><Bot size={11} /> Asistente IA</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold leading-tight text-white lg:text-4xl">
              Tu estratega de alianzas siempre disponible
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: C.text }}>
              El asistente analiza tu actividad, detecta oportunidades, sugiere el próximo aliado ideal y te ayuda a redactar propuestas. Es como tener un director de alianzas disponible 24/7.
            </p>
            <ul className="space-y-3">
              {['Sugerencias de aliados basadas en tu perfil', 'Detección automática de oportunidades', 'Redacción de propuestas personalizadas', 'Alertas de seguimiento inteligentes'].map(f => (
                <li key={f} className="flex items-center gap-3 text-[13px]" style={{ color: C.text }}>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <Check size={11} className="text-blue-400" strokeWidth={2.5} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ── MÉTRICAS ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label>Resultados reales</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-4xl">
              Números que hablan por sí solos
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { value: 500, suffix: '+', label: 'Empresas activas', color: '#3B82F6', icon: Users },
              { value: 2400, suffix: '+', label: 'Matches realizados', color: '#1871D8', icon: Zap },
              { value: 890, suffix: '+', label: 'Alianzas cerradas', color: '#8B5CF6', icon: BriefcaseBusiness },
              { value: 1200000, prefix: '$', suffix: '+', label: 'Valor generado', color: '#10B981', icon: TrendingUp },
            ].map((m, i) => (
              <FadeUp key={m.label} delay={i * 0.08}>
                <div className="rounded-[24px] p-6 text-center space-y-3"
                  style={{ background: 'rgba(15,24,40,0.8)', border: `1px solid ${C.border}` }}>
                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px]"
                      style={{ background: `${m.color}14` }}>
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
      <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label>Casos de éxito</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-4xl">
              Lo que dicen nuestros usuarios
            </h2>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="h-full rounded-[24px] p-6 space-y-4"
                  style={{ background: 'rgba(15,24,40,0.8)', border: `1px solid ${C.border}` }}>
                  <div className="flex gap-1">
                    {Array.from({ length: t.score }).map((_, j) => (
                      <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: C.text }}>"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)' }}>
                      {t.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{t.name}</p>
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
      <section id="precios" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-16 text-center space-y-4">
            <Label>Precios</Label>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-4xl">
              Empezá gratis, crecé cuando quieras
            </h2>
            <p className="text-[15px]" style={{ color: C.text }}>Sin tarjeta de crédito. Sin compromisos.</p>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.1}>
                <div className={`relative h-full rounded-[24px] p-6 space-y-6 ${plan.featured ? 'ring-2' : ''}`}
                  style={{
                    background: plan.featured ? `linear-gradient(160deg, ${plan.color}18, rgba(15,24,40,0.95))` : 'rgba(15,24,40,0.8)',
                    border: plan.featured ? `1px solid ${plan.color}40` : `1px solid ${C.border}`,
                    ringColor: plan.featured ? plan.color : 'transparent',
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
                      <span className="font-['Space_Grotesk'] text-4xl font-bold text-white">{plan.price}</span>
                      <span className="pb-1 text-[12px]" style={{ color: C.text }}>{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-[13px]" style={{ color: C.text }}>
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${plan.color}20` }}>
                          <Check size={10} style={{ color: plan.color }} strokeWidth={2.8} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href="/web"
                    className="block w-full rounded-full py-3 text-center text-[13px] font-bold transition hover:-translate-y-0.5"
                    style={plan.featured
                      ? { background: `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`, color: 'white', boxShadow: `0 6px 24px ${plan.color}40` }
                      : { border: `1px solid ${C.border}`, color: 'rgba(255,255,255,0.65)' }}>
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
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <div className="relative overflow-hidden rounded-[32px] px-8 py-16 space-y-8"
              style={{
                background: 'linear-gradient(160deg, rgba(24,113,216,0.15) 0%, rgba(139,92,246,0.10) 100%)',
                border: '1px solid rgba(24,113,216,0.20)',
                boxShadow: '0 0 80px rgba(24,113,216,0.12)',
              }}>
              {/* Glow */}
              <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full blur-[80px] opacity-30"
                style={{ background: '#1871D8' }} />

              <div className="space-y-4">
                <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white lg:text-5xl leading-tight">
                  Tu próxima alianza ya está esperando.
                </h2>
                <p className="text-[15px]" style={{ color: C.text }}>
                  Más de 500 empresas ya están generando acuerdos en Conectados. Sumate gratis hoy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a href="/web"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 10px 40px rgba(24,113,216,0.45)' }}>
                  Empezar gratis
                  <ArrowRight size={16} />
                </a>
                <a href="#cómo-funciona"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white/60 transition hover:text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.14)' }}>
                  Ver cómo funciona
                </a>
              </div>

              <p className="text-[12px]" style={{ color: C.text }}>
                Sin tarjeta de crédito · Gratis para siempre en plan Starter
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: C.border }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>C</div>
                <span className="font-['Space_Grotesk'] text-[15px] font-bold text-white">Conectados</span>
              </div>
              <p className="text-[13px] leading-relaxed max-w-xs" style={{ color: C.text }}>
                La plataforma de matching comercial para empresas, marcas y emprendedores.
              </p>
            </div>
            {[
              { title: 'Producto', links: ['Match', 'Alliance Room', 'Workplace', 'Asistente IA'] },
              { title: 'Empresa', links: ['Sobre nosotros', 'Blog', 'Prensa', 'Contacto'] },
              { title: 'Legal', links: ['Privacidad', 'Términos', 'Cookies'] },
            ].map(col => (
              <div key={col.title} className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.text }}>{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[13px] transition hover:text-white" style={{ color: C.text }}>{link}</a>
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
