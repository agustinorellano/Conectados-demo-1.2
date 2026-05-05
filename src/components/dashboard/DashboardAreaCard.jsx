import { ArrowRight, Megaphone, Settings2, ShoppingBag, Users } from 'lucide-react';
import HighContrastGauge from './HighContrastGauge';

const areaIcons = {
  ventas: ShoppingBag,
  marketing: Megaphone,
  operaciones: Settings2,
  atencion: Users
};

function getStatus(progress) {
  if (progress < 50) {
    return { label: 'Critico', tone: 'critical', dot: 'bg-red-500' };
  }

  if (progress <= 75) {
    return { label: 'En riesgo', tone: 'warning', dot: 'bg-amber-500' };
  }

  return { label: 'Solido', tone: 'success', dot: 'bg-emerald-500' };
}

function formatDelta(value) {
  return `${value > 0 ? '+' : ''}${value}%`;
}

function DashboardAreaCard({ area, onClick, periodLabel }) {
  const Icon = areaIcons[area.area] || ShoppingBag;
  const status = getStatus(area.progress);

  return (
    <button
      className="group flex h-full w-full flex-col rounded-[24px] bg-white p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200 transition duration-200 hover:-translate-y-1 hover:ring-[#1871D8]/18"
      onClick={() => onClick(area.area)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 ring-1 ring-inset ring-slate-200">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">{area.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{area.taskCount} tareas activas</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex justify-center">
        <HighContrastGauge
          label={area.name}
          size="sm"
          status={status.label}
          tone={status.tone}
          value={area.progress}
        />
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium text-[#1A1A1A]">
          Te faltan {area.actionsLeft} acciones para cerrar {periodLabel}.
        </p>
        <p className="text-sm leading-[1.4] text-[#4A4A4A]">{area.summary}</p>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
          <span className="block uppercase tracking-[0.18em] text-slate-400">Vs periodo previo</span>
          <strong
            className={`mt-1 block text-sm ${
              area.vsPrevious >= 0 ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {formatDelta(area.vsPrevious)}
          </strong>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
          <span className="block uppercase tracking-[0.18em] text-slate-400">Vs objetivo</span>
          <strong
            className={`mt-1 block text-sm ${
              area.vsGoal >= 0 ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {formatDelta(area.vsGoal)}
          </strong>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1871D8]">
          {area.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

export default DashboardAreaCard;
