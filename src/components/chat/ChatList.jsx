import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive, Bot, Check, Copy, Link, Mail,
  Phone, Plus, Search, TrendingUp, Users, Video, X, Zap,
} from 'lucide-react';
import ChatItem from './ChatItem';

/* ── Avatar gradient ─────────────────────────────────────────────── */
const GRAD = [
  ['#6D28D9','#8B5CF6'], ['#1D4ED8','#3B82F6'],
  ['#047857','#10B981'], ['#BE185D','#EC4899'],
  ['#0E7490','#06B6D4'], ['#4338CA','#6366F1'],
];
function grad(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const [a, b] = GRAD[Math.abs(h) % GRAD.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/* ── Business segments (replacing messaging filters) ─────────────── */
const SEGMENTS = [
  { key: 'activos',    label: 'Conversaciones' },
  { key: 'pendientes', label: 'Oportunidades'  },
  { key: 'favoritos',  label: 'Destacadas'     },
  { key: 'archivados', label: 'Archivadas'     },
];

function matchesSegment(conv, seg, favorites, archived) {
  const isArch = archived.has(conv.id);
  if (seg === 'archivados') return isArch;
  if (isArch) return false;
  if (seg === 'activos')    return conv.businessState === 'activo'    || conv.activity === 'Activa' || conv.isTeam;
  if (seg === 'pendientes') return conv.businessState === 'pendiente' || conv.activity === 'Seguimiento';
  if (seg === 'favoritos')  return favorites.has(conv.id);
  return true;
}

function matchesSearch(conv, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    conv.company?.toLowerCase().includes(q) ||
    conv.contact?.toLowerCase().includes(q) ||
    conv.sector?.toLowerCase().includes(q)  ||
    (Array.isArray(conv.tags) && conv.tags.some(t => t.toLowerCase().includes(q)))
  );
}

/* ── Relationship state ──────────────────────────────────────────── */
const STATE_CFG = {
  activo:    { color: '#10B981', label: 'Activa'     },
  pendiente: { color: '#F59E0B', label: 'Pendiente'  },
  cerrado:   { color: '#6B7280', label: 'Cerrada'    },
};

/* ── Member status ───────────────────────────────────────────────── */
const MEMBER_STATUS = {
  activo:   { dot: 'bg-emerald-400', label: 'Activo'             },
  invitado: { dot: 'bg-amber-400',   label: 'Invitación enviada' },
  visto:    { dot: 'bg-blue-400',    label: 'Invitación vista'   },
  pendiente:{ dot: 'bg-orange-400',  label: 'Registro iniciado'  },
  vencido:  { dot: 'bg-red-400',     label: 'Vencida'            },
};

/* ──────────────────────────────────────────────────────────────────
   AI NOTICE — minimal single-line banner
─────────────────────────────────────────────────────────────────── */
function AiNotice({ onOpen }) {
  return (
    <button type="button" onClick={onOpen}
      className="mx-4 mb-3 flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition hover:brightness-110 w-auto"
      style={{ background: 'rgba(74,159,255,0.07)', border: '1px solid rgba(74,159,255,0.14)' }}>
      <Zap className="h-3.5 w-3.5 shrink-0 text-[#4A9FFF]" />
      <p className="flex-1 text-[12px] text-white/50 truncate">Luna Beauty respondió tu propuesta</p>
      <span className="shrink-0 text-[10px] font-bold text-[#4A9FFF]">Ver →</span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────
   TEAM COMPLETION BAR
─────────────────────────────────────────────────────────────────── */
function TeamCompletionBar({ members, onManage }) {
  const active = members.filter(m => m.status === 'activo').length;
  const pct    = members.length > 0 ? Math.round((active / members.length) * 100) : 0;

  return (
    <div className="mx-4 mb-3 cursor-pointer rounded-[16px] p-3.5 transition hover:brightness-110"
      style={{ background: 'rgba(20,30,48,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={onManage} role="button" tabIndex={0}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-[#4A9FFF]" />
          <span className="text-[12px] font-semibold text-white/75">Tu equipo</span>
        </div>
        <span className="text-[10px] text-white/30">{active} de {members.length} activos · {pct}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-1 rounded-full"
          style={{ background: 'linear-gradient(90deg, #1871D8, #4A9FFF)' }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }} />
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {members.slice(0, 5).map(m => (
            <div key={m.id}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2"
              style={{ background: grad(m.name), ringColor: '#0A0F1E' }}>
              {m.initials}
            </div>
          ))}
          {members.length > 5 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white/55 ring-2 ring-[#0A0F1E]">
              +{members.length - 5}
            </div>
          )}
        </div>
        <span className="text-[10px] text-[#4A9FFF]">Gestionar →</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   FAB MENU
─────────────────────────────────────────────────────────────────── */
const FAB_ITEMS = [
  { key: 'chat',   icon: Search,  label: 'Nueva conversación', color: '#3B82F6' },
  { key: 'group',  icon: Users,   label: 'Nuevo grupo',        color: '#10B981' },
  { key: 'team',   icon: Users,   label: 'Crear equipo',       color: '#8B5CF6' },
  { key: 'invite', icon: Mail,    label: 'Invitar integrante', color: '#F59E0B' },
];

function FabMenu({ onAction }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <motion.button type="button" onClick={() => setOpen(p => !p)}
        whileTap={{ scale: 0.88 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.18 }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
        style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.45)' }}>
        <Plus className="h-[18px] w-[18px]" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="absolute right-0 top-11 z-50 w-[210px] overflow-hidden rounded-[20px] py-1.5"
              style={{
                background: 'rgba(12,18,40,0.98)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 20px 56px rgba(0,0,0,0.60)',
              }}>
              {FAB_ITEMS.map(({ key, icon: Icon, label, color }) => (
                <button key={key} type="button" onClick={() => { setOpen(false); onAction(key); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: `${color}20` }}>
                    <Icon className="h-[14px] w-[14px]" style={{ color }} />
                  </div>
                  <span className="text-[13px] font-medium text-white/80">{label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   TEAM MANAGE MODAL
─────────────────────────────────────────────────────────────────── */
function TeamManageModal({ members, onClose, onInvite }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="fixed inset-x-0 bottom-0 z-[70] flex flex-col rounded-t-[24px]"
        style={{ maxHeight: '88dvh', background: '#0F1828', border: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2"><div className="h-1 w-10 rounded-full bg-white/20" /></div>
        <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Equipo Comercial</h2>
            <p className="text-[12px] text-white/35">{members.length} integrantes</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onInvite}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white"
              style={{ background: 'rgba(24,113,216,0.20)', border: '1px solid rgba(24,113,216,0.30)' }}>
              <Plus className="h-3 w-3" /> Invitar
            </button>
            <button type="button" onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <X className="h-4 w-4 text-white/60" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-px px-4 py-3">
            {members.map(m => {
              const sc = MEMBER_STATUS[m.status] || MEMBER_STATUS.invitado;
              return (
                <div key={m.id} className="flex items-center gap-3 rounded-[14px] px-3 py-3.5 transition hover:bg-white/5">
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] font-['Space_Grotesk'] text-[12px] font-bold text-white"
                      style={{ background: grad(m.name) }}>
                      {m.initials}
                    </div>
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#0F1828] ${sc.dot}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-white">{m.name}</p>
                    <p className="text-[11px] text-white/35">{m.role} · {sc.label}</p>
                  </div>
                  {m.status === 'invitado' && (
                    <button type="button" className="text-[11px] font-semibold text-[#4A9FFF]">Reenviar</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   CREATE TEAM MODAL
─────────────────────────────────────────────────────────────────── */
const AREAS = ['Comercial', 'Marketing', 'Ventas', 'Operaciones', 'Tecnología', 'Administración'];

function CreateTeamModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [area, setArea] = useState('');
  const fld = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="fixed inset-x-0 bottom-0 z-[70] rounded-t-[24px]"
        style={{ background: '#0F1828', border: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2"><div className="h-1 w-10 rounded-full bg-white/20" /></div>
        <div className="flex items-center justify-between px-5 pb-4 pt-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Crear Equipo</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (!name.trim()) return; onCreate({ name: name.trim(), description: desc, area }); onClose(); }}
          className="space-y-4 px-5 py-5">
          {[['Nombre del equipo *', name, setName, 'Equipo Comercial'], ['Descripción', desc, setDesc, 'Equipo encargado de alianzas…']].map(([lbl, val, set, ph]) => (
            <div key={lbl}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{lbl}</label>
              {lbl.includes('Descripción')
                ? <textarea value={val} onChange={e => set(e.target.value)} rows={2} placeholder={ph}
                    className="w-full resize-none rounded-[14px] px-4 py-3 text-[14px] outline-none placeholder:text-white/20" style={fld} />
                : <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                    className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none placeholder:text-white/20" style={fld} />
              }
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Área</label>
            <select value={area} onChange={e => setArea(e.target.value)}
              className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none" style={fld}>
              <option value="">Seleccionar área…</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button type="submit"
            className="w-full rounded-[16px] py-3.5 text-[14px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}>
            Crear Equipo
          </button>
        </form>
      </motion.div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   INVITE MODAL
─────────────────────────────────────────────────────────────────── */
const ROLES_OPT = [
  { value: 'admin',       label: 'Administrador' },
  { value: 'manager',     label: 'Manager'       },
  { value: 'colaborador', label: 'Colaborador'   },
  { value: 'readonly',    label: 'Solo lectura'  },
];
const SEND_METHODS = [
  { method: 'email',    Icon: Mail,  label: 'Email',        color: '#3B82F6' },
  { method: 'whatsapp', Icon: Phone, label: 'WhatsApp',     color: '#25D366' },
  { method: 'link',     Icon: Link,  label: 'Compartir',    color: '#8B5CF6' },
  { method: 'copy',     Icon: Copy,  label: 'Copiar enlace',color: '#F59E0B' },
];

function InviteModal({ onClose, onInvited }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', cargo: '', rol: 'colaborador' });
  const [sent, setSent] = useState(false);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const fld = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' };

  const handleSend = (method) => {
    setSent(true);
    window.setTimeout(() => { onInvited?.({ ...form, method, status: 'invitado' }); onClose(); }, 1400);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="fixed inset-x-0 bottom-0 z-[70] flex flex-col rounded-t-[24px]"
        style={{ maxHeight: '92dvh', background: '#0F1828', border: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2"><div className="h-1 w-10 rounded-full bg-white/20" /></div>
        <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Invitar Integrante</h2>
            <p className="text-[12px] text-white/35">Completá los datos para enviar la invitación</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
          <div className="space-y-4 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {[['nombre', 'Nombre *'], ['apellido', 'Apellido *']].map(([k, lbl]) => (
                <div key={k}>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{lbl}</label>
                  <input value={form[k]} onChange={e => upd(k, e.target.value)}
                    className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] outline-none" style={fld} />
                </div>
              ))}
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Email *</label>
              <input type="email" value={form.email} onChange={e => upd('email', e.target.value)}
                placeholder="juan@empresa.com"
                className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-white/20" style={fld} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['telefono', 'Teléfono', '+54 11…'], ['cargo', 'Cargo', 'Ventas']].map(([k, lbl, ph]) => (
                <div key={k}>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{lbl}</label>
                  <input value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={ph}
                    className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-white/20" style={fld} />
                </div>
              ))}
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Rol</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES_OPT.map(r => (
                  <button key={r.value} type="button" onClick={() => upd('rol', r.value)}
                    className={`rounded-[12px] py-2.5 text-[13px] font-semibold transition-all ${
                      form.rol === r.value ? 'bg-[#1871D8] text-white' : 'text-white/50 hover:text-white/70'
                    }`}
                    style={form.rol !== r.value ? fld : {}}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 rounded-[16px] py-3.5"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)' }}>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-[13px] font-semibold text-emerald-400">Invitación enviada</span>
              </motion.div>
            ) : (
              <motion.div key="methods">
                <p className="mb-2.5 text-center text-[11px] text-white/25">Enviar invitación por:</p>
                <div className="grid grid-cols-2 gap-2">
                  {SEND_METHODS.map(({ method, Icon, label, color }) => (
                    <button key={method} type="button" onClick={() => handleSend(method)}
                      className="flex items-center gap-2 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-white transition hover:brightness-110"
                      style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHATLIST — main component
═════════════════════════════════════════════════════════════════ */
function ChatList({
  conversations,
  activeId,
  onSelect,
  allowDirectMessage,
  onCreateOutbound,
  onOpenAssistant,
  onOpenAllianceRoom,
  favorites,
  archived,
  pinned,
  onArchive,
  onFavorite,
  onPin,
  onCreateTeam,
}) {
  const [query,          setQuery]          = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeSegment,  setActiveSegment]  = useState('activos');
  const debounceTimer = useRef(null);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(val), 280);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    clearTimeout(debounceTimer.current);
  }, []);

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInvite,     setShowInvite]     = useState(false);
  const [showManage,     setShowManage]     = useState(false);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Agustín Orellano', initials: 'AO', role: 'Administrador', status: 'activo' },
  ]);

  const handleFabAction = (key) => {
    if (key === 'team')   setShowCreateTeam(true);
    if (key === 'invite') setShowInvite(true);
    if (key === 'chat' && allowDirectMessage) onCreateOutbound?.();
  };

  const handleInvited = (person) => {
    const initials = [person.nombre[0], person.apellido[0]].join('').toUpperCase();
    setTeamMembers(prev => [...prev, {
      id: Date.now(), name: `${person.nombre} ${person.apellido}`,
      initials, role: person.cargo || person.rol, status: 'invitado',
    }]);
  };

  const filtered = useMemo(() => {
    return conversations
      .filter(c => matchesSearch(c, debouncedQuery) && matchesSegment(c, activeSegment, favorites, archived))
      .sort((a, b) => (pinned.has(b.id) ? 1 : 0) - (pinned.has(a.id) ? 1 : 0));
  }, [conversations, debouncedQuery, activeSegment, favorites, archived, pinned]);

  const segmentCounts = useMemo(() => {
    const res = {};
    for (const s of SEGMENTS) {
      res[s.key] = conversations.filter(c => matchesSegment(c, s.key, favorites, archived)).length;
    }
    return res;
  }, [conversations, favorites, archived]);

  const matchConvs = filtered.filter(c => !c.isTeam);
  const teamConvs  = filtered.filter(c =>  c.isTeam);
  const isEmpty    = filtered.length === 0;
  const hasRealTeam = teamMembers.length > 1;

  return (
    <div className="h-full overflow-y-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
      style={{ background: '#0A0F1E' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Mensajes</h2>
        <div className="flex items-center gap-2">
          {onOpenAllianceRoom && (
            <button type="button" onClick={onOpenAllianceRoom} title="Alliance Room"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/8"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              <Video className="h-4 w-4" />
            </button>
          )}
          <FabMenu onAction={handleFabAction} />
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3">
        <div className="chat-search flex h-[38px] items-center gap-2.5 rounded-[10px] px-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-white/30" />
          <input
            className="flex-1 bg-transparent text-[13px] text-white outline-none border-0 ring-0 shadow-none placeholder:text-white/25"
            onChange={handleSearchChange} placeholder="Buscar…" value={query} />
          <AnimatePresence>
            {query && (
              <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                onClick={handleClearSearch} type="button"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10">
                <X className="h-2.5 w-2.5 text-white/50" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Segment tabs ── */}
      <div className="flex gap-0 border-b px-4 pb-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {SEGMENTS.map(seg => {
          const isActive = activeSegment === seg.key;
          const count    = segmentCounts[seg.key];
          return (
            <button key={seg.key} type="button" onClick={() => setActiveSegment(seg.key)}
              className="shrink-0 pb-2.5 pt-1 text-[12px] font-semibold transition-colors mr-4"
              style={isActive
                ? { color: 'white', borderBottom: '2px solid #4A9FFF', marginBottom: -1 }
                : { color: 'rgba(255,255,255,0.30)', borderBottom: '2px solid transparent', marginBottom: -1 }}>
              {seg.label}
              {count > 0 && (
                <span className="ml-1 text-[10px]" style={{ opacity: isActive ? 0.5 : 0.3 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── AI notice ── */}
      {!debouncedQuery && (
        <div className="pt-3">
          <AiNotice onOpen={onOpenAssistant} />
        </div>
      )}

      {/* ── Team completion bar ── */}
      {!debouncedQuery && hasRealTeam && (
        <TeamCompletionBar members={teamMembers} onManage={() => setShowManage(true)} />
      )}

      {/* ── Conversation list ── */}
      <div className="px-3 pb-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Search className="h-5 w-5 text-white/25" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white/45">
                {debouncedQuery ? 'Sin resultados' : 'Sin conversaciones'}
              </p>
              <p className="mt-1 text-[12px] text-white/25">
                {debouncedQuery ? `Para "${debouncedQuery}"` : 'Cambiá el segmento o iniciá una nueva'}
              </p>
            </div>
            {debouncedQuery && (
              <button onClick={handleClearSearch} type="button"
                className="rounded-full px-5 py-2 text-[13px] font-semibold text-white/55 transition hover:text-white/80"
                style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {/* Matches */}
            {matchConvs.length > 0 && (
              <>
                {teamConvs.length > 0 && (
                  <p className="px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.20em] text-white/25">Alianzas</p>
                )}
                <AnimatePresence initial={false}>
                  {matchConvs.map(conv => (
                    <motion.div key={conv.id} layout
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.14 }}>
                      <ChatItem conversation={conv} isActive={conv.id === activeId}
                        onSelect={onSelect} onArchive={onArchive} onPin={onPin} onFavorite={onFavorite}
                        isFavorite={favorites.has(conv.id)} isPinned={pinned.has(conv.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}

            {/* Team / Internal */}
            {teamConvs.length > 0 && (
              <div className={matchConvs.length > 0 ? 'mt-4' : ''}>
                <p className="px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.20em] text-white/25">Interno</p>
                <AnimatePresence initial={false}>
                  {teamConvs.map(conv => (
                    <motion.div key={conv.id} layout
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.14 }}>
                      <ChatItem conversation={conv} isActive={conv.id === activeId}
                        onSelect={onSelect} onArchive={onArchive} onPin={onPin} onFavorite={onFavorite}
                        isFavorite={favorites.has(conv.id)} isPinned={pinned.has(conv.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showCreateTeam && (
          <CreateTeamModal key="create-team"
            onClose={() => setShowCreateTeam(false)}
            onCreate={(team) => {
              setTeamMembers([{ id: 1, name: 'Agustín Orellano', initials: 'AO', role: 'Administrador', status: 'activo' }]);
              onCreateTeam?.(team);
            }} />
        )}
        {showInvite && (
          <InviteModal key="invite"
            onClose={() => setShowInvite(false)}
            onInvited={handleInvited} />
        )}
        {showManage && (
          <TeamManageModal key="manage"
            members={teamMembers}
            onClose={() => setShowManage(false)}
            onInvite={() => { setShowManage(false); setShowInvite(true); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatList;
export { InviteModal };
