import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';

const TOTAL_STEPS = 7;

const CANALES = ['Local físico', 'Tienda online', 'Redes sociales', 'Marketplace', 'WhatsApp'];
const OBJETIVOS_LIST = ['Aumentar ventas', 'Fortalecer marca', 'Mejorar engagement', 'Generar tráfico'];
const TIPO_NEGOCIO = ['Retail', 'Gastronomía', 'Indumentaria', 'Belleza', 'Fitness', 'Tecnología', 'Servicios', 'Otro'];
const TAMANO_EQUIPO = ['1-3', '4-10', '11-50', '51+'];
const FREQ_CONTENIDO = ['Diario', '3-4 veces/semana', 'Semanal', 'Ocasional'];
const TIEMPO_RESPUESTA = ['Menos de 1h', '1-4 horas', '24 horas', 'Más de 24h'];
const COLAB_TIPOS = ['Eventos', 'Descuentos cruzados', 'Co-branding', 'Sorteos', 'Contenido colaborativo', 'Bundle de productos'];

const STEP_META = [
  { title: 'Tu empresa', subtitle: 'Contanos sobre tu negocio' },
  { title: 'Objetivos', subtitle: '¿Qué querés lograr?' },
  { title: 'Marketing', subtitle: '¿Cómo manejás tu comunicación?' },
  { title: 'Ventas', subtitle: '¿Cómo gestionás tus clientes?' },
  { title: 'Presencia digital', subtitle: '¿Dónde encontramos tu marca?' },
  { title: 'Colaboraciones', subtitle: '¿Trabajás con otras marcas?' },
  { title: 'Activación', subtitle: 'Tu perfil está listo' },
];

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

/* ── Sub-components ── */

function FormRow({ label, children }) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-[#1A1A1A]">{label}</span>
      {children}
    </div>
  );
}

function MultiPill({ options, selected, onChange }) {
  const toggle = (opt) =>
    onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selected.includes(opt)
              ? 'bg-[#0B412F] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          key={opt}
          onClick={() => toggle(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SinglePill({ options, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selected === opt
              ? 'bg-[#0B412F] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          key={opt}
          onClick={() => onChange(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function YesNoToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1">
      {[true, false].map((v) => (
        <button
          className={`rounded-lg px-5 py-1.5 text-sm font-medium transition ${
            value === v ? 'bg-white shadow-sm text-[#0B412F]' : 'text-slate-500'
          }`}
          key={String(v)}
          onClick={() => onChange(v)}
          type="button"
        >
          {v ? 'Sí' : 'No'}
        </button>
      ))}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#1871D8]/40 focus:ring-4 focus:ring-[#1871D8]/8"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      value={value || ''}
    />
  );
}

/* ── Steps ── */

function StepEmpresa({ data, setData }) {
  return (
    <div className="space-y-6">
      <FormRow label="Nombre de la empresa">
        <TextInput
          onChange={(v) => setData({ ...data, nombre: v })}
          placeholder="Tu marca comercial"
          value={data.nombre}
        />
      </FormRow>
      <FormRow label="Tipo de negocio">
        <SinglePill
          onChange={(v) => setData({ ...data, tipo: v })}
          options={TIPO_NEGOCIO}
          selected={data.tipo || ''}
        />
      </FormRow>
      <FormRow label="Tamaño del equipo">
        <SinglePill
          onChange={(v) => setData({ ...data, tamano: v })}
          options={TAMANO_EQUIPO}
          selected={data.tamano || ''}
        />
      </FormRow>
      <FormRow label="Canales de venta (todos los que usás)">
        <MultiPill
          onChange={(v) => setData({ ...data, canales: v })}
          options={CANALES}
          selected={data.canales || []}
        />
      </FormRow>
    </div>
  );
}

function StepObjetivos({ data, setData }) {
  return (
    <div className="space-y-6">
      <FormRow label="Objetivos principales">
        <MultiPill
          onChange={(v) => setData({ ...data, objetivos: v })}
          options={OBJETIVOS_LIST}
          selected={data.objetivos || []}
        />
      </FormRow>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { key: 'segActual', label: 'Seguidores actuales', placeholder: 'Ej: 5.000' },
          { key: 'segObjetivo', label: 'Seguidores objetivo', placeholder: 'Ej: 20.000' },
          { key: 'ticket', label: 'Ticket promedio ($)', placeholder: 'Ej: 15.000' },
          { key: 'metaMensual', label: 'Meta de ventas mensual ($)', placeholder: 'Ej: 500.000' },
        ].map(({ key, label, placeholder }) => (
          <FormRow key={key} label={label}>
            <TextInput
              onChange={(v) => setData({ ...data, [key]: v })}
              placeholder={placeholder}
              value={data[key]}
            />
          </FormRow>
        ))}
      </div>
    </div>
  );
}

function StepMarketing({ data, setData }) {
  return (
    <div className="space-y-6">
      {[
        { key: 'estrategia', label: '¿Tenés una estrategia de contenido definida?' },
        { key: 'metricas', label: '¿Medís métricas de engagement o alcance?' },
        { key: 'ads', label: '¿Usás publicidad paga (Meta Ads, Google Ads)?' },
      ].map(({ key, label }) => (
        <FormRow key={key} label={label}>
          <YesNoToggle
            onChange={(v) => setData({ ...data, [key]: v })}
            value={data[key] ?? null}
          />
        </FormRow>
      ))}
      <FormRow label="Frecuencia de publicación de contenido">
        <SinglePill
          onChange={(v) => setData({ ...data, frecuencia: v })}
          options={FREQ_CONTENIDO}
          selected={data.frecuencia || ''}
        />
      </FormRow>
    </div>
  );
}

function StepVentas({ data, setData }) {
  return (
    <div className="space-y-6">
      {[
        { key: 'crm', label: '¿Usás algún CRM o herramienta para gestionar clientes?' },
        { key: 'seguimiento', label: '¿Realizás seguimiento de leads o prospectos?' },
        { key: 'conversion', label: '¿Medís tasa de conversión?' },
      ].map(({ key, label }) => (
        <FormRow key={key} label={label}>
          <YesNoToggle
            onChange={(v) => setData({ ...data, [key]: v })}
            value={data[key] ?? null}
          />
        </FormRow>
      ))}
      <FormRow label="Tiempo promedio de respuesta a consultas">
        <SinglePill
          onChange={(v) => setData({ ...data, tiempoRespuesta: v })}
          options={TIEMPO_RESPUESTA}
          selected={data.tiempoRespuesta || ''}
        />
      </FormRow>
    </div>
  );
}

function StepDigital({ data, setData }) {
  return (
    <div className="space-y-5">
      {[
        { key: 'instagram', label: 'Instagram', placeholder: '@tumarca' },
        { key: 'web', label: 'Sitio web', placeholder: 'www.tumarca.com' },
        { key: 'tiendaOnline', label: 'Tienda online (Mercado Libre, Tienda Nube…)', placeholder: 'link a tu tienda' },
      ].map(({ key, label, placeholder }) => (
        <FormRow key={key} label={label}>
          <TextInput
            onChange={(v) => setData({ ...data, [key]: v })}
            placeholder={placeholder}
            value={data[key]}
          />
        </FormRow>
      ))}
    </div>
  );
}

function StepColaboraciones({ data, setData }) {
  return (
    <div className="space-y-6">
      <FormRow label="¿Realizás o realizaste colaboraciones con otras marcas?">
        <YesNoToggle
          onChange={(v) => setData({ ...data, haceColab: v })}
          value={data.haceColab ?? null}
        />
      </FormRow>
      {data.haceColab && (
        <FormRow label="¿Qué tipo de colaboraciones hacés?">
          <MultiPill
            onChange={(v) => setData({ ...data, tiposColab: v })}
            options={COLAB_TIPOS}
            selected={data.tiposColab || []}
          />
        </FormRow>
      )}
    </div>
  );
}

function StepActivacion({ formData, onFinish }) {
  const summary = [
    { label: 'Empresa', value: formData.empresa?.nombre || '—' },
    { label: 'Tipo', value: formData.empresa?.tipo || '—' },
    { label: 'Equipo', value: formData.empresa?.tamano || '—' },
    { label: 'Canales', value: (formData.empresa?.canales || []).join(', ') || '—' },
    { label: 'Objetivos', value: (formData.objetivos?.objetivos || []).join(', ') || '—' },
    { label: 'Instagram', value: formData.digital?.instagram || '—' },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] bg-[#0B412F]/5 p-5 ring-1 ring-inset ring-[#0B412F]/10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0B412F]">
          Resumen del perfil
        </p>
        <div className="space-y-3">
          {summary.map(({ label, value }) => (
            <div className="flex items-start justify-between gap-4 text-sm" key={label}>
              <span className="text-[#4A4A4A]">{label}</span>
              <span className="text-right font-medium text-[#1A1A1A]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[22px] bg-slate-50 p-5 ring-1 ring-inset ring-slate-200 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1871D8]/10">
          <Zap className="h-5 w-5 text-[#1871D8]" />
        </div>
        <p className="text-sm font-semibold text-[#1A1A1A]">Estamos generando tu diagnóstico</p>
        <p className="mt-1 text-xs text-[#4A4A4A]">
          El motor de matchmaking está calibrándose con tu perfil
        </p>
      </div>

      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#0B412F] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0a3828] hover:shadow-md"
        onClick={onFinish}
        type="button"
      >
        Ir al dashboard
      </button>
    </div>
  );
}

/* ── Main component ── */

function OnboardingScreen({ onFinish, onProfileChange }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    empresa: {},
    objetivos: {},
    marketing: {},
    ventas: {},
    digital: {},
    colaboraciones: {},
  });

  const meta = STEP_META[step];
  const isLast = step === TOTAL_STEPS - 1;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const updateSection = (section, value) =>
    setFormData((prev) => ({ ...prev, [section]: value }));

  const handleFinish = () => {
    if (formData.empresa?.nombre) {
      onProfileChange?.((current) => ({
        ...current,
        name: formData.empresa.nombre,
        industries: formData.empresa.tipo ? [formData.empresa.tipo] : current.industries,
        socialLinks: {
          ...current.socialLinks,
          instagram: formData.digital?.instagram
            ? `https://instagram.com/${formData.digital.instagram.replace('@', '')}`
            : current.socialLinks?.instagram,
        },
      }));
    }
    onFinish();
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Progress header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B412F] text-sm font-bold text-white">
              DP
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1871D8]">
                Onboarding
              </p>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Paso {step + 1} de {TOTAL_STEPS}
              </p>
            </div>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEP_META.map((_, i) => (
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < step
                    ? 'w-3 bg-[#0B412F]'
                    : i === step
                    ? 'w-6 bg-[#0B412F]'
                    : 'w-3 bg-slate-200'
                }`}
                key={i}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {/* Top progress bar */}
          <div className="h-1 bg-slate-100">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#0B412F]"
              initial={false}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>

          <div className="px-6 py-7 sm:px-8">
            {/* Step title — animates per step */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                animate="center"
                custom={direction}
                exit="exit"
                initial="enter"
                key={`title-${step}`}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                variants={variants}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1871D8]">
                  {meta.subtitle}
                </p>
                <h2 className="mt-1.5 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
                  {meta.title}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Step content */}
            <div className="mt-6">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  animate="center"
                  custom={direction}
                  exit="exit"
                  initial="enter"
                  key={`step-${step}`}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  variants={variants}
                >
                  {step === 0 && (
                    <StepEmpresa
                      data={formData.empresa}
                      setData={(v) => updateSection('empresa', v)}
                    />
                  )}
                  {step === 1 && (
                    <StepObjetivos
                      data={formData.objetivos}
                      setData={(v) => updateSection('objetivos', v)}
                    />
                  )}
                  {step === 2 && (
                    <StepMarketing
                      data={formData.marketing}
                      setData={(v) => updateSection('marketing', v)}
                    />
                  )}
                  {step === 3 && (
                    <StepVentas
                      data={formData.ventas}
                      setData={(v) => updateSection('ventas', v)}
                    />
                  )}
                  {step === 4 && (
                    <StepDigital
                      data={formData.digital}
                      setData={(v) => updateSection('digital', v)}
                    />
                  )}
                  {step === 5 && (
                    <StepColaboraciones
                      data={formData.colaboraciones}
                      setData={(v) => updateSection('colaboraciones', v)}
                    />
                  )}
                  {step === 6 && (
                    <StepActivacion formData={formData} onFinish={handleFinish} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation footer */}
          {!isLast && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 sm:px-8">
              <button
                className={`inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium transition ${
                  step === 0
                    ? 'pointer-events-none opacity-0'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={goBack}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-[14px] bg-[#0B412F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={goNext}
                type="button"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default OnboardingScreen;
