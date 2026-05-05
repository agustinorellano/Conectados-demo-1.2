import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Para validar el canal y empezar a descubrir oportunidades comerciales.',
    features: [
      'Matches limitados',
      'Visualizacion basica',
      'Guardar empresas',
      'Metricas basicas'
    ],
    cta: 'Empezar gratis',
    style: 'light'
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 29,
    description: 'Para equipos que quieren multiplicar conexiones y acelerar acuerdos.',
    features: [
      'Matches ilimitados',
      'Ver interes en tu empresa',
      'Pitch rapido',
      'Prioridad en visibilidad',
      'Filtros avanzados',
      '1 Boost mensual',
      'Metricas avanzadas'
    ],
    cta: 'Multiplicar conexiones',
    style: 'featured',
    badge: 'Mas elegido'
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 79,
    description: 'Para liderar la categoria con señal premium, IA y acceso directo.',
    features: [
      'Todo lo de Growth',
      'Mensaje sin match',
      'Prioridad maxima',
      'Boosts ilimitados',
      'IA sugerencias',
      'Insights de mercado',
      'Soporte prioritario'
    ],
    cta: 'Liderar tu categoria',
    style: 'dark'
  }
];

function PricingView({ currentPlan, onCheckoutSuccess }) {
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const selectedPlan = plans.find((plan) => plan.id === checkoutPlan);

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="rounded-[28px] bg-gradient-to-br from-[#1871D8] via-[#145db1] to-[#0B412F] px-5 py-6 text-white shadow-[0_28px_60px_rgba(11,65,47,0.18)] sm:px-7">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/70">
          Pricing
        </p>
        <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight">
          Planes listos para escalar tu motor de alianzas
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          Elegi el nivel que mejor acompana tu etapa. Cada plan desbloquea
          velocidad comercial, visibilidad y nuevas formas de cerrar acuerdos.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const featured = plan.style === 'featured';
          const dark = plan.style === 'dark';

          return (
            <motion.article
              className={`relative rounded-[28px] border p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                dark
                  ? 'border-[#0B412F] bg-[#0B412F] text-white'
                  : featured
                    ? 'border-[#1871D8]/15 bg-white ring-2 ring-[#1871D8]/10'
                    : 'border-slate-200 bg-white'
              }`}
              initial={{ opacity: 0, y: 24 }}
              key={plan.id}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {plan.badge ? (
                <span className="absolute right-5 top-5 rounded-full bg-[#1871D8] px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              ) : null}

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-2xl p-3 ${
                    dark
                      ? 'bg-white/10 text-white'
                      : featured
                        ? 'bg-blue-50 text-[#1871D8]'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {plan.id === 'starter' ? (
                    <Sparkles className="h-5 w-5" />
                  ) : plan.id === 'growth' ? (
                    <Zap className="h-5 w-5" />
                  ) : (
                    <Crown className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.22em] ${
                      dark ? 'text-white/60' : 'text-slate-500'
                    }`}
                  >
                    Plan
                  </p>
                  <h3 className="mt-1 font-['Space_Grotesk'] text-2xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="font-['Inter'] text-5xl font-extrabold tracking-[-0.05em]">
                  ${plan.price}
                </span>
                <span className={dark ? 'pb-1 text-white/65' : 'pb-1 text-slate-500'}>USD / mes</span>
              </div>

              <p className={`mt-4 text-sm leading-6 ${dark ? 'text-white/75' : 'text-slate-500'}`}>
                {plan.description}
              </p>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div className="flex items-start gap-3" key={feature}>
                    <div
                      className={`mt-0.5 rounded-full p-1 ${
                        dark ? 'bg-white/10 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-sm leading-6 ${dark ? 'text-white/82' : 'text-[#4A4A4A]'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`mt-7 inline-flex w-full items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
                  isCurrent
                    ? dark
                      ? 'bg-white/10 text-white'
                      : 'bg-slate-100 text-slate-500'
                    : dark
                      ? 'bg-white text-[#0B412F] hover:shadow-lg'
                      : featured
                        ? 'bg-[#1871D8] text-white hover:shadow-lg'
                        : 'bg-[#0B412F] text-white hover:shadow-lg'
                }`}
                disabled={isCurrent}
                onClick={() => setCheckoutPlan(plan.id)}
                type="button"
              >
                {isCurrent ? 'Plan actual' : plan.cta}
              </button>
            </motion.article>
          );
        })}
      </section>

      <AnimatePresence>
        {selectedPlan ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(8,33,24,0.18)]"
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
                Mock Stripe Checkout
              </p>
              <h3 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
                Confirmar suscripcion {selectedPlan.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">
                Esta simulacion actualiza tu plan en estado local para que puedas
                probar restricciones, mensajes directos y funciones premium sin backend.
              </p>

              <div className="mt-6 rounded-[22px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Plan</span>
                  <strong className="text-[#1A1A1A]">{selectedPlan.name}</strong>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Cobro</span>
                  <strong className="text-[#1A1A1A]">${selectedPlan.price} USD</strong>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  className="flex-1 rounded-[18px] border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
                  onClick={() => setCheckoutPlan(null)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 rounded-[18px] bg-[#1871D8] px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => {
                    onCheckoutSuccess(selectedPlan.id);
                    setCheckoutPlan(null);
                  }}
                  type="button"
                >
                  Confirmar pago
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default PricingView;
