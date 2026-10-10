import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart, Sparkles, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'super', label: 'Super likes' },
  { id: 'like', label: 'Likes' },
];

function LikesView({ likes, onAccept, onDismiss }) {
  const { t } = useTheme();
  const [filter, setFilter] = useState('all');

  const visible = likes.filter((item) => filter === 'all' || item.kind === filter);
  const superCount = likes.filter((item) => item.kind === 'super').length;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: t.text1 }}>
          Likes pendientes
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: t.text3 }}>
          {likes.length === 0
            ? 'Cuando otra empresa te dé like, aparecerá acá.'
            : `${likes.length} empresas quieren conectar con vos · ${superCount} super likes`}
        </p>
      </header>

      <div className="mb-5 flex gap-2">
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
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {visible.map(({ company, kind }) => (
            <motion.div
              key={company.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-3 rounded-[20px] p-3 sm:gap-4 sm:p-4"
              style={{ background: t.surface, border: `1px solid ${t.surfaceBorder}` }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] sm:h-14 sm:w-14 sm:rounded-[16px] text-[15px] font-extrabold text-white"
                style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}
              >
                {company.logo}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-bold" style={{ color: t.text1 }}>
                    {company.name}
                  </p>
                  {kind === 'super' ? (
                    <span
                      className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
                    >
                      <Sparkles size={10} /> <span className="hidden sm:inline">Super like</span>
                    </span>
                  ) : (
                    <Heart size={13} style={{ color: '#F43F5E' }} fill="#F43F5E" />
                  )}
                </div>
                <p className="truncate text-[12px]" style={{ color: t.text3 }}>
                  {company.sector} · {company.size} · {company.location}
                </p>
                <p className="mt-1 line-clamp-1 text-[12px]" style={{ color: t.text2 }}>
                  {company.headline}
                </p>
              </div>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[18px] font-extrabold" style={{ color: t.accentMid }}>
                  {company.synergyFromThem}%
                </p>
                <p className="text-[10px]" style={{ color: t.text3 }}>sinergia</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label={`Pasar ${company.name}`}
                  onClick={() => onDismiss(company.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-80"
                  style={{ background: t.surface, border: `1px solid ${t.surfaceBorder}`, color: t.text2 }}
                >
                  <X size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Conectar con ${company.name}`}
                  onClick={() => onAccept(company)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1871D8, #0A3D7A)' }}
                >
                  <Check size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LikesView;
