import { ArrowRight, BriefcaseBusiness, MapPin, MessageSquareText, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import DashboardMetricCard from './DashboardMetricCard';
import DashboardProgressRow from './DashboardProgressRow';

const periods = [
  { key: 'dia', label: 'Dia' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' }
];

function DashboardView({ dashboardData, onAreaSelect, onOpenAssistant, onOpenAlliances }) {
  const { commerce, quickMetrics, areaCards, matchmaking, scoreByPeriod } = dashboardData;
  const [selectedPeriod, setSelectedPeriod] = useState('semana');

  const rows = useMemo(
    () =>
      areaCards.map((area) => ({
        ...area,
        ...area.periods[selectedPeriod]
      })),
    [areaCards, selectedPeriod]
  );

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1871D8] via-[#135db0] to-[#0B412F] p-5 text-white shadow-[0_28px_60px_rgba(11,65,47,0.18)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%)]" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
              Dashboard ejecutivo
            </p>
            <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight sm:text-[2.1rem]">
              {commerce.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/85">
              <span className="rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">
                {commerce.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">
                <MapPin className="h-3.5 w-3.5" />
                {commerce.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">
                <Users className="h-3.5 w-3.5" />
                {commerce.size}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#1871D8] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              onClick={onOpenAssistant}
              type="button"
            >
              <MessageSquareText className="h-4 w-4" />
              Consultar IA
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5"
              onClick={onOpenAlliances}
              type="button"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Ir a Match
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickMetrics.map((metric) => (
          <DashboardMetricCard
            change={metric.change}
            key={metric.label}
            label={metric.label}
            prefix={metric.prefix}
            suffix={metric.suffix}
            tone={metric.tone}
            trend={metric.trend}
            value={metric.value}
          />
        ))}
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#1871D8]">
              Estado general
            </p>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Score {scoreByPeriod[selectedPeriod].score}%
            </h2>
          </div>

          <div className="inline-flex rounded-[18px] bg-slate-100 p-1">
            {periods.map((period) => (
              <button
                className={`rounded-[14px] px-4 py-2 text-sm font-semibold transition ${
                  selectedPeriod === period.key
                    ? 'bg-white text-[#1871D8] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                type="button"
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {rows.map((area) => (
            <DashboardProgressRow area={area} key={`${area.area}-${selectedPeriod}`} onClick={onAreaSelect} />
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#0B412F]">
              Matchmaking
            </p>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              {matchmaking.title}
            </h2>
            <p className="mt-2 text-sm text-[#4A4A4A]">{matchmaking.description}</p>
          </div>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1871D8] transition hover:text-[#135db0]"
            onClick={onOpenAlliances}
            type="button"
          >
            Buscar alianzas
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default DashboardView;
