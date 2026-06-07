import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive, Bot, Check, Copy, Link, Mail, MessageCircle,
  Phone, Plus, Search, Star, Users, Video, VolumeX, X,
} from 'lucide-react';
import ChatItem from './ChatItem';

/* ── Avatar gradient — deterministic per string ─────────── */
const GRAD_PALETTE = [
  ['#8B5CF6', '#6D28D9'],
  ['#3B82F6', '#1D4ED8'],
  ['#10B981', '#047857'],
  ['#F59E0B', '#D97706'],
  ['#EF4444', '#B91C1C'],
  ['#EC4899', '#BE185D'],
  ['#06B6D4', '#0E7490'],
  ['#6366F1', '#4338CA'],
];
function avatarGrad(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const [a, b] = GRAD_PALETTE[Math.abs(h) % GRAD_PALETTE.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/* ── Filter definitions ──────────────────────────────────── */
const FILTERS = ['Activos', 'Pendientes', 'Favoritos', 'Archivados'];

function matchesFilter(conv, filter, favorites, archived) {
  const isArchived = archived.has(conv.id);
  if (filter === 'Archivados') return isArchived;
  if (isArchived) return false;
  if (filter === 'Activos')   return conv.businessState === 'activo'    || conv.activity === 'Activa' || conv.isTeam;
  if (filter === 'Pendientes')return conv.businessState === 'pendiente' || conv.activity === 'Seguimiento';
  if (filter === 'Favoritos') return favorites.has(conv.id);
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

/* ── Member status ───────────────────────────────────────── */
const MEMBER_STATUS = {
  activo:   { dot: 'bg-emerald-400', label: 'Activo'            },
  invitado: { dot: 'bg-amber-400',   label: 'Invitación enviada' },
  visto:    { dot: 'bg-blue-400',    label: 'Invitación vista'   },
  pendiente:{ dot: 'bg-orange-400',  label: 'Registro iniciado'  },
  vencido:  { dot: 'bg-red-400',     label: 'Vencida'            },
};

/* ──────────────────────────────────────────────────────────
   STORIES ROW
────────────────────────────────────────────────────────── */
function StoriesRow({ conversations, onSelect }) {
  const visible = conversations.filter(c => !c.isTeam).slice(0, 8);
  return (
    <div className="flex gap-4 overflow-x-auto px-5 pb-3 pt-1 [scrollbar-width:none]">
      {/* "Tú" circle */}
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <div
          className="flex h-[54px] w-[54px] items-center justify-center rounded-full font-['Space_Grotesk'] text-[12px] font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #141E30, #35577D)',
            border: '2px solid rgba(255,255,255,0.12)',
          }}
        >
          Yo
        </div>
        <span className="w-[54px] truncate text-center text-[10px] text-white/40">Tú</span>
      </div>

      {visible.map(conv => (
        <button
          key={conv.id}
          type="button"
          onClick={() => onSelect(conv.id)}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <div className="relative">
            <div
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full font-['Space_Grotesk'] text-[13px] font-bold text-white"
              style={{ background: avatarGrad(conv.id) }}
            >
              {conv.logo && /^[A-Z]{1,3}$/.test(conv.logo)
                ? conv.logo
                : conv.company?.slice(0, 2).toUpperCase()}
            </div>
            {/* Unread ring */}
            {conv.unread > 0 && (
              <span
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 0 2.5px #1871D8' }}
              />
            )}
          </div>
          <span className="w-[54px] truncate text-center text-[10px] text-white/50">
            {conv.company?.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   FAB "+" MENU
────────────────────────────────────────────────────────── */
const FAB_ITEMS = [
  { key: 'chat',   icon: MessageCircle, label: 'Nuevo Chat',          color: '#3B82F6' },
  { key: 'group',  icon: Users,         label: 'Nuevo Grupo',         color: '#10B981' },
  { key: 'team',   icon: Star,          label: 'Crear Equipo',        color: '#8B5CF6' },
  { key: 'invite', icon: Mail,          label: 'Invitar Integrantes', color: '#F59E0B' },
];

function FabMenu({ onAction }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen(p => !p)}
        whileTap={{ scale: 0.88 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.18 }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.45)' }}
      >
        <Plus className="h-[18px] w-[18px]" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="absolute right-0 top-11 z-50 w-[200px] overflow-hidden rounded-[20px] py-1.5"
              style={{
                background: 'rgba(15,24,48,0.98)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 56px rgba(0,0,0,0.60)',
              }}
            >
              {FAB_ITEMS.map(({ key, icon: Icon, label, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setOpen(false); onAction(key); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/6"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: `${color}22` }}
                  >
                    <Icon className="h-[15px] w-[15px]" style={{ color }} />
                  </div>
                  <span className="text-[13px] font-medium text-white/85">{label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   TEAM COMPLETION BAR
────────────────────────────────────────────────────────── */
function TeamCompletionBar({ members, onManage }) {
  const active = members.filter(m => m.status === 'activo').length;
  const total  = members.length;
  const pct    = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div
      className="mx-4 mb-3 cursor-pointer overflow-hidden rounded-[18px] p-4 transition hover:brightness-110"
      style={{
        background: 'rgba(20,30,48,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onClick={onManage}
      role="button"
      tabIndex={0}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#4A9FFF]" />
          <span className="text-[13px] font-semibold text-white/85">Tu equipo</span>
        </div>
        <span className="text-[11px] text-white/40">{active} de {total} activos · {pct}%</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #1871D8, #4A9FFF)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }}
        />
      </div>

      {/* Member avatars */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {members.slice(0, 5).map(m => (
            <div
              key={m.id}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2"
              style={{ background: avatarGrad(m.name), ringColor: '#0A0F1E' }}
              title={`${m.name} — ${MEMBER_STATUS[m.status]?.label}`}
            >
              {m.initials}
            </div>
          ))}
          {members.length > 5 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white/55 ring-2 ring-[#0A0F1E]">
              +{members.length - 5}
            </div>
          )}
        </div>
        <span className="text-[11px] text-[#4A9FFF]">Gestionar →</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   EMPTY TEAM CARD
────────────────────────────────────────────────────────── */
function EmptyTeamCard({ onInvite }) {
  return (
    <div
      className="mx-4 mb-3 overflow-hidden rounded-[18px] p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(24,113,216,0.10) 0%, rgba(20,30,48,0.95) 100%)',
        border: '1px solid rgba(24,113,216,0.18)',
      }}
    >
      <div className="mb-2 flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]"
          style={{ background: 'rgba(24,113,216,0.15)' }}
        >
          <Users className="h-4 w-4 text-[#4A9FFF]" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">👥 Tu equipo está vacío</p>
          <p className="text-[11px] text-white/40">Invitá a colaboradores</p>
        </div>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-white/40">
        Incorporá a tu equipo para gestionar alianzas y coordinar tareas desde Data Plus.
      </p>
      <button
        type="button"
        onClick={onInvite}
        className="flex w-full items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
        style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 14px rgba(24,113,216,0.30)' }}
      >
        <Plus className="h-3.5 w-3.5" />
        Invitar Integrantes
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   TEAM MANAGE MODAL
────────────────────────────────────────────────────────── */
function TeamManageModal({ members, onClose, onInvite }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="fixed inset-x-0 bottom-0 z-[70] flex flex-col rounded-t-[24px]"
        style={{
          maxHeight: '88dvh',
          background: '#0F1828',
          border: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 pb-4 pt-1">
          <div>
            <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Equipo Comercial</h2>
            <p className="text-[12px] text-white/40">{members.length} integrantes</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onInvite}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white transition"
              style={{ background: 'rgba(24,113,216,0.20)', border: '1px solid rgba(24,113,216,0.30)' }}
            >
              <Plus className="h-3 w-3" />
              Invitar
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
                <div key={m.id}
                  className="flex items-center gap-3 rounded-[16px] px-3 py-3.5 transition hover:bg-white/5"
                >
                  <div className="relative shrink-0">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full font-['Space_Grotesk'] text-[12px] font-bold text-white"
                      style={{ background: avatarGrad(m.name) }}
                    >
                      {m.initials}
                    </div>
                    <span className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0F1828] ${sc.dot}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-white">{m.name}</p>
                    <p className="text-[12px] text-white/45">{m.role} · {sc.label}</p>
                  </div>
                  {m.status === 'invitado' && (
                    <button type="button"
                      className="text-[11px] font-semibold text-[#4A9FFF] transition hover:opacity-70"
                    >
                      Reenviar
                    </button>
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

/* ──────────────────────────────────────────────────────────
   CREATE TEAM MODAL
────────────────────────────────────────────────────────── */
const AREAS = ['Comercial', 'Marketing', 'Ventas', 'Operaciones', 'Tecnología', 'Administración'];

function CreateTeamModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [area, setArea] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc, area });
    onClose();
  };

  const fieldStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="fixed inset-x-0 bottom-0 z-[70] rounded-t-[24px]"
        style={{
          background: '#0F1828',
          border: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <div className="flex items-center justify-between border-b border-white/8 px-5 pb-4 pt-1">
          <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Crear Equipo</h2>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Nombre del equipo *
            </label>
            <input
              value={name} onChange={e => setName(e.target.value)} required
              placeholder="Equipo Comercial"
              className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none placeholder:text-white/25 focus:ring-2 focus:ring-[#1871D8]/40"
              style={fieldStyle}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Descripción
            </label>
            <textarea
              value={desc} onChange={e => setDesc(e.target.value)} rows={2}
              placeholder="Equipo encargado de alianzas estratégicas…"
              className="w-full resize-none rounded-[14px] px-4 py-3 text-[14px] outline-none placeholder:text-white/25 focus:ring-2 focus:ring-[#1871D8]/40"
              style={fieldStyle}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Área
            </label>
            <select value={area} onChange={e => setArea(e.target.value)}
              className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none"
              style={fieldStyle}
            >
              <option value="">Seleccionar área…</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button type="submit"
            className="w-full rounded-[16px] py-3.5 text-[14px] font-bold text-white transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}
          >
            Crear Equipo
          </button>
        </form>
      </motion.div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   INVITE MODAL
────────────────────────────────────────────────────────── */
const ROLES_OPT = [
  { value: 'admin',       label: 'Administrador' },
  { value: 'manager',     label: 'Manager'       },
  { value: 'colaborador', label: 'Colaborador'   },
  { value: 'readonly',    label: 'Solo lectura'  },
];
const SEND_METHODS = [
  { method: 'email',    Icon: Mail,        label: 'Email',        color: '#3B82F6' },
  { method: 'whatsapp', Icon: Phone,       label: 'WhatsApp',     color: '#25D366' },
  { method: 'link',     Icon: Link,        label: 'Compartir',    color: '#8B5CF6' },
  { method: 'copy',     Icon: Copy,        label: 'Copiar enlace',color: '#F59E0B' },
];

function InviteModal({ onClose, onInvited }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', cargo: '', rol: 'colaborador' });
  const [sent, setSent] = useState(false);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSend = (method) => {
    setSent(true);
    window.setTimeout(() => {
      onInvited?.({ ...form, method, status: 'invitado' });
      onClose();
    }, 1400);
  };

  const fieldStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="fixed inset-x-0 bottom-0 z-[70] flex flex-col rounded-t-[24px]"
        style={{
          maxHeight: '92dvh',
          background: '#0F1828',
          border: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 pb-4 pt-1">
          <div>
            <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Invitar Integrante</h2>
            <p className="text-[12px] text-white/40">Completá los datos para enviar la invitación</p>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
          <div className="space-y-4 px-5 py-4">
            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              {[['nombre', 'Nombre *'], ['apellido', 'Apellido *']].map(([k, lbl]) => (
                <div key={k}>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{lbl}</label>
                  <input value={form[k]} onChange={e => upd(k, e.target.value)}
                    className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-white/20 focus:ring-2 focus:ring-[#1871D8]/40"
                    style={fieldStyle} />
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Email *</label>
              <input type="email" value={form.email} onChange={e => upd('email', e.target.value)}
                placeholder="juan@empresa.com"
                className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-white/20 focus:ring-2 focus:ring-[#1871D8]/40"
                style={fieldStyle} />
            </div>

            {/* Teléfono + Cargo */}
            <div className="grid grid-cols-2 gap-3">
              {[['telefono', 'Teléfono', '+54 11…'], ['cargo', 'Cargo', 'Ventas']].map(([k, lbl, ph]) => (
                <div key={k}>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{lbl}</label>
                  <input value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={ph}
                    className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-white/20 focus:ring-2 focus:ring-[#1871D8]/40"
                    style={fieldStyle} />
                </div>
              ))}
            </div>

            {/* Rol */}
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Rol</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES_OPT.map(r => (
                  <button key={r.value} type="button" onClick={() => upd('rol', r.value)}
                    className={`rounded-[12px] py-2.5 text-[13px] font-semibold transition-all ${
                      form.rol === r.value ? 'bg-[#1871D8] text-white shadow-sm' : 'text-white/55 hover:text-white/75'
                    }`}
                    style={form.rol !== r.value ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Send footer */}
        <div className="shrink-0 border-t border-white/8 px-5 py-4">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 rounded-[16px] py-3.5"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-[13px] font-semibold text-emerald-400">🟡 Invitación enviada</span>
              </motion.div>
            ) : (
              <motion.div key="methods">
                <p className="mb-2.5 text-center text-[11px] text-white/30">Enviar invitación por:</p>
                <div className="grid grid-cols-2 gap-2">
                  {SEND_METHODS.map(({ method, Icon, label, color }) => (
                    <button key={method} type="button" onClick={() => handleSend(method)}
                      className="flex items-center gap-2 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-white transition hover:brightness-110"
                      style={{ background: `${color}18`, border: `1px solid ${color}28` }}
                    >
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

/* ══════════════════════════════════════════════════════════
   CHATLIST — main component
═════════════════════════════════════════════════════════ */
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
  onCreateTeam,   // (teamData) → crea conversación y navega al chat del equipo
}) {
  /* ── Search ── */
  const [query,          setQuery]          = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter,   setActiveFilter]   = useState('Activos');
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

  /* ── Modals ── */
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInvite,     setShowInvite]     = useState(false);
  const [showManage,     setShowManage]     = useState(false);

  /* ── Team state ── */
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
    setTeamMembers(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `${person.nombre} ${person.apellido}`,
        initials,
        role: person.cargo || person.rol,
        status: 'invitado',
      },
    ]);
  };

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    return conversations
      .filter(c => matchesSearch(c, debouncedQuery) && matchesFilter(c, activeFilter, favorites, archived))
      .sort((a, b) => (pinned.has(b.id) ? 1 : 0) - (pinned.has(a.id) ? 1 : 0));
  }, [conversations, debouncedQuery, activeFilter, favorites, archived, pinned]);

  const counts = useMemo(() => {
    const res = {};
    for (const f of FILTERS) {
      res[f] = conversations.filter(c => matchesFilter(c, f, favorites, archived)).length;
    }
    return res;
  }, [conversations, favorites, archived]);

  const matchConvs = filtered.filter(c => !c.isTeam);
  const teamConvs  = filtered.filter(c =>  c.isTeam);
  const isEmpty    = filtered.length === 0;

  /* ── Team section ── */
  const hasRealTeam = teamMembers.length > 1;

  return (
    <div className="h-full overflow-y-auto bg-[#0A0F1E] [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="font-['Space_Grotesk'] text-[24px] font-bold text-white">Chats</h2>
        <div className="flex items-center gap-2">
          {onOpenAllianceRoom && (
            <button type="button" onClick={onOpenAllianceRoom} title="Alliance Room"
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/8"
              style={{ border: '1.5px solid rgba(139,92,246,0.35)', color: '#A78BFA' }}
            >
              <Video className="h-4 w-4" />
            </button>
          )}
          <FabMenu onAction={handleFabAction} />
        </div>
      </div>

      {/* ── Search — reference style ── */}
      <div className="px-5 pb-3">
        <div
          className="flex h-[42px] items-center gap-2.5 rounded-2xl px-4 transition focus-within:ring-1 focus-within:ring-white/20"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Search className="h-4 w-4 shrink-0 text-white/30" />
          <input
            className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/28"
            onChange={handleSearchChange}
            placeholder="Buscar…"
            value={query}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                onClick={handleClearSearch} type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white/70"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Stories row ── */}
      {!debouncedQuery && <StoriesRow conversations={conversations} onSelect={onSelect} />}

      {/* ── Filter tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter;
          const count    = counts[filter];
          return (
            <button key={filter} type="button" onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                isActive ? 'bg-white text-[#141E30] shadow-sm' : 'text-white/45 hover:text-white/65'
              }`}
              style={!isActive ? { background: 'rgba(255,255,255,0.08)' } : {}}
            >
              {filter}
              {count > 0 && (
                <span className={`ml-1 ${isActive ? 'text-[#141E30]/50' : 'text-white/30'}`}>({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Team section — solo barra de progreso cuando hay miembros ── */}
      {!debouncedQuery && hasRealTeam && (
        <TeamCompletionBar members={teamMembers} onManage={() => setShowManage(true)} />
      )}

      {/* ── Pinned: AI Assistant ── */}
      {!debouncedQuery && (
        <div className="px-4 pb-2">
          <button type="button" onClick={onOpenAssistant}
            className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(12,18,38,0.90) 0%, rgba(18,26,54,0.85) 100%)',
              border: '1px solid rgba(24,113,216,0.25)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(24,113,216,0.12)',
            }}
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
              style={{ background: 'linear-gradient(135deg, #1459B0, #1871D8)', boxShadow: '0 0 16px rgba(24,113,216,0.4)' }}>
              <Bot className="h-5 w-5 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 bg-emerald-400"
                style={{ borderColor: 'rgba(12,18,38,0.9)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">Asistente Virtual</p>
                <span className="rounded-full bg-[#1871D8]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#4A9FFF]">IA</span>
                <span className="ml-auto text-[10px] text-white/30">📌</span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-white/40">
                Propuestas, tips y optimización de perfil
              </p>
            </div>
          </button>
        </div>
      )}

      {/* ── Conversation list ── */}
      <div className="px-3 pb-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8">
              <Search className="h-5 w-5 text-white/35" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white/55">
                {debouncedQuery ? 'Sin resultados' : 'No hay conversaciones'}
              </p>
              <p className="mt-1 text-[12px] text-white/30">
                {debouncedQuery ? `Para "${debouncedQuery}"` : 'Cambiá el filtro o iniciá una nueva'}
              </p>
            </div>
            {debouncedQuery && (
              <button onClick={handleClearSearch} type="button"
                className="rounded-full px-5 py-2.5 text-[13px] font-semibold text-white/70 transition hover:bg-white/8"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-px">
            {matchConvs.length > 0 && (
              <>
                {teamConvs.length > 0 && (
                  <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Matches</p>
                )}
                <AnimatePresence initial={false}>
                  {matchConvs.map(conv => (
                    <motion.div key={conv.id} layout
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.14 }}
                    >
                      <ChatItem conversation={conv} isActive={conv.id === activeId}
                        onSelect={onSelect} onArchive={onArchive} onPin={onPin} onFavorite={onFavorite}
                        isFavorite={favorites.has(conv.id)} isPinned={pinned.has(conv.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}
            {teamConvs.length > 0 && (
              <div className={matchConvs.length > 0 ? 'mt-4' : ''}>
                <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Interno</p>
                <AnimatePresence initial={false}>
                  {teamConvs.map(conv => (
                    <motion.div key={conv.id} layout
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.14 }}
                    >
                      <ChatItem conversation={conv} isActive={conv.id === activeId}
                        onSelect={onSelect} onArchive={onArchive} onPin={onPin} onFavorite={onFavorite}
                        isFavorite={favorites.has(conv.id)} isPinned={pinned.has(conv.id)}
                      />
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
              onCreateTeam?.(team);   // crea el hilo y navega al chat
            }}
          />
        )}
        {showInvite && (
          <InviteModal key="invite"
            onClose={() => setShowInvite(false)}
            onInvited={handleInvited}
          />
        )}
        {showManage && (
          <TeamManageModal key="manage"
            members={teamMembers}
            onClose={() => setShowManage(false)}
            onInvite={() => { setShowManage(false); setShowInvite(true); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatList;
export { InviteModal };
