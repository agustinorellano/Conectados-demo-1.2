import { motion } from 'framer-motion';
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Dashboard y Proyectos están ocultos por la simplificación de producto (las vistas siguen en App.jsx).
const navItems = [
  { id: 'profile',   label: 'Empresa',   icon: Building2 },
  { id: 'likes',     label: 'Likes',     icon: Heart },
  { id: 'alliances', label: 'Explorar',  icon: BriefcaseBusiness },
  { id: 'chats',     label: 'Chats',     icon: MessageSquare },
  { id: 'assistant', label: 'Asistente', icon: Bot },
];

function BottomNav({ activeView, onNavigate, likesCount = 0 }) {
  const { t } = useTheme();

  return (
    /* Marco inferior: barra anclada que ocupa su propio espacio (no flota sobre el contenido),
       así los botones de cada vista nunca chocan con el nav. */
    <div className="relative z-50 shrink-0">
      <nav
        className="flex w-full items-center justify-around rounded-t-[28px] px-2 pt-2"
        style={{
          background: t.navPill,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 -6px 24px rgba(0,0,0,0.18)',
          borderTop: `1px solid ${t.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          transition: 'background 0.3s ease',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center gap-[3px] rounded-[22px] px-3 py-2 transition-all duration-200"
              style={{ minWidth: 56 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-[22px]"
                  style={{ background: t.navPillActiveBg }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                size={21}
                strokeWidth={isActive ? 2.2 : 1.6}
                className="relative z-10 transition-colors duration-200"
                style={{ color: isActive ? t.navPillActive : t.navPillText }}
              />
              {item.id === 'likes' && likesCount > 0 && (
                <span
                  className="absolute right-2 top-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                  style={{ background: '#F43F5E' }}
                >
                  {likesCount}
                </span>
              )}
              <span
                className="relative z-10 text-[10px] font-semibold leading-none tracking-tight transition-colors duration-200"
                style={{ color: isActive ? t.navPillActiveSub : t.navPillText }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default BottomNav;
