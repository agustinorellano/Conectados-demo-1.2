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
    <nav
      className="fixed inset-x-0 bottom-0 z-50 backdrop-blur-xl"
      style={{
        background: 'rgba(13, 22, 36, 0.92)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -4px 32px rgba(20,30,48,0.5), 0 -1px 0 rgba(255,255,255,0.05)',
        paddingTop: '12px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-5 px-2 pb-[max(env(safe-area-inset-bottom),14px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;

          return (
            <button
              className="relative flex flex-col items-center gap-1 overflow-visible pb-1"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bubble"
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    top: '-12px',
                    width: '54px',
                    height: '54px',
                    background: 'linear-gradient(135deg, #243B55 0%, #35577D 100%)',
                    boxShadow:
                      '0 8px 26px rgba(59,130,246,0.35), 0 2px 8px rgba(20,30,48,0.4), 0 0 0 1px rgba(126,184,212,0.2)',
                    zIndex: 60,
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                />
              )}

              <span
                className="relative flex items-center justify-center"
                style={{ width: '54px', height: '54px', marginTop: '-12px', zIndex: 61 }}
              >
                <Icon
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
              </span>

              <span
                className={`relative text-[10px] font-semibold leading-tight tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-[#7EB8D4]' : 'text-slate-600'
                }`}
                style={{ zIndex: 61 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
