import { BookOpen, Bot, CreditCard } from 'lucide-react';

const utilityItems = [
  { id: 'assistant', label: 'Asesor IA',   icon: Bot },
  { id: 'help',      label: 'Help Center',  icon: BookOpen },
  { id: 'pricing',   label: 'Pricing',      icon: CreditCard },
];

const titles = {
  profile:    'Mi Empresa',
  dashboard:  'Dashboard',
  alliances:  'Matchmaking',
  chats:      'Chats',
  workplace:  'Workplace',
  assistant:  'Asesor IA',
  help:       'Help Center',
  pricing:    'Pricing',
};

function AppHeader({ activeView, onNavigate, userPlan }) {
  return (
    <header
      className="sticky top-0 z-40 h-16 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(20,30,48,0.97) 0%, rgba(36,59,85,0.94) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(20,30,48,0.18)',
      }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 sm:px-6">

        {/* Left: eyebrow + title */}
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7EB8D4] leading-none">
            Data Plus
          </p>
          <h1 className="truncate font-['Space_Grotesk'] text-[18px] font-bold leading-tight tracking-tight text-white">
            {titles[activeView] || 'Data Plus'}
          </h1>
        </div>

        {/* Right: utility icons (sm+) + DP avatar */}
        <div className="ml-3 flex shrink-0 items-center gap-2">

          {/* Utility icons — only on sm+ screens */}
          {utilityItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                className="hidden h-8 w-8 items-center justify-center rounded-[11px] transition-all duration-200 sm:inline-flex"
                style={{
                  background: isActive ? 'rgba(126,184,212,0.18)' : 'rgba(255,255,255,0.07)',
                  border: isActive ? '1px solid rgba(126,184,212,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  color: isActive ? '#7EB8D4' : 'rgba(255,255,255,0.55)',
                }}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}

          {/* Plan badge — hidden on xs, shown on sm+ */}
          <span
            className="hidden rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize text-white/75 sm:block"
            style={{
              background: 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {userPlan}
          </span>

          {/* DP avatar — always visible */}
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] text-[11px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #243B55, #35577D)',
              boxShadow: '0 2px 10px rgba(20,30,48,0.4), 0 0 0 1px rgba(126,184,212,0.12)',
            }}
          >
            DP
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
