import { BookText, Bot, LifeBuoy, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const helpTabs = {
  how: {
    label: 'Como funciona',
    intro: 'Cuatro pasos concretos para pasar de descubrir empresas a cerrar acuerdos.',
    cards: [
      { title: 'Descubri empresas', detail: 'Explora perfiles con score comercial y detecta oportunidades con verdadero fit.' },
      { title: 'Hace match', detail: 'Decidí rapido con swipe y prioriza empresas que pueden mover ventas.' },
      { title: 'Envia propuesta', detail: 'Activa una conversacion con copy guiado y foco comercial claro.' },
      { title: 'Cerra acuerdos', detail: 'Lleva la oportunidad a tareas y seguimiento dentro de Workplace.' }
    ]
  },
  practice: {
    label: 'Buenas practicas',
    intro: 'Pequenos habitos que mejoran conversion y velocidad de cierre.',
    cards: [
      { title: 'Pitches concretos', detail: 'Habla de valor economico, audiencia y canales antes que de afinidad.' },
      { title: 'Seguimiento rapido', detail: 'Converti cada interes en tarea dentro del mismo dia.' },
      { title: 'Brief visible', detail: 'Comparte objetivos, ticket y alcance esperado desde el primer mensaje.' }
    ]
  },
  support: {
    label: 'Soporte',
    intro: 'Respuestas rapidas para dudas operativas y comerciales.',
    cards: [
      { title: 'Asesor IA', detail: 'Pedi ayuda para redactar propuestas, priorizar aliados y ordenar ejecucion.' },
      { title: 'Equipo Data Plus', detail: 'Escalamos bloqueos funcionales o comerciales dentro del producto.' },
      { title: 'Centro de ayuda', detail: 'Documentacion viva con casos de uso, mejores practicas y novedades.' }
    ]
  }
};

const modalReplies = [
  'Puedo ayudarte a estructurar una propuesta comercial en menos de 5 minutos.',
  'Si queres, analizamos que aliado tiene mayor potencial para tu categoria.',
  'Tambien puedo convertir esta conversacion en una accion concreta para Workplace.'
];

function HowCardAnimation({ title }) {
  if (title === 'Descubri empresas') {
    return (
      <div className="relative h-36 overflow-hidden rounded-[20px] bg-slate-50 ring-1 ring-inset ring-slate-200">
        {[0, 1, 2].map((index) => (
          <motion.div
            animate={{ y: ['0%', '-115%'] }}
            className="absolute left-4 right-4 rounded-[18px] bg-white p-3 shadow-sm ring-1 ring-inset ring-slate-200"
            key={index}
            style={{ top: `${16 + index * 44}px` }}
            transition={{
              repeat: Infinity,
              duration: 2.6,
              ease: 'easeInOut',
              delay: index * 0.18
            }}
          >
            <div className="h-2 w-20 rounded-full bg-[#1871D8]/20" />
            <div className="mt-2 h-2 w-32 rounded-full bg-slate-200" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (title === 'Hace match') {
    return (
      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-[20px] bg-slate-50 ring-1 ring-inset ring-slate-200">
        <motion.div
          animate={{ x: [-26, 26, 0], rotate: [-5, 5, 0] }}
          className="h-24 w-40 rounded-[24px] bg-white shadow-sm ring-1 ring-inset ring-slate-200"
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (title === 'Envia propuesta') {
    return (
      <div className="flex h-36 items-center rounded-[20px] bg-slate-50 px-4 ring-1 ring-inset ring-slate-200">
        <div className="w-full rounded-[18px] bg-white px-4 py-3 shadow-sm ring-1 ring-inset ring-slate-200">
          <motion.div
            animate={{ width: ['0%', '92%', '92%'] }}
            className="h-3 rounded-full bg-[#0B412F]/12"
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          />
          <motion.div
            animate={{ width: ['0%', '74%', '74%'] }}
            className="mt-3 h-3 rounded-full bg-[#1871D8]/18"
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.18 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-36 items-center justify-center rounded-[20px] bg-slate-50 ring-1 ring-inset ring-slate-200">
      <div className="w-48">
        <div className="h-3 rounded-full bg-slate-200" />
        <motion.div
          animate={{ width: ['18%', '100%'] }}
          className="mt-4 h-3 rounded-full bg-[#0B6A62]"
          transition={{ repeat: Infinity, duration: 2.1, ease: 'easeInOut' }}
        />
        <motion.div
          animate={{ scale: [0.85, 1, 1] }}
          className="mt-6 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
          transition={{ repeat: Infinity, duration: 2.1, ease: 'easeInOut' }}
        >
          Acuerdo cerrado
        </motion.div>
      </div>
    </div>
  );
}

function HelpCenterView() {
  const [activeTab, setActiveTab] = useState('how');
  const [modalOpen, setModalOpen] = useState(false);
  const activeContent = useMemo(() => helpTabs[activeTab], [activeTab]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-inset ring-slate-200">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
          Help Center
        </p>
        <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Guia visual para usar Data Plus con foco comercial
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">{activeContent.intro}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {Object.entries(helpTabs).map(([key, tab]) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === key
                  ? 'bg-[#1871D8] text-white'
                  : 'bg-slate-100 text-slate-500 hover:text-[#0B412F]'
              }`}
              key={key}
              onClick={() => setActiveTab(key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className={`grid gap-4 ${activeTab === 'how' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
        {activeContent.cards.map((card, index) => (
          <motion.article
            className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-slate-200"
            initial={{ opacity: 0, y: 16 }}
            key={card.title}
            transition={{ duration: 0.28, delay: index * 0.04 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.03, boxShadow: '0 18px 36px rgba(8,33,24,0.08)' }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                {activeTab === 'how' ? (
                  <BookText className="h-4 w-4" />
                ) : activeTab === 'practice' ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <LifeBuoy className="h-4 w-4" />
                )}
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
            <h3 className="mt-5 font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#1A1A1A]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">{card.detail}</p>
            {activeTab === 'how' ? <div className="mt-5"><HowCardAnimation title={card.title} /></div> : null}
          </motion.article>
        ))}
      </section>

      <button
        className="fixed bottom-28 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#0B412F] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(11,65,47,0.22)]"
        onClick={() => setModalOpen(true)}
        type="button"
      >
        <Bot className="h-4 w-4" />
        Asesor IA
      </button>

      <AnimatePresence>
        {modalOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(8,33,24,0.18)]"
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
                    Asesor IA
                  </p>
                  <h3 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
                    Ayuda guiada dentro del centro de soporte
                  </h3>
                </div>
                <button
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
                  onClick={() => setModalOpen(false)}
                  type="button"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {modalReplies.map((reply) => (
                  <div
                    className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm leading-6 text-[#4A4A4A]"
                    key={reply}
                  >
                    {reply}
                  </div>
                ))}
              </div>

              <textarea
                className="mt-5 min-h-[112px] w-full resize-none rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-[#1A1A1A] outline-none focus:border-[#1871D8]/35 focus:ring-4 focus:ring-[#1871D8]/8"
                placeholder="Contame que queres resolver y te ayudo a ordenarlo."
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default HelpCenterView;
