import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  MessageSquare,
  Moon,
  PanelsTopLeft,
  Sun,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { id: 'profile',   label: 'Empresa',   icon: Building2 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alliances', label: 'Match',     icon: BriefcaseBusiness },
  { id: 'chats',     label: 'Chats',     icon: MessageSquare },
  { id: 'workplace', label: 'Workplace', icon: PanelsTopLeft },
];

function BottomNav({ activeView, onNavigate }) {
  const { t, theme, toggleTheme } = useTheme();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-between"
      style={{
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
        paddingLeft: '14px',
        paddingRight: '14px',
      }}
    >
      {/* Theme toggle — floats to the left of the nav pill */}
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileTap={{ scale: 0.88 }}
        className="mb-[2px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: t.navPill,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: t.navPillShadow,
        }}
      >
        <motion.div
          key={theme}
          initial={{ scale: 0.6, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {theme === 'dark'
            ? <Sun size={18} strokeWidth={1.8} style={{ color: t.text2 }} />
            : <Moon size={18} strokeWidth={1.8} style={{ color: t.text2 }} />
          }
        </motion.div>
      </motion.button>

      {/* Main nav pill */}
      <nav
        className="flex flex-1 ml-3 items-center justify-around rounded-[32px] px-2 py-2"
        style={{
          background: t.navPill,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: t.navPillShadow,
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
