import {
  Bot,
  BriefcaseBusiness,
  LayoutDashboard,
  MessageSquare,
  PanelsTopLeft,
  UserSquare2
} from 'lucide-react';

const navItems = [
  { id: 'workplace', label: 'Workplace', icon: PanelsTopLeft },
  { id: 'profile', label: 'Profile', icon: UserSquare2 },
  { id: 'alliances', label: 'Alliance (Onboarding)', icon: BriefcaseBusiness },
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'assistant', label: 'Asistente virtual', icon: Bot },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
];

function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="flex min-h-screen w-full max-w-[248px] flex-col bg-[#053b28] px-5 py-8 text-white">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
          DP
        </div>
        <div>
          <h2 className="font-semibold tracking-tight">Data Plus</h2>
          <p className="text-sm text-emerald-100/80">Cliente dashboard</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;

          return (
            <button
              className={`flex w-full flex-col items-center gap-2 rounded-2xl px-4 py-4 text-center text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-[#053b28] shadow-sm'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
