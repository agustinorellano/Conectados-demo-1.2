import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Eye, Heart, LayoutGrid, List, MapPin, Sparkles, Star, Users, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'super', label: 'Super likes' },
  { id: 'like', label: 'Likes' },
];

const splitTags = (value = '') => value.split(',').map(tag => tag.trim()).filter(Boolean);

function KindBadge({ kind }) {
  return kind === 'super' ? (
    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
      style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
      <Sparkles size={10} /> <span className="hidden sm:inline">Super like</span>
    </span>
  ) : (
    <Heart size={13} style={{ color: '#F43F5E' }} fill="#F43F5E" />
  );
}

function Avatar({ company, size }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] text-[14px] font-extrabold text-white"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}
    >
      {company.gallery?.[0]
        ? <img src={company.gallery[0]} alt="" className="h-full w-full object-cover" />
        : company.logo}
    </div>
  );
}

/* Vista previa del cliente que dio el like */
function LikePreview({ item, onAccept, onDismiss, onClose }) {
  const { t } = useTheme();
  const { company, kind } = item;
  const cover = company.gallery?.[0];
  const photos = (company.instagramData?.feed?.length ? company.instagramData.feed : company.gallery || []).slice(0, 4);
  const sections = [
    { title: 'Qué ofrece', icon: Users, tags: splitTags(company.offer), color: '#455BE8' },
    { title: 'Qué busca', icon: Star, tags: splitTags(company.seeking), color: '#16A34A' },
    { title: 'Segmentos', icon: Users, tags: company.segments || [], color: '#8B5CF6' },
  ].filter(section => section.tags.length > 0);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px]"
      style={{ background: t.panelBg, border: `1px solid ${t.surfaceBorder}` }}>
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none]">
        <div className="relative h-52 shrink-0" style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
          {cover && <img src={cover} alt={company.name} className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,12,24,0.6), transparent 60%)' }} />
          {onClose && (
            <button type="button" aria-label="Cerrar" onClick={onClose}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              <X size={16} />
            </button>
          )}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-['Space_Grotesk'] text-[22px] font-bold text-white">{company.name}</h2>
                <KindBadge kind={kind} />
              </div>
              <p className="flex items-center gap-1 text-[12px] text-white/80">
                <MapPin size={11} /> {company.location} · {company.sector}
              </p>
            </div>
            <div className="shrink-0 rounded-[12px] px-3 py-1.5 text-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <p className="text-[18px] font-extrabold leading-none text-white">{company.synergyFromThem}%</p>
              <p className="text-[9px] text-white/70">sinergia</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {(company.proposal || company.headline) && (
            <div className="rounded-[16px] p-3.5" style={{ background: t.accentActive, border: `1px solid ${t.accentBorder}` }}>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: t.accentMid }}>Propuesta</p>
              <p className="text-[13px] leading-relaxed" style={{ color: t.text1 }}>{company.proposal || company.headline}</p>
            </div>
          )}

          {sections.map(({ title, icon: Icon, tags, color }) => (
            <div key={title}>
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: t.text3 }}>
                <Icon size={11} /> {title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}

          {photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-[12px]">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-3 p-4" style={{ borderTop: `1px solid ${t.surfaceBorder}` }}>
        <button type="button" onClick={() => onDismiss(company.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-[14px] py-3 text-[14px] font-semibold transition hover:opacity-80"
          style={{ background: t.surface2, color: t.text2 }}>
          <X size={16} /> Pasar
        </button>
        <button type="button" onClick={() => onAccept(company)}
          className="flex flex-[1.4] items-center justify-center gap-2 rounded-[14px] py-3 text-[14px] font-bold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)' }}>
          <Check size={16} /> Conectar
        </button>
      </div>
    </div>
  );
}

/* Tarjeta (modo tarjetas): portada, datos y acciones; el clic abre la vista previa */
function LikeCard({ item, onOpen, onAccept, onDismiss }) {
  const { t } = useTheme();
  const { company, kind } = item;
  const cover = company.gallery?.[0];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col overflow-hidden rounded-[22px]"
      style={{ background: t.surface, border: `1px solid ${t.surfaceBorder}` }}
    >
      <button type="button" onClick={onOpen} aria-label={`Ver vista previa de ${company.name}`}
        className="relative block aspect-[4/3] w-full overflow-hidden text-left"
        style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}>
        {cover
          ? <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          : <span className="absolute inset-0 flex items-center justify-center text-[36px] font-black text-white/40">{company.logo}</span>}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,12,24,0.45), transparent 55%)' }} />
        <div className="absolute left-2.5 top-2.5"><KindBadge kind={kind} /></div>
        <span className="absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          {company.synergyFromThem}%
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold" style={{ color: t.text1 }}>{company.name}</p>
          <p className="truncate text-[12px]" style={{ color: t.text3 }}>{company.sector} · {company.location}</p>
        </div>
        <div className="mt-auto flex items-center gap-1.5">
          <button type="button" onClick={onOpen}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[12px] font-semibold transition hover:opacity-80"
            style={{ background: t.accentActive, color: t.accentMid }}>
            <Eye size={13} /> Ver perfil
          </button>
          <button type="button" aria-label={`Pasar ${company.name}`} onClick={() => onDismiss(company.id)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:opacity-80"
            style={{ background: t.surface2, color: t.text2 }}>
            <X size={14} />
          </button>
          <button type="button" aria-label={`Conectar con ${company.name}`} onClick={() => onAccept(company)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)' }}>
            <Check size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LikesView({ likes, onAccept, onDismiss }) {
  const { t } = useTheme();
  const [filter, setFilter] = useState('all');
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('likes-view-mode') === 'cards' ? 'cards' : 'rows'; } catch { return 'rows'; }
  });
  const changeMode = (next) => {
    setMode(next);
    try { localStorage.setItem('likes-view-mode', next); } catch { /* sin storage */ }
  };
  const [selectedId, setSelectedId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const visible = likes.filter((item) => filter === 'all' || item.kind === filter);
  const superCount = likes.filter((item) => item.kind === 'super').length;
  const selected = visible.find((item) => item.company.id === selectedId) ?? visible[0] ?? null;

  // Si el seleccionado desaparece (aceptado/descartado/filtrado), cerramos la hoja móvil
  useEffect(() => {
    if (!selected) setSheetOpen(false);
  }, [selected]);

  const select = (id) => { setSelectedId(id); setSheetOpen(true); };
  const handleAccept = (company) => { setSheetOpen(false); onAccept(company); };
  const handleDismiss = (id) => { setSheetOpen(false); onDismiss(id); };

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5 shrink-0">
        <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: t.text1 }}>
          Likes pendientes
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: t.text3 }}>
          {likes.length === 0
            ? 'Cuando otra empresa te dé like, aparecerá acá.'
            : `${likes.length} empresas quieren conectar con vos · ${superCount} super likes`}
        </p>
      </header>

      <div className="mb-4 flex shrink-0 flex-wrap items-center gap-2">
        {FILTERS.map((item) => {
          const active = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition"
              style={{
                background: active ? t.accentActive : t.surface,
                color: active ? t.navTextActive : t.text2,
                border: `1px solid ${active ? t.accentBorder : t.surfaceBorder}`,
              }}
            >
              {item.label}
            </button>
          );
        })}

        {/* Selector de vista: filas / tarjetas */}
        <div className="ml-auto flex rounded-full p-0.5" role="group" aria-label="Tipo de vista"
          style={{ background: t.surface2, border: `1px solid ${t.surfaceBorder}` }}>
          {[{ id: 'rows', label: 'Filas', Icon: List }, { id: 'cards', label: 'Tarjetas', Icon: LayoutGrid }].map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => changeMode(id)} aria-pressed={mode === id} title={label}
              className="flex h-8 w-9 items-center justify-center rounded-full transition"
              style={mode === id ? { background: t.panelBg, color: t.accentMid, boxShadow: '0 1px 3px rgba(15,23,42,0.15)' } : { color: t.text3 }}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {mode === 'cards' ? (
        <div className="min-h-0 flex-1 overflow-y-auto pb-4 [scrollbar-width:none]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            <AnimatePresence initial={false}>
              {visible.map((item) => (
                <LikeCard key={item.company.id} item={item}
                  onOpen={() => select(item.company.id)} onAccept={handleAccept} onDismiss={handleDismiss} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ── Lista ── */}
        <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto pb-4 [scrollbar-width:none]">
          <AnimatePresence initial={false}>
            {visible.map((item) => {
              const { company, kind } = item;
              const isSelected = selected?.company.id === company.id;
              return (
                <motion.div
                  key={company.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.18 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => select(company.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') select(company.id); }}
                  className="flex shrink-0 cursor-pointer items-center gap-3 rounded-[20px] p-3 transition"
                  style={{
                    background: isSelected ? t.accentActive : t.surface,
                    border: `1px solid ${isSelected ? t.accentBorder : t.surfaceBorder}`,
                  }}
                >
                  <Avatar company={company} size={48} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[15px] font-bold" style={{ color: t.text1 }}>{company.name}</p>
                      <KindBadge kind={kind} />
                    </div>
                    <p className="truncate text-[12px]" style={{ color: t.text3 }}>
                      {company.sector} · {company.location}
                    </p>
                  </div>

                  <p className="hidden shrink-0 text-[15px] font-extrabold sm:block" style={{ color: t.accentMid }}>
                    {company.synergyFromThem}%
                  </p>

                  <div className="flex shrink-0 gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      aria-label={`Ver vista previa de ${company.name}`}
                      title="Vista previa"
                      onClick={() => select(company.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:opacity-80 lg:hidden"
                      style={{ background: t.accentActive, color: t.accentMid }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Pasar ${company.name}`}
                      onClick={() => handleDismiss(company.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:opacity-80"
                      style={{ background: t.surface, border: `1px solid ${t.surfaceBorder}`, color: t.text2 }}
                    >
                      <X size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Conectar con ${company.name}`}
                      onClick={() => handleAccept(company)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #455BE8, #2F43C8)' }}
                    >
                      <Check size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Vista previa (escritorio) ── */}
        <div className="hidden min-h-0 pb-4 lg:block">
          {selected && (
            <LikePreview key={selected.company.id} item={selected} onAccept={handleAccept} onDismiss={handleDismiss} />
          )}
        </div>
      </div>
      )}

      {/* ── Vista previa en ventana: hoja inferior en pantallas chicas y diálogo en escritorio (modo tarjetas).
          En modo filas + escritorio ya hay panel lateral, así que solo se usa en pantallas chicas. ── */}
      <AnimatePresence>
        {sheetOpen && selected && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:items-center ${mode === 'rows' ? 'lg:hidden' : ''}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              className="h-[88dvh] w-full lg:h-[82vh] lg:max-w-xl lg:px-0"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LikePreview item={selected} onAccept={handleAccept} onDismiss={handleDismiss} onClose={() => setSheetOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LikesView;
