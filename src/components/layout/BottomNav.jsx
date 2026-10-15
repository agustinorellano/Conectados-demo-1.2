import { AnimatePresence, motion } from 'framer-motion';
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
  { id: 'profile',   label: 'Mi Empresa', icon: Building2 },
  { id: 'likes',     label: 'Likes',      icon: Heart },
  { id: 'alliances', label: 'Explorar',   icon: BriefcaseBusiness },
  { id: 'chats',     label: 'Chats',      icon: MessageSquare },
  { id: 'assistant', label: 'Asistente',  icon: Bot },
];

const spring = { type: 'spring', stiffness: 460, damping: 36, mass: 0.7 };

/**
 * Isla dinámica inferior con efecto "liquid glass" (estilo iOS).
 * Flota sobre el contenido, translúcida: la sección activa se expande con su nombre y las demás quedan como íconos.
 * Cada vista reserva espacio abajo para que nada quede tapado (ver App.jsx).
 */
function BottomNav({ activeView, onNavigate, likesCount = 0 }) {
  const { t } = useTheme();
  const dark = t.isDark;

  const glass = dark
    ? {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow:
          '0 14px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.40), inset 0 -1px 0 rgba(255,255,255,0.06)',
      }
    : {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.46) 100%)',
        border: '1px solid rgba(255,255,255,0.75)',
        boxShadow:
          '0 14px 36px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(15,23,42,0.05)',
      };

  const idleColor   = dark ? 'rgba(255,255,255,0.78)' : '#515257';
  const activeColor = dark ? '#FFFFFF' : '#1D1D1F';
  const capsule     = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <motion.nav
        layout
        transition={spring}
        aria-label="Navegación principal"
        className="pointer-events-auto flex max-w-full items-center gap-0.5 rounded-full p-1.5"
        style={{
          ...glass,
          backdropFilter: 'blur(26px) saturate(190%)',
          WebkitBackdropFilter: 'blur(26px) saturate(190%)',
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
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-3"
              style={{ color: isActive ? activeColor : idleColor }}
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-active"
                  transition={spring}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: capsule,
                    boxShadow: dark
                      ? 'inset 0 1px 0 rgba(255,255,255,0.35)'
                      : '0 2px 8px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,1)',
                  }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.id === 'likes' && likesCount > 0 && (
                  <span
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                    style={{ background: '#F43F5E' }}
                  >
                    {likesCount}
                  </span>
                )}
              </span>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap text-[12px] font-semibold leading-none"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}

export default BottomNav;
