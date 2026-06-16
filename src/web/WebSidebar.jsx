import { motion } from 'framer-motion';
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  PanelsTopLeft,
  Settings
} from 'lucide-react';

const mainNav = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'alliances',  label: 'Match',      icon: BriefcaseBusiness },
  { id: 'chats',      label: 'Chats',      icon: MessageSquare },
  { id: 'workplace',  label: 'Workplace',  icon: PanelsTopLeft },
  { id: 'assistant',  label: 'Asistente',  icon: Bot },
  { id: 'profile',    label: 'Empresa',    icon: Building2 },
];

const bottomNav = [
  { id: 'pricing',  label: 'Planes',       icon: CreditCard },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const planLabel = { starter: 'Starter', growth: 'Growth', scale: 'Scale' };
const planColor  = { starter: '#3B82F6', growth: '#8B5CF6', scale: '#10B981' };

function WebSidebar({ activeView, onNavigate, userPlan, companyName }) {
  return (
    <aside
      className="flex h-full w-[220px] shrink-0 flex-col py-6"
      style={{
        background: 'linear-gradient(180deg, rgba(8,14,28,0.98) 0%, rgba(6,10,22,0.98) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo + company */}
      <div className="px-5 mb-7">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1871D8 0%, #0A3D7A 100%)' }}
          >
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white leading-tight">Conectados</p>
            <p className="truncate text-[11px] text-white/40 leading-tight mt-0.5">{companyName}</p>
          </div>
        </div>

        {/* Plan badge */}
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: planColor[userPlan] ?? '#3B82F6' }}
          />
          <span className="text-[11px] font-semibold text-white/55">
            Plan {planLabel[userPlan] ?? userPlan}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
              style={
                isActive
                  ? {
                      background: 'rgba(24,113,216,0.18)',
                      color: '#fff',
                    }
                  : { color: 'rgba(255,255,255,0.45)' }
              }
            >
              {isActive && (
                <motion.div
                  layoutId="web-nav-active"
                  className="absolute inset-0 rounded-[12px]"
                  style={{
                    background: 'rgba(24,113,216,0.15)',
                    border: '1px solid rgba(24,113,216,0.30)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.7}
                className="relative z-10 shrink-0"
                style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.35)' }}
              />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col gap-0.5 px-3 pt-3 border-t border-white/[0.07]">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
              style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.40)' }}
            >
              <Icon
                size={16}
                strokeWidth={1.7}
                className="shrink-0"
                style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.30)' }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default WebSidebar;
