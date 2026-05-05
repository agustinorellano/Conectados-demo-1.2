function PriorityActionCard({ action, index }) {
  const impactTone =
    action.impact === 'alto'
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100'
      : action.impact === 'medio'
        ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100'
        : 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';

  const difficultyTone =
    action.difficulty === 'dificil'
      ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100'
      : action.difficulty === 'media'
        ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100'
        : 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';

  return (
    <article className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 transition duration-200 hover:bg-white hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-950">{action.title}</p>
          <p className="mt-1 text-sm text-slate-500">{action.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${impactTone}`}>
              Impacto {action.impact}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyTone}`}>
              Dificultad {action.difficulty}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PriorityActionCard;
