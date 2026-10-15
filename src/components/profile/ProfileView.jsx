import {
  Activity, Briefcase, Building2, Camera, Check, Clock, Crown,
  Globe, MapPin, Pencil, Plus, Settings, Users, X, Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import BranchManager from './BranchManager';
import TagSelector from './TagSelector';
import instagramLogo from '../../assets/instagram-logo.svg';
import tiktokLogo from '../../assets/tiktok-logo.svg';
import linkedinLogo from '../../assets/linkedin-logo.svg';
import { INDUSTRY_OPTIONS } from '../../utils/companyProfile';
import { InstagramFeedProfile } from '../shared/InstagramFeedPreview';
import { InviteModal } from '../chat/ChatList';

/* ── Social platforms — website last, uses Globe icon ── */
const socialPlatforms = [
  { key: 'instagram', label: 'Instagram', isAsset: true,  icon: instagramLogo },
  { key: 'tiktok',    label: 'TikTok',    isAsset: true,  icon: tiktokLogo    },
  { key: 'linkedin',  label: 'LinkedIn',  isAsset: true,  icon: linkedinLogo  },
  { key: 'website',   label: 'Sitio web', isAsset: false, icon: null          },
];

/* ── Image upload guide specs ── */
const IMAGE_SPECS = {
  logo: {
    title: 'Logo de marca',
    subtitle: 'Representa la identidad visual de tu empresa',
    color: '#1871D8',
    specs: [
      { label: 'Resolución',  value: '1080 × 1080 px' },
      { label: 'Formato',     value: 'PNG transparente' },
      { label: 'Peso máximo', value: '5 MB' },
      { label: 'Proporción',  value: '1:1 cuadrado' },
    ],
    shape: 'circle',
  },
  cover: {
    title: 'Portada del perfil',
    subtitle: 'Primera impresión de tu marca en la plataforma',
    color: '#059669',
    specs: [
      { label: 'Resolución',  value: '1920 × 1080 px' },
      { label: 'Formato',     value: 'JPG o PNG' },
      { label: 'Peso máximo', value: '10 MB' },
      { label: 'Proporción',  value: '16:9 horizontal' },
    ],
    shape: 'wide',
  },
};

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado.'));
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────────────────────────────────
   FIELD — single labeled input (dark glass, inside hero)
───────────────────────────────────────────────────────── */
function DarkField({ label, value, onChange, multiline, placeholder }) {
  const baseClass = 'w-full rounded-[14px] px-4 py-3 text-sm outline-none transition placeholder:text-(color:--ui-t3) focus:ring-2 focus:ring-[#1871D8]/40';
  const fieldStyle = {
    background: 'var(--ui-s2)',
    border: '1px solid var(--ui-s2)',
    color: 'white',
  };
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(color:--ui-t3)">{label}</label>
      {multiline ? (
        <textarea
          className={`${baseClass} resize-none`}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={fieldStyle}
          value={value}
        />
      ) : (
        <input
          className={baseClass}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={fieldStyle}
          value={value}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STICKY SAVE BUTTON
───────────────────────────────────────────────────────── */
function StickySaveButton({ onClick }) {
  return (
    <AnimatePresence>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-[82px] left-4 right-4 z-40"
        exit={{ y: 80, opacity: 0 }}
        initial={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
      >
        <motion.button
          className="flex w-full items-center justify-center gap-2.5 rounded-[18px] py-4 text-sm font-bold text-white"
          onClick={onClick}
          style={{
            background: 'linear-gradient(135deg, #1871D8 0%, #1459B0 100%)',
            boxShadow: '0 8px 32px rgba(24,113,216,0.50), inset 0 1px 0 var(--ui-s3)',
          }}
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ boxShadow: '0 12px 40px rgba(24,113,216,0.60), inset 0 1px 0 var(--ui-s3)' }}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
          Guardar cambios
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   IMAGE GUIDE MODAL (bottom sheet)
───────────────────────────────────────────────────────── */
function ImageGuideModal({ type, onClose, onUpload }) {
  const spec = IMAGE_SPECS[type];
  if (!spec) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 backdrop-blur-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          animate={{ y: 0 }}
          className="w-full max-w-lg overflow-hidden rounded-[28px]"
          exit={{ y: '100%' }}
          initial={{ y: '100%' }}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{
            background: 'var(--ui-card)',
            border: '1px solid var(--ui-s2)',
            boxShadow: '0 -8px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-(--ui-s3)" />
          </div>

          <div className="px-6 pb-6">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-t3)">
                  Guía de carga
                </p>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-(color:--ui-t1)">{spec.title}</h3>
                <p className="mt-0.5 text-[12px] text-(color:--ui-t2)">{spec.subtitle}</p>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-(color:--ui-t3) transition hover:bg-(--ui-s2) hover:text-(color:--ui-t2)"
                onClick={onClose}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Preview frame */}
            <div className="mb-5 flex justify-center">
              {spec.shape === 'circle' ? (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed"
                  style={{ borderColor: `${spec.color}50`, background: `${spec.color}10` }}
                >
                  <Camera className="h-7 w-7" style={{ color: spec.color }} />
                </div>
              ) : (
                <div
                  className="flex h-[60px] w-[106px] items-center justify-center rounded-[12px] border-2 border-dashed"
                  style={{ borderColor: `${spec.color}50`, background: `${spec.color}10` }}
                >
                  <Camera className="h-5 w-5" style={{ color: spec.color }} />
                </div>
              )}
            </div>

            {/* Spec cards — 2 col grid */}
            <div className="mb-5 grid grid-cols-2 gap-2">
              {spec.specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded-[14px] px-4 py-3"
                  style={{
                    background: 'var(--ui-s1)',
                    border: '1px solid var(--ui-s2)',
                  }}
                >
                  <p className="mb-0.5 text-[10px] text-(color:--ui-t3)">{s.label}</p>
                  <p className="text-[13px] font-semibold text-(color:--ui-t1)">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Upload CTA */}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-[16px] py-3.5 text-sm font-bold text-white transition active:scale-[0.98]"
              onClick={onUpload}
              style={{
                background: `linear-gradient(135deg, ${spec.color}, ${spec.color}cc)`,
                boxShadow: `0 6px 24px ${spec.color}40`,
              }}
              type="button"
            >
              <Camera className="h-4 w-4" />
              Subir imagen
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── New section constants ─────────────────────────────── */
const CARD_DARK = { background: 'var(--ui-card)', border: '1px solid var(--ui-s2)' };

/* ── Channel icons — custom SVG, 14×14, stroke-based ──── */
const ChannelIcons = {
  redes: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="2.2"/>
      <circle cx="2.2" cy="2.5" r="1.3"/>
      <circle cx="11.8" cy="2.5" r="1.3"/>
      <circle cx="2.2" cy="11.5" r="1.3"/>
      <circle cx="11.8" cy="11.5" r="1.3"/>
      <line x1="4.1" y1="3.8" x2="5.3" y2="5.5"/>
      <line x1="9.9" y1="3.8" x2="8.7" y2="5.5"/>
      <line x1="4.1" y1="10.2" x2="5.3" y2="8.5"/>
      <line x1="9.9" y1="10.2" x2="8.7" y2="8.5"/>
    </svg>
  ),
  email: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="11" height="8" rx="1.5"/>
      <polyline points="1.5,3.5 7,7.5 12.5,3.5"/>
    </svg>
  ),
  app: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="1" width="7" height="12" rx="1.8"/>
      <line x1="6.2" y1="11" x2="7.8" y2="11"/>
    </svg>
  ),
  push: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2C4.8 2 3 3.8 3 6v3l-1 1.5h10L11 9V6c0-2.2-1.8-4-4-4z"/>
      <line x1="7" y1="2" x2="7" y2="1"/>
      <path d="M5.8 11.5a1.2 1.2 0 002.4 0"/>
    </svg>
  ),
  whatsapp: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5A5.5 5.5 0 001.5 7c0 1 .27 2 .75 2.8L1.5 12.5l2.8-.72A5.5 5.5 0 107 1.5z"/>
      <path d="M5 5.5c.2.6.6 1.2 1.1 1.7.5.5 1.1.9 1.7 1.1l.9-.9c.1-.1.3-.1.4 0l1.3.9c.1.1.1.3 0 .4-.4.5-1 .8-1.6.8-1.8 0-3.8-2-3.8-3.8 0-.6.3-1.2.8-1.6.1-.1.3-.1.4 0l.9 1.3c.1.1.1.3 0 .4l-.9.9"/>
    </svg>
  ),
  web: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5"/>
      <path d="M7 1.5C5.5 3.5 5.5 10.5 7 12.5M7 1.5C8.5 3.5 8.5 10.5 7 12.5"/>
      <line x1="1.5" y1="7" x2="12.5" y2="7"/>
      <path d="M2.5 4.5h9M2.5 9.5h9"/>
    </svg>
  ),
  carteleria: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="11" height="7" rx="1.2"/>
      <line x1="7" y1="8.5" x2="7" y2="12"/>
      <line x1="4.5" y1="12" x2="9.5" y2="12"/>
    </svg>
  ),
  pantallas: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2" width="12" height="8.5" rx="1.2"/>
      <line x1="5" y1="12" x2="9" y2="12"/>
      <line x1="7" y1="10.5" x2="7" y2="12"/>
      <polyline points="4.5,7 6,5 7.5,6.5 9,4.5"/>
    </svg>
  ),
  eventos: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="11" height="9.5" rx="1.2"/>
      <line x1="1.5" y1="6" x2="12.5" y2="6"/>
      <line x1="4.5" y1="1.5" x2="4.5" y2="4.5"/>
      <line x1="9.5" y1="1.5" x2="9.5" y2="4.5"/>
    </svg>
  ),
  sampling: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5L8.5 5h3.5l-2.8 2 1 3.5L7 8.5l-3.2 2 1-3.5L2 5h3.5z"/>
    </svg>
  ),
  fidelizacion: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11.5S2 8.5 2 5.2A2.8 2.8 0 017 3.5 2.8 2.8 0 0112 5.2C12 8.5 7 11.5 7 11.5z"/>
    </svg>
  ),
  beneficios: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5l1.5 3 3.5.5-2.5 2.5.6 3.5L7 9.5l-3.1 1.5.6-3.5L2 5l3.5-.5z"/>
      <line x1="7" y1="9.5" x2="7" y2="12.5"/>
      <line x1="4" y1="12.5" x2="10" y2="12.5"/>
    </svg>
  ),
};

const CAPABILITY_OPTIONS = [
  { id: 'redes',        label: 'Redes Sociales'         },
  { id: 'email',        label: 'Email Marketing'         },
  { id: 'app',          label: 'App Propia'              },
  { id: 'push',         label: 'Push Notifications'      },
  { id: 'whatsapp',     label: 'WhatsApp'                },
  { id: 'web',          label: 'Sitio Web'               },
  { id: 'carteleria',   label: 'Cartelería en Sucursales'},
  { id: 'pantallas',    label: 'Pantallas Digitales'     },
  { id: 'eventos',      label: 'Eventos'                 },
  { id: 'sampling',     label: 'Sampling'                },
  { id: 'fidelizacion', label: 'Fidelización'            },
  { id: 'beneficios',   label: 'Beneficios Corp.'        },
];

const STRUCTURE_OPTS  = ['Centralizada', 'Descentralizada', 'Mixta'];
const APPROVAL_OPTS   = ['Marketing', 'Comercial', 'Dirección', 'Franquicias'];
const RESPONSE_OPTS   = ['< 24 horas', '24-48 horas', '2-5 días', '+1 semana'];
const MODALITY_OPTS   = ['Equipo', 'Representante único'];
const AGE_OPTS        = ['18-24', '18-35', '25-40', '35-50', '45-65', 'Todas las edades'];
const COVERAGE_OPTS   = ['CABA', 'CABA y GBA', 'Resto de Argentina', 'Todo el país', 'Latinoamérica'];
const SEG_OPTS        = ['Jóvenes 18-30', 'Profesionales', 'Familias', 'Parejas', 'Seniors', 'Emprendedores'];

/* ── Shared card wrapper ───────────────────────────────── */
function SectionCard({ children }) {
  return (
    <div className="mx-4 mt-3 overflow-hidden rounded-[24px]" style={CARD_DARK}>
      {children}
    </div>
  );
}

/* ── Team Section ──────────────────────────────────────── */
function TeamSection({ members }) {
  const [showInvite, setShowInvite] = useState(false);
  const COLORS = [
    ['#8B5CF6','#6D28D9'], ['#3B82F6','#1D4ED8'], ['#10B981','#047857'],
    ['#F59E0B','#D97706'], ['#EF4444','#B91C1C'], ['#EC4899','#BE185D'],
  ];
  return (
    <>
      <SectionCard>
        <div className="px-5 pt-5 pb-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-t3)">Equipo</p>
              <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-bold text-(color:--ui-t1)">
                Equipo Comercial
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-(color:--ui-accent-text) transition hover:bg-[#1871D8]/12"
            >
              <Plus className="h-3 w-3" />
              Invitar
            </button>
          </div>
          <div className="space-y-3">
            {members.map((m, i) => {
              const [a, b] = COLORS[i % COLORS.length];
              const initials = m.initials || m.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-['Space_Grotesk'] text-[12px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-(color:--ui-t1)">{m.name}</p>
                      {m.isLead && (
                        <span className="rounded-full bg-[#1871D8]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-(color:--ui-accent-text)">
                          Lead
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-(color:--ui-t2)">{m.role}{m.area ? ` · ${m.area}` : ''}</p>
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>
      <AnimatePresence>
        {showInvite && (
          <InviteModal
            key="team-invite"
            onClose={() => setShowInvite(false)}
            onInvited={() => setShowInvite(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Work Style Section ─────────────────────────────────── */
function WorkStyleSection({ workStyle, onChange }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal]     = useState(workStyle);
  const upd = (k, v) => setLocal(p => ({ ...p, [k]: v }));

  const save   = () => { onChange(local); setEditing(false); };
  const cancel = () => { setLocal(workStyle); setEditing(false); };

  const FIELDS = [
    { label: 'Estructura',                field: 'structure',    options: STRUCTURE_OPTS  },
    { label: 'Área que aprueba alianzas', field: 'approvalArea', options: APPROVAL_OPTS   },
    { label: 'Tiempo de respuesta',       field: 'responseTime', options: RESPONSE_OPTS   },
    { label: 'Modalidad',                 field: 'modality',     options: MODALITY_OPTS   },
  ];

  return (
    <SectionCard>
      <div className="px-5 pt-5 pb-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-t3)">Forma de Trabajo</p>
            <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-bold text-(color:--ui-t1)">Gestión de alianzas</p>
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)}
              className="text-[11px] font-semibold text-(color:--ui-accent-text)">Editar</button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            {FIELDS.map(({ label, field, options }) => (
              <div key={field}>
                <p className="mb-2 text-[11px] font-semibold text-(color:--ui-t3)">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {options.map(opt => (
                    <button key={opt} type="button" onClick={() => upd(field, opt)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                        local[field] === opt
                          ? 'bg-[#1871D8] text-white shadow-sm'
                          : 'bg-(--ui-s1) text-(color:--ui-t2) hover:bg-(--ui-s3)'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-2 flex gap-3">
              <button type="button" onClick={save}
                className="flex-1 rounded-[12px] py-2.5 text-[13px] font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)' }}>
                Guardar
              </button>
              <button type="button" onClick={cancel}
                className="rounded-[12px] border border-(--ui-s3) px-5 py-2.5 text-[13px] font-semibold text-(color:--ui-t2)">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map(({ label, field }) => (
              <div key={field} className="rounded-[14px] p-3" style={{ background: 'var(--ui-s1)' }}>
                <p className="text-[10px] text-(color:--ui-t3) mb-0.5">{label}</p>
                <p className="text-[13px] font-semibold text-(color:--ui-t1)">{workStyle[field] || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ── Capabilities Section ───────────────────────────────── */
function CapabilitiesSection({ capabilities, onChange }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal]     = useState(capabilities);

  const toggle = (id) =>
    setLocal(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const save   = () => { onChange(local); setEditing(false); };
  const cancel = () => { setLocal(capabilities); setEditing(false); };

  const selected = editing ? local : capabilities;

  return (
    <SectionCard>
      <div className="px-5 pt-5 pb-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-t3)">Capacidades de Activación</p>
            <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-bold text-(color:--ui-t1)">Canales disponibles</p>
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)}
              className="text-[11px] font-semibold text-(color:--ui-accent-text)">Editar</button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(editing ? CAPABILITY_OPTIONS : CAPABILITY_OPTIONS.filter(c => capabilities.includes(c.id))).map(cap => {
            const active = selected.includes(cap.id);
            return (
              <button key={cap.id} type="button"
                onClick={() => editing && toggle(cap.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                  active ? 'text-white shadow-sm'
                         : editing ? 'bg-(--ui-s1) text-(color:--ui-t3) hover:bg-(--ui-s3)' : 'bg-white/6 text-(color:--ui-t3)'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 2px 8px rgba(24,113,216,0.28)' } : {}}
              >
                <span className="flex items-center">{ChannelIcons[cap.id]}</span>
                {cap.label}
              </button>
            );
          })}
        </div>

        {editing && (
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={save}
              className="flex-1 rounded-[12px] py-2.5 text-[13px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)' }}>
              Guardar
            </button>
            <button type="button" onClick={cancel}
              className="rounded-[12px] border border-(--ui-s3) px-5 py-2.5 text-[13px] font-semibold text-(color:--ui-t2)">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ── Audience Section ──────────────────────────────────── */
function AudienceSection({ audience, onChange }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal]     = useState(audience);
  const upd = (k, v) => setLocal(p => ({ ...p, [k]: v }));

  const save   = () => { onChange(local); setEditing(false); };
  const cancel = () => { setLocal(audience); setEditing(false); };

  const toggleSeg = (seg) => {
    const s = local.segments || [];
    upd('segments', s.includes(seg) ? s.filter(x => x !== seg) : [...s, seg]);
  };

  const fStyle = { background: 'var(--ui-s2)', border: '1px solid var(--ui-s2)', color: 'white' };

  return (
    <SectionCard>
      <div className="px-5 pt-5 pb-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-t3)">Audiencia</p>
            <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-bold text-(color:--ui-t1)">Público de la marca</p>
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)}
              className="text-[11px] font-semibold text-(color:--ui-accent-text)">Editar</button>
          )}
        </div>
        {editing ? (
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-(color:--ui-t3)">Público principal</p>
              <input value={local.primary || ''} onChange={e => upd('primary', e.target.value)}
                placeholder="Jóvenes 25-35 interesados en moda…"
                className="w-full rounded-[12px] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-(color:--ui-t3)"
                style={fStyle} />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold text-(color:--ui-t3)">Rango etario</p>
              <div className="flex flex-wrap gap-1.5">
                {AGE_OPTS.map(o => (
                  <button key={o} type="button" onClick={() => upd('ageRange', o)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${local.ageRange === o ? 'bg-[#1871D8] text-white' : 'bg-(--ui-s1) text-(color:--ui-t2) hover:bg-(--ui-s3)'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold text-(color:--ui-t3)">Cobertura geográfica</p>
              <div className="flex flex-wrap gap-1.5">
                {COVERAGE_OPTS.map(o => (
                  <button key={o} type="button" onClick={() => upd('coverage', o)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${local.coverage === o ? 'bg-[#1871D8] text-white' : 'bg-(--ui-s1) text-(color:--ui-t2) hover:bg-(--ui-s3)'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold text-(color:--ui-t3)">Segmentos destacados</p>
              <div className="flex flex-wrap gap-1.5">
                {SEG_OPTS.map(seg => {
                  const on = (local.segments || []).includes(seg);
                  return (
                    <button key={seg} type="button" onClick={() => toggleSeg(seg)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${on ? 'bg-[#1871D8] text-white' : 'bg-(--ui-s1) text-(color:--ui-t2) hover:bg-(--ui-s3)'}`}>
                      {seg}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={save}
                className="flex-1 rounded-[12px] py-2.5 text-[13px] font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)' }}>
                Guardar
              </button>
              <button type="button" onClick={cancel}
                className="rounded-[12px] border border-(--ui-s3) px-5 py-2.5 text-[13px] font-semibold text-(color:--ui-t2)">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {audience.primary && (
              <p className="text-[13px] leading-relaxed text-(color:--ui-t2)">{audience.primary}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {audience.ageRange && (
                <div className="rounded-[14px] p-3" style={{ background: 'var(--ui-s1)' }}>
                  <p className="text-[10px] text-(color:--ui-t3) mb-0.5">Rango etario</p>
                  <p className="text-[13px] font-semibold text-(color:--ui-t1)">{audience.ageRange}</p>
                </div>
              )}
              {audience.coverage && (
                <div className="rounded-[14px] p-3" style={{ background: 'var(--ui-s1)' }}>
                  <p className="text-[10px] text-(color:--ui-t3) mb-0.5">Cobertura</p>
                  <p className="text-[13px] font-semibold text-(color:--ui-t1)">{audience.coverage}</p>
                </div>
              )}
            </div>
            {(audience.segments || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {audience.segments.map(seg => (
                  <span key={seg} className="rounded-full px-3 py-1 text-[12px] font-medium text-(color:--ui-t2)"
                    style={{ background: 'rgba(24,113,216,0.14)', border: '1px solid rgba(24,113,216,0.18)' }}>
                    {seg}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ── Activity Section ──────────────────────────────────── */
function ActivitySection({ activity }) {
  const metrics = [
    { label: 'Alianzas concretadas',   value: activity.alliancesCompleted,  color: '#10B981' },
    { label: 'Conversaciones activas', value: activity.activeConversations, color: '#3B82F6' },
    { label: 'T. respuesta prom.',     value: activity.avgResponseTime,     color: '#8B5CF6' },
    { label: 'Nivel de actividad',     value: activity.activityLevel,       color: '#F59E0B' },
  ];
  return (
    <SectionCard>
      <div className="px-5 pt-5 pb-5">
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-t3)">Actividad</p>
          <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-bold text-(color:--ui-t1)">Participación en la plataforma</p>
          <p className="mt-0.5 text-[12px] text-(color:--ui-t3)">Miembro desde {activity.joinDate}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="rounded-[16px] p-3.5" style={{ background: 'var(--ui-s1)' }}>
              <p className="text-[10px] text-(color:--ui-t3) mb-1">{m.label}</p>
              <p className="font-['Space_Grotesk'] text-[20px] font-bold" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
function CompanyProfile({ company, onAreaSelect, onSave, onOpenSettings }) {
  const [draft, setDraft]                       = useState(company);
  const [savedMessage, setSavedMessage]         = useState('');
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [generalSnapshot, setGeneralSnapshot]   = useState(null);
  const [imageGuide, setImageGuide]             = useState(null); // 'logo' | 'cover'

  /* ── New section state ── */
  const [workStyle, setWorkStyle] = useState({
    structure:    'Centralizada',
    approvalArea: 'Marketing',
    responseTime: '24-48 horas',
    modality:     'Equipo',
  });

  const [capabilities, setCapabilities] = useState([
    'redes', 'email', 'web', 'whatsapp',
  ]);

  const [audience, setAudience] = useState({
    primary:  'Jóvenes y profesionales interesados en moda e indumentaria',
    ageRange: '18-35',
    coverage: 'CABA y GBA',
    segments: ['Jóvenes 18-30', 'Profesionales'],
  });

  const TEAM_MEMBERS = [
    { id: 1, name: 'Agustín Orellano', role: 'Partnerships & Marketing', area: 'Comercial', isLead: true },
    { id: 2, name: 'María Gómez',      role: 'Brand Manager',            area: 'Marketing', isLead: false },
    { id: 3, name: 'Juan Pérez',       role: 'Trade Marketing',          area: 'Comercial', isLead: false },
  ];

  const activity = {
    joinDate:            'Enero 2025',
    alliancesCompleted:  3,
    activeConversations: 5,
    avgResponseTime:     '2 hs',
    activityLevel:       'Alta',
  };

  const logoInputRef    = useRef(null);
  const coverInputRef   = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    setDraft(company);
    setIsEditingGeneral(false);
  }, [company]);

  /* Track unsaved changes */
  const hasChanges = useMemo(() => {
    return (
      draft.name        !== company.name        ||
      draft.description !== company.description ||
      draft.logoImage   !== company.logoImage   ||
      (draft.coverImage ?? null) !== (company.coverImage ?? null) ||
      JSON.stringify(draft.gallery ?? [])        !== JSON.stringify(company.gallery ?? [])      ||
      JSON.stringify(draft.industries)           !== JSON.stringify(company.industries)           ||
      JSON.stringify(draft.location)             !== JSON.stringify(company.location)             ||
      JSON.stringify(draft.branches)             !== JSON.stringify(company.branches)             ||
      JSON.stringify(draft.socialLinks)          !== JSON.stringify(company.socialLinks)
    );
  }, [draft, company]);

  /* ── Updaters ── */
  const updateDraft           = (key, value) => setDraft((c) => ({ ...c, [key]: value }));
  const updateLocation        = (key, value) => setDraft((c) => ({ ...c, location: { ...c.location, [key]: value } }));
  const updateSocialLink      = (key, value) => setDraft((c) => ({ ...c, socialLinks: { ...c.socialLinks, [key]: value } }));
  /* ── Branch handlers ── */
  const handleAddBranch    = () => updateDraft('branches', [...draft.branches, { address: '', city: draft.location.city, country: draft.location.country }]);
  const handleChangeBranch = (i, k, v) => updateDraft('branches', draft.branches.map((b, idx) => idx === i ? { ...b, [k]: v } : b));
  const handleDeleteBranch = (i) => updateDraft('branches', draft.branches.filter((_, idx) => idx !== i));

  /* ── Logo upload ── */
  const handleLogoSelected = async (e) => {
    const [file] = Array.from(e.target.files || []);
    if (!file) return;
    const img = await readFileAsDataUrl(file);
    updateDraft('logoImage', img);
    setImageGuide(null);
  };

  /* ── Cover upload ── */
  const handleCoverSelected = async (e) => {
    const [file] = Array.from(e.target.files || []);
    if (!file) return;
    const img = await readFileAsDataUrl(file);
    updateDraft('coverImage', img);
    setImageGuide(null);
  };

  /* ── Gallery upload ── */
  const handleGallerySelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const imgs = await Promise.all(files.map(readFileAsDataUrl));
    updateDraft('gallery', [...(draft.gallery ?? []), ...imgs]);
    e.target.value = '';
  };

  const removeGalleryImage = (i) => {
    updateDraft('gallery', (draft.gallery ?? []).filter((_, idx) => idx !== i));
  };

  /* ── General (hero) section ── */
  const openGeneral = () => {
    setGeneralSnapshot(cloneValue({
      name: draft.name, description: draft.description, industries: draft.industries,
      location: draft.location, branches: draft.branches, socialLinks: draft.socialLinks,
      logoImage: draft.logoImage, coverImage: draft.coverImage ?? null,
    }));
    setIsEditingGeneral(true);
  };

  const cancelGeneral = () => {
    if (generalSnapshot) {
      setDraft((c) => ({ ...c, ...generalSnapshot }));
    }
    setIsEditingGeneral(false);
  };

  /* ── Global save ── */
  const handleSaveAll = () => {
    onSave(draft);
    setIsEditingGeneral(false);
    setSavedMessage('Cambios guardados ✓');
    window.setTimeout(() => setSavedMessage(''), 2200);
  };

  const slug = draft.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

  return (
    <div className="h-full bg-(--ui-page) pb-24 overflow-y-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
    {/* Columna acotada en pantallas anchas para que las cards no se estiren a todo el ancho */}
    <div className="mx-auto w-full max-w-3xl md:px-4 md:pt-4">

      {/* ──────────────── HERO CARD — flush edges en móvil, card en escritorio ──────────────── */}
      <div className="overflow-hidden rounded-b-[28px] bg-(--ui-card) md:rounded-[28px]" style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.05)" }}>

        {/* Cover strip — shows uploaded image or gradient fallback */}
        <div
          className="relative h-[100px] overflow-hidden"
          style={{ '--ui-t1': '#FFFFFF', '--ui-t2': 'rgba(255,255,255,0.85)', '--ui-s3': 'rgba(255,255,255,0.28)', ...(draft.coverImage ? {} : { background: 'var(--ui-cover)' }) }}
        >
          {draft.coverImage ? (
            <>
              <img
                alt="Portada"
                className="absolute inset-0 h-full w-full object-cover"
                src={draft.coverImage}
              />
              <div className="absolute inset-0 bg-black/25" />
            </>
          ) : (
            <>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#1871D8]/10 blur-2xl" />
              <div className="absolute -left-4 bottom-0 h-20 w-20 rounded-full bg-(--ui-s1) blur-xl" />
            </>
          )}
          {/* Portada button — always visible */}
          <button
            className="absolute bottom-3 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold text-(color:--ui-t2) backdrop-blur-sm transition hover:bg-(--ui-s3) hover:text-(color:--ui-t1)"
            onClick={() => setImageGuide('cover')}
            style={{ border: '1px solid var(--ui-s3)' }}
            type="button"
          >
            <Camera className="h-3 w-3" />
            {draft.coverImage ? 'Cambiar' : 'Portada'}
          </button>
        </div>

        {/* Logo + action row */}
        <div className="-mt-8 flex items-start justify-between px-5">
          {/* Logo */}
          <button
            className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full ring-[3px] ring-(--ui-card) transition focus:outline-none"
            onClick={() => setImageGuide('logo')}
            type="button"
          >
            {draft.logoImage ? (
              <img alt={draft.name} className="h-full w-full object-cover" src={draft.logoImage} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#455BE8]">
                <span className="font-['Space_Grotesk'] text-xl font-bold text-white">
                  {draft.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                </span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </button>

          {/* Hidden file inputs */}
          <input accept="image/*" className="hidden" onChange={handleLogoSelected} ref={logoInputRef} type="file" />
          <input accept="image/*" className="hidden" onChange={handleCoverSelected} ref={coverInputRef} type="file" />

          {/* Right actions */}
          <div className="flex items-center gap-2 pt-10">
            {/* Social icon buttons — only platforms with a URL (exclude website from icons) */}
            {!isEditingGeneral && socialPlatforms
              .filter((p) => p.isAsset && draft.socialLinks?.[p.key])
              .map((p) => (
                <a
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-(--ui-s2) transition hover:bg-(--ui-s3)"
                  href={draft.socialLinks[p.key]}
                  key={p.key}
                  rel="noreferrer"
                  target="_blank"
                  title={p.label}
                >
                  <img alt={p.label} className="h-4 w-4 rounded-sm object-cover" src={p.icon} />
                </a>
              ))}

            {/* Settings gear */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-(--ui-s2) text-(color:--ui-t2) transition hover:bg-(--ui-s3) hover:text-(color:--ui-t1)"
              onClick={onOpenSettings}
              title="Ajustes"
              type="button"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>

            {/* Edit — icon-only circle, no text */}
            {!isEditingGeneral && (
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-(color:--ui-t2) transition hover:bg-(--ui-s3) hover:text-white"
                onClick={openGeneral}
                style={{ border: '1px solid var(--ui-s3)' }}
                title="Editar perfil"
                type="button"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── VIEW MODE ── */}
        {!isEditingGeneral && (
          <div className="px-5 pb-5 pt-3">
            <h1 className="font-['Space_Grotesk'] text-[22px] font-bold leading-tight text-(color:--ui-t1)">
              {draft.name}
            </h1>
            <p className="mt-0.5 text-[11px] text-(color:--ui-t3)">@{slug}</p>
            {draft.description && (
              <p className="mt-2 text-[13px] leading-relaxed text-(color:--ui-t2)">{draft.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-(color:--ui-t2)">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {draft.location.city}, {draft.location.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {draft.branches.length} sucursal{draft.branches.length !== 1 ? 'es' : ''}
              </span>
              {draft.industries[0] && <span>{draft.industries[0]}</span>}
            </div>
            {/* Website text link — only when URL exists */}
            {draft.socialLinks?.website && (
              <a
                className="mt-3 flex items-center gap-1.5 text-[12px] text-(color:--ui-accent-text)/80 transition hover:text-(color:--ui-accent-text)"
                href={draft.socialLinks.website}
                rel="noreferrer"
                target="_blank"
              >
                <Globe className="h-3.5 w-3.5" />
                {draft.socialLinks.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        )}

        {/* ── EDIT MODE (inline within hero) ── */}
        <AnimatePresence>
          {isEditingGeneral && (
            <motion.div
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="space-y-4 px-5 pb-6 pt-3">
                {/* Name + description */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DarkField label="Nombre" value={draft.name} onChange={(v) => updateDraft('name', v)} placeholder="Nombre de tu empresa" />
                  <DarkField label="Descripción" value={draft.description} onChange={(v) => updateDraft('description', v)} placeholder="Descripción breve de tu marca" multiline />
                </div>

                {/* Industry */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-(color:--ui-t3)">
                    Rubro
                  </label>
                  <TagSelector
                    label=""
                    onChange={(v) => updateDraft('industries', v)}
                    options={INDUSTRY_OPTIONS}
                    placeholder="Agregar rubro"
                    selected={draft.industries}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-3">
                  <DarkField label="Ciudad" value={draft.location.city} onChange={(v) => updateLocation('city', v)} placeholder="Ciudad" />
                  <DarkField label="País"   value={draft.location.country} onChange={(v) => updateLocation('country', v)} placeholder="País" />
                </div>

                {/* Redes sociales — all 4 platforms in one loop (includes website) */}
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(color:--ui-t3)">Redes sociales</p>
                  {socialPlatforms.map((p) => (
                    <div className="flex items-center gap-3" key={p.key}>
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                        style={{ background: 'var(--ui-s2)' }}
                      >
                        {p.isAsset ? (
                          <img alt={p.label} className="h-4 w-4 rounded-sm" src={p.icon} />
                        ) : (
                          <Globe className="h-4 w-4 text-(color:--ui-t2)" />
                        )}
                      </div>
                      <input
                        className="flex-1 rounded-[12px] px-3.5 py-2.5 text-[13px] outline-none transition placeholder:text-(color:--ui-t3) focus:ring-2 focus:ring-[#1871D8]/40"
                        onChange={(e) => updateSocialLink(p.key, e.target.value)}
                        placeholder={p.key === 'website' ? 'https://tusitio.com' : `URL de ${p.label}`}
                        style={{
                          background: 'var(--ui-s2)',
                          border: '1px solid var(--ui-s2)',
                          color: 'white',
                        }}
                        value={draft.socialLinks?.[p.key] || ''}
                      />
                    </div>
                  ))}
                </div>

                {/* Branches */}
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-(color:--ui-t3)">Sucursales</p>
                  <BranchManager
                    branches={draft.branches}
                    onAddBranch={handleAddBranch}
                    onChangeBranch={handleChangeBranch}
                    onDeleteBranch={handleDeleteBranch}
                    dark
                  />
                </div>

                {/* Edit mode actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-[14px] py-3 text-[13px] font-bold text-white transition"
                    onClick={handleSaveAll}
                    style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}
                    type="button"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Guardar
                  </button>
                  <button
                    className="flex items-center gap-1.5 rounded-[14px] px-5 py-3 text-[13px] font-semibold text-(color:--ui-t2) transition hover:bg-(--ui-s2) hover:text-(color:--ui-t1)"
                    onClick={cancelGeneral}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Instagram Feed (si existe) ── */}
      {company.instagramData && (
        <div className="mx-4 mt-3 overflow-hidden rounded-[24px]" style={CARD_DARK}>
          <div className="py-5">
            <InstagramFeedProfile data={company.instagramData} />
          </div>
        </div>
      )}

      {/* ── Equipo ── */}
      <TeamSection members={TEAM_MEMBERS} />

      {/* ── Forma de Trabajo ── */}
      <WorkStyleSection workStyle={workStyle} onChange={setWorkStyle} />

      {/* ── Capacidades de Activación ── */}
      <CapabilitiesSection capabilities={capabilities} onChange={setCapabilities} />

      {/* ── Audiencia ── */}
      <AudienceSection audience={audience} onChange={setAudience} />

      {/* ──────────────── MI GALERÍA ──────────────── */}
      <div className="mx-4 mt-3 overflow-hidden rounded-[24px]" style={{ background: 'var(--ui-card)', border: '1px solid var(--ui-s2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(color:--ui-t2)">Mi galería</p>
            <p className="mt-0.5 text-[11px] text-(color:--ui-t3)">Imágenes propias de tu marca</p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-full bg-(--ui-s2) px-3 py-1.5 text-[11px] font-semibold text-(color:--ui-t2) transition hover:bg-(--ui-s3) active:scale-95"
            onClick={() => galleryInputRef.current?.click()}
            type="button"
          >
            <Plus className="h-3 w-3" />
            Agregar
          </button>
        </div>

        {/* Grid or empty state */}
        {(draft.gallery?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-3 gap-2 px-5 pb-5">
            {(draft.gallery ?? []).map((img, i) => (
              <div className="group relative aspect-square overflow-hidden rounded-[12px] bg-(--ui-s1)" key={i}>
                <img alt="" className="h-full w-full object-cover transition group-hover:scale-105" src={img} />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                <button
                  className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
                  onClick={() => removeGalleryImage(i)}
                  type="button"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 pb-5">
            <button
              className="flex w-full flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-white/12 py-8 transition hover:border-[#1871D8]/45 hover:bg-[#1871D8]/8 active:scale-[0.99]"
              onClick={() => galleryInputRef.current?.click()}
              type="button"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--ui-s2)">
                <Camera className="h-5 w-5 text-(color:--ui-t2)" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-(color:--ui-t2)">Subí imágenes de tu marca</p>
                <p className="mt-0.5 text-[11px] text-(color:--ui-t3)">Se mostrarán en tu perfil y en los matches</p>
              </div>
            </button>
          </div>
        )}

        {/* Hidden multi-file input */}
        <input
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleGallerySelected}
          ref={galleryInputRef}
          type="file"
        />
      </div>

      {/* ── Actividad ── */}
      <ActivitySection activity={activity} />

      {/* ──────────────── MI PLAN ──────────────── */}
      <div
        className="mx-4 mt-4 overflow-hidden rounded-[24px]"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,32,0.92) 0%, rgba(8,20,46,0.88) 100%)',
          border: '1px solid var(--ui-s2)',
          boxShadow: 'inset 0 1px 0 var(--ui-s1), 0 8px 28px rgba(0,0,0,0.20)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(color:--ui-accent-text)">Tu plan</p>
            <p className="mt-1 font-['Space_Grotesk'] text-lg font-bold capitalize text-(color:--ui-t1)">
              {company.plan || 'Starter'}
            </p>
            <p className="mt-0.5 text-[11px] text-(color:--ui-t2)">
              {company.plan === 'scale'
                ? 'Acceso completo a todas las funciones'
                : company.plan === 'growth'
                  ? 'Matches ilimitados · 1 Boost mensual'
                  : 'Actualizá para desbloquear más funciones'}
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-[14px] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5"
            onClick={onOpenSettings}
            style={{ background: 'linear-gradient(135deg, #1871D8, #1459B0)', boxShadow: '0 4px 16px rgba(24,113,216,0.35)' }}
            type="button"
          >
            {company.plan === 'scale' ? <Crown className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
            {company.plan === 'scale' ? 'Premium' : 'Mejorar plan'}
          </button>
        </div>
      </div>

      {/* ──────────────── IMAGE GUIDE MODAL ──────────────── */}
      {imageGuide && (
        <ImageGuideModal
          type={imageGuide}
          onClose={() => setImageGuide(null)}
          onUpload={() => {
            setImageGuide(null);
            if (imageGuide === 'logo')  logoInputRef.current?.click();
            if (imageGuide === 'cover') coverInputRef.current?.click();
          }}
        />
      )}

      {/* ──────────────── STICKY SAVE ──────────────── */}
      {hasChanges && !isEditingGeneral && <StickySaveButton onClick={handleSaveAll} />}

      {/* ──────────────── TOAST ──────────────── */}
      <AnimatePresence>
        {savedMessage && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-[90px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#141E30] px-5 py-2.5 text-[13px] font-medium text-white shadow-lg"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
          >
            {savedMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}

export default CompanyProfile;
