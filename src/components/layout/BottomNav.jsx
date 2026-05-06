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
      className="fixed inset-x-0 bottom-0 z-50 bg-white/96 backdrop-blur-xl"
      style={{
        boxShadow: '0 -1px 0 rgba(0,0,0,0.08), 0 -6px 20px rgba(0,0,0,0.04)',
        // Extra top padding so the bubble has room to float above the nav edge
        paddingTop: '28px',
      }}
    >
      <div
        className="mx-auto grid max-w-4xl grid-cols-5 px-2 pb-[max(env(safe-area-inset-bottom),10px)]"
      >
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
              {/* ── Floating bubble ─────────────────────────────────────
                  Center sits 28px above the nav top edge (same as paddingTop).
                  layoutId makes Framer Motion spring-slide between tabs.
              ─────────────────────────────────────────────────────────── */}
              {isActive && (
                <motion.div
                  layoutId="nav-bubble"
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#0B412F]"
                  style={{
                    top: '-28px',
                    width: '54px',
                    height: '54px',
                    boxShadow:
                      '0 8px 26px rgba(11,65,47,0.45), 0 2px 8px rgba(11,65,47,0.22)',
                    zIndex: 60,
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                />
              )}

              {/* ── Icon ─────────────────────────────────────────────── */}
              <span
                className="relative flex items-center justify-center"
                style={{ width: '54px', height: '54px', marginTop: '-28px', zIndex: 61 }}
              >
                <Icon
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
              </span>

              {/* ── Label ────────────────────────────────────────────── */}
              <span
                className={`relative text-[10px] font-semibold leading-tight tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-[#0B412F]' : 'text-slate-400'
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
