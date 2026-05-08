import { motion } from 'framer-motion';
import { ExternalLink, Heart, MessageCircle, TrendingUp } from 'lucide-react';

/* ── SVG Instagram logo inline (no dep needed) ── */
function IgIcon({ size = 14, className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8" width="20" x="2" y="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}

function formatCount(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/* ─────────────────────────────────────────────────────────────
   COMPACT STRIP — 3 images inside a match card's glass panel
───────────────────────────────────────────────────────────── */
function CompactStrip({ data }) {
  const imgs = data.feed.slice(0, 3);
  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-1.5 mb-2">
        <IgIcon size={11} className="text-white/45" />
        <span className="text-[10px] font-medium text-white/40">@{data.handle}</span>
        <span className="ml-auto text-[9px] text-white/25">{formatCount(data.followers)} seg.</span>
      </div>
      <div className="flex gap-1.5">
        {imgs.map((src, i) => (
          <motion.div
            key={i}
            className="relative h-[62px] w-[62px] overflow-hidden rounded-[10px]"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.18 }}
          >
            <img
              alt={`post-${i}`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={src}
            />
            {/* hover overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{ background: 'rgba(0,0,0,0.38)' }}
            >
              <Heart className="h-3 w-3 text-white" />
            </motion.div>
          </motion.div>
        ))}
        {/* "+más" tile */}
        <div
          className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-[10px]"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-[9px] font-semibold text-white/35">+{data.postsCount - 3}</span>
          <span className="text-[8px] text-white/25 mt-0.5">posts</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL SECTION — inside CompanyDetailModal (light bg)
───────────────────────────────────────────────────────────── */
function ModalSection({ data }) {
  const imgs = data.feed.slice(0, 6);
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
            <IgIcon size={13} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Instagram
            </p>
            <p className="text-[12px] font-semibold text-slate-600">@{data.handle}</p>
          </div>
        </div>
        {data.url && (
          <a
            className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-200"
            href={data.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-3 w-3" />
            Ver
          </a>
        )}
      </div>

      {/* Stats row */}
      <div className="mb-3 flex gap-3">
        {[
          { label: 'Seguidores', value: formatCount(data.followers) },
          { label: 'Publicaciones', value: formatCount(data.postsCount) },
          { label: 'Engagement', value: `${data.engagementRate}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 rounded-[12px] bg-slate-50 px-3 py-2.5 text-center"
          >
            <p className="text-[13px] font-bold text-[#1A1A1A]">{stat.value}</p>
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feed grid 3×2 */}
      <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
        {imgs.map((src, i) => (
          <motion.div
            key={i}
            className="relative aspect-square overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.18 }}
          >
            <img
              alt={`post-${i}`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={src}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{ background: 'rgba(0,0,0,0.42)' }}
            >
              <Heart className="h-3.5 w-3.5 text-white" />
              <MessageCircle className="h-3.5 w-3.5 text-white" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROFILE SECTION — inside ProfileView (white card, light bg)
───────────────────────────────────────────────────────────── */
function ProfileSection({ data }) {
  const imgs = data.feed.slice(0, 6);
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            }}
          >
            <IgIcon size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Instagram</p>
            <p className="text-[12px] font-semibold text-[#1A1A1A]">@{data.handle}</p>
          </div>
        </div>
        {data.url && (
          <a
            className="flex items-center gap-1.5 rounded-full bg-[#141E30] px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={data.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-3 w-3" />
            Ver Instagram
          </a>
        )}
      </div>

      {/* Stats chips */}
      <div className="flex gap-2.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
        {[
          { icon: null, label: 'Seguidores', value: formatCount(data.followers), accent: '#1871D8' },
          { icon: null, label: 'Publicaciones', value: formatCount(data.postsCount), accent: '#141E30' },
          { icon: TrendingUp, label: 'Engagement', value: `${data.engagementRate}%`, accent: '#059669' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="shrink-0 rounded-[14px] px-4 py-3"
              style={{ background: `${stat.accent}10`, border: `1px solid ${stat.accent}18` }}
            >
              <div className="flex items-center gap-1.5">
                {Icon && <Icon className="h-3 w-3" style={{ color: stat.accent }} />}
                <p className="text-[15px] font-bold" style={{ color: stat.accent }}>{stat.value}</p>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Feed grid 3×2 */}
      <div className="grid grid-cols-3 gap-[3px] px-5">
        {imgs.map((src, i) => (
          <motion.div
            key={i}
            className="relative aspect-square overflow-hidden rounded-[12px]"
            whileHover={{ scale: 1.04, zIndex: 2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ zIndex: 1 }}
          >
            <img
              alt={`post-${i}`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={src}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-2 rounded-[12px]"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{ background: 'rgba(0,0,0,0.42)' }}
            >
              <Heart className="h-4 w-4 text-white drop-shadow" />
              <MessageCircle className="h-4 w-4 text-white drop-shadow" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PUBLIC API
───────────────────────────────────────────────────────────── */
export function InstagramFeedCompact({ data }) {
  if (!data?.feed?.length) return null;
  return <CompactStrip data={data} />;
}

export function InstagramFeedModal({ data }) {
  if (!data?.feed?.length) return null;
  return <ModalSection data={data} />;
}

export function InstagramFeedProfile({ data }) {
  if (!data?.feed?.length) return null;
  return <ProfileSection data={data} />;
}
