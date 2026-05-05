import { Megaphone, Settings2, ShoppingBag, Users } from 'lucide-react';

const areaIcons = {
  ventas: ShoppingBag,
  marketing: Megaphone,
  operaciones: Settings2,
  atencion: Users
};

function DashboardProgressRow({ area, onClick }) {
  const Icon = areaIcons[area.area] || ShoppingBag;

  return (
    <button
      className="group grid w-full items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)_64px]"
      onClick={() => onClick(area.area)}
      type="button"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600 ring-1 ring-inset ring-slate-200">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold text-[#1A1A1A]">{area.name}</span>
      </div>

      <div className="w-full rounded-full border border-slate-200 bg-slate-50 p-1">
        <div
          className="h-3 rounded-full bg-[#0B6A62] transition-all duration-700 ease-in-out"
          style={{ width: `${area.progress}%` }}
        />
      </div>

      <div className="text-right font-['Inter'] text-lg font-bold tracking-[-0.03em] text-[#1A1A1A]">
        {area.progress}%
      </div>
    </button>
  );
}

export default DashboardProgressRow;
