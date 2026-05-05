import { BriefcaseBusiness, CheckCircle2, Clock3, ListChecks, Plus, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const areaTabs = [
  { id: 'general', label: 'General' },
  { id: 'ventas', label: 'Ventas' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'operaciones', label: 'Operaciones' },
  { id: 'atencion', label: 'Atencion' }
];

const statusLabels = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  hecho: 'Hecho'
};

const statusAccent = {
  pendiente: 'border-blue-100 bg-blue-50 text-blue-700',
  en_progreso: 'border-amber-100 bg-amber-50 text-amber-700',
  hecho: 'border-emerald-100 bg-emerald-50 text-emerald-700'
};

function TaskCard({ task, onDragStart }) {
  return (
    <motion.article
      className="rounded-[22px] border border-white bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200"
      draggable
      layout
      onDragStart={(event) => onDragStart(event, task.id)}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#1A1A1A]">{task.title}</p>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600">
          {task.priority}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
        <span className="rounded-full bg-slate-50 px-2.5 py-1">{task.companyName}</span>
        <span className="rounded-full bg-slate-50 px-2.5 py-1">{task.assignee_name || 'Sin asignar'}</span>
      </div>
    </motion.article>
  );
}

function WorkplaceView({ currentArea = 'general', onTaskMove, tasks = [] }) {
  const [selectedArea, setSelectedArea] = useState(currentArea);

  useEffect(() => {
    setSelectedArea(currentArea);
  }, [currentArea]);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => (selectedArea === 'general' ? true : task.area === selectedArea)),
    [selectedArea, tasks]
  );

  const columns = useMemo(
    () => ({
      pendiente: filteredTasks.filter((task) => task.status === 'pendiente'),
      en_progreso: filteredTasks.filter((task) => task.status === 'en_progreso'),
      hecho: filteredTasks.filter((task) => task.status === 'hecho')
    }),
    [filteredTasks]
  );

  const handleDrop = (event, status) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    if (!taskId) {
      return;
    }
    onTaskMove(taskId, status);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-inset ring-slate-200">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
                Workplace
              </p>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#1A1A1A]">
                Ejecucion conectada con el negocio
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">
                Arrastra tareas entre estados para reflejar el avance real y mantener
                el seguimiento operativo dentro de la plataforma.
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#0B412F] px-4 py-3 text-sm font-semibold text-white shadow-sm"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Crear tarea
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {areaTabs.map((tab) => (
              <button
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedArea === tab.id
                    ? 'bg-[#1871D8] text-white'
                    : 'bg-slate-100 text-slate-500 hover:text-[#0B412F]'
                }`}
                key={tab.id}
                onClick={() => setSelectedArea(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <ListChecks className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Total</p>
              <strong className="font-['Inter'] text-4xl font-extrabold tracking-[-0.05em] text-[#1A1A1A]">
                {filteredTasks.length}
              </strong>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Clock3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Pendientes</p>
              <strong className="font-['Inter'] text-4xl font-extrabold tracking-[-0.05em] text-[#1A1A1A]">
                {columns.pendiente.length}
              </strong>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">En progreso</p>
              <strong className="font-['Inter'] text-4xl font-extrabold tracking-[-0.05em] text-[#1A1A1A]">
                {columns.en_progreso.length}
              </strong>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Hechas</p>
              <strong className="font-['Inter'] text-4xl font-extrabold tracking-[-0.05em] text-[#1A1A1A]">
                {columns.hecho.length}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <article className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-inset ring-slate-200">
          <div className="mb-5">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Kanban operativo
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#4A4A4A]">
              Mueve tareas entre columnas sin salir de la vista y manten el avance alineado
              con cada empresa.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {Object.entries(columns).map(([status, items]) => (
              <div
                className="rounded-[24px] bg-[#F8F9FA] p-4 ring-1 ring-inset ring-slate-200"
                key={status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, status)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <strong className="text-sm text-[#1A1A1A]">{statusLabels[status]}</strong>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusAccent[status]}`}>
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length ? (
                    items.map((task) => (
                      <TaskCard
                        key={task.id}
                        onDragStart={(event, taskId) =>
                          event.dataTransfer.setData('text/plain', taskId)
                        }
                        task={task}
                      />
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-400">
                      Solta una tarea aca.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-inset ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#1A1A1A]">
                  Coordinacion interna
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#4A4A4A]">
                  Las conversaciones y tareas viven en el mismo sistema para no perder contexto.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] bg-[#0B412F] p-6 text-white shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-200">
              Calendario operativo
            </p>
            <h3 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold tracking-tight">
              Empresa, area e individual
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/76">
              Cada tarea puede escalar a seguimiento por fecha, responsable y area sin salir del workplace.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}

export default WorkplaceView;
