import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  MessageSquare,
  PanelsTopLeft
} from 'lucide-react';

const navItems = [
  { id: 'profile',   label: 'Empresa',   icon: Building2 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alliances', label: 'Match',     icon: BriefcaseBusiness },
  { id: 'chats',     label: 'Chats',     icon: MessageSquare },
  { id: 'workplace', label: 'Workplace', icon: PanelsTopLeft },
];

function BottomNav({ activeView, onNavigate }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
      style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))', paddingLeft: '14px', paddingRight: '14px' }}
    >
      {/* Liquid glass pill */}
      <nav
        className="flex w-full max-w-lg items-center justify-around rounded-[32px] px-2 py-2"
        style={{
          background: 'rgba(22,24,28,0.82)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow:
            '0 12px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.07)',
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
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-[22px]"
                  style={{
                    background: 'rgba(255,255,255,0.11)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.10)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                size={21}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/35'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-semibold leading-none tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/35'
                }`}
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
