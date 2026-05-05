import { AnimatePresence, motion } from 'framer-motion';
import { Check, Pencil, X } from 'lucide-react';

function EditableProfileSection({
  title,
  subtitle,
  summary,
  icon,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  children
}) {
  return (
    <article
      className={`overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 transition-all duration-200 sm:p-6 ${
        isEditing
          ? 'ring-[#1871D8]/35 bg-[#F8FBFF]'
          : 'ring-slate-200 hover:-translate-y-0.5 hover:ring-[#1871D8]/16'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600 ring-1 ring-inset ring-slate-200">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#1871D8]">
              {subtitle}
            </p>
            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#1A1A1A]">
              {title}
            </h3>
          </div>
        </div>

        {!isEditing ? (
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            onClick={onEdit}
            type="button"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        <div>{summary}</div>

        <AnimatePresence initial={false}>
          {isEditing ? (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
            >
              <div className="space-y-5 border-t border-slate-200 pt-5">
                {children}

                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-[16px] bg-[#1871D8] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1567c5]"
                    onClick={onSave}
                    type="button"
                  >
                    <Check className="h-4 w-4" />
                    Guardar cambios
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    onClick={onCancel}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </article>
  );
}

export default EditableProfileSection;
