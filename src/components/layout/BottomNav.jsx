import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  MessageSquare,
  PanelsTopLeft,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { id: 'profile',   label: 'Empresa',   icon: Building2 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alliances', label: 'Explorar',   icon: BriefcaseBusiness },
  { id: 'chats',     label: 'Chats',     icon: MessageSquare },
  { id: 'workplace', label: 'Proyectos', icon: PanelsTopLeft },
];

function BottomNav({ activeView, onNavigate }) {
  const { t } = useTheme();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center"
      style={{
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
        paddingLeft: '14px',
        paddingRight: '14px',
      }}
    >
      {/* Main nav pill */}
      <nav
        className="flex w-full items-center justify-around rounded-[32px] px-2 py-2"
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
