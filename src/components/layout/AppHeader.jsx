import { BookOpen, Bot, CreditCard } from 'lucide-react';

const utilityItems = [
  { id: 'assistant', label: 'Asesor IA', icon: Bot },
  { id: 'help', label: 'Help Center', icon: BookOpen },
  { id: 'pricing', label: 'Pricing', icon: CreditCard }
];

const titles = {
  profile: 'Mi Empresa',
  dashboard: 'Dashboard',
  alliances: 'Matchmaking',
  chats: 'Chats',
  workplace: 'Workplace',
  assistant: 'Asesor IA',
  help: 'Help Center',
  pricing: 'Pricing'
};

function AppHeader({ activeView, onNavigate, userPlan }) {
  return (
    <header
      className="sticky top-0 z-40 px-4 py-4 backdrop-blur-xl sm:px-6"
      style={{
        background: 'linear-gradient(135deg, rgba(20,30,48,0.97) 0%, rgba(36,59,85,0.94) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(20,30,48,0.18)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#7EB8D4]">
              Data Plus
            </p>
            <h1 className="truncate font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white">
              {titles[activeView] || 'Data Plus'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1.5 text-xs font-semibold capitalize text-white/80"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Plan {userPlan}
            </span>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #243B55, #35577D)',
                boxShadow: '0 4px 14px rgba(20,30,48,0.4), 0 0 0 1px rgba(126,184,212,0.15)',
              }}
            >
              DP
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {utilityItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all duration-200"
                style={{
                  background: isActive
                    ? 'rgba(126,184,212,0.15)'
                    : 'rgba(255,255,255,0.07)',
                  border: isActive
                    ? '1px solid rgba(126,184,212,0.3)'
                    : '1px solid rgba(255,255,255,0.1)',
                  color: isActive ? '#7EB8D4' : 'rgba(255,255,255,0.6)',
                  boxShadow: isActive ? '0 0 12px rgba(126,184,212,0.15)' : 'none',
                }}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
