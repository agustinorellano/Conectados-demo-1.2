import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  MessageSquare,
  PanelsTopLeft
} from 'lucide-react';

const navItems = [
  { id: 'profile', label: 'Empresa', icon: Building2 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alliances', label: 'Match', icon: BriefcaseBusiness },
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'workplace', label: 'Workplace', icon: PanelsTopLeft }
];

function BottomNav({ activeView, onNavigate }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/92 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-xl">
      <div className="mx-auto grid max-w-4xl grid-cols-5 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;

          return (
            <button
              className="flex min-w-0 flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-center"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1871D8] to-[#34C759] text-white shadow-sm'
                    : 'text-[#BDBDBD]'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={`text-[11px] font-medium leading-tight ${
                  isActive ? 'text-[#0B412F]' : 'text-[#BDBDBD]'
                }`}
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
