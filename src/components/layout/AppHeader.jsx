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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/88 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1871D8]">
              Data Plus
            </p>
            <h1 className="truncate font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              {titles[activeView] || 'Data Plus'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#1871D8]/10 px-3 py-2 text-xs font-semibold capitalize text-[#1871D8]">
              Plan {userPlan}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1871D8] to-[#0B412F] text-sm font-bold text-white shadow-sm">
              DP
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {utilityItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  activeView === item.id
                    ? 'border-[#1871D8]/20 bg-[#1871D8]/10 text-[#1871D8]'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-[#0B412F]'
                }`}
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
