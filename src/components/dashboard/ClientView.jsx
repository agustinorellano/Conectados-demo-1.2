const clientSections = [
  {
    id: 'workplace',
    label: 'Workplace',
    description: 'Gestion interna del equipo, tareas por area y seguimiento operativo.'
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Perfil completo de la empresa con objetivos, oferta, busqueda y metricas.'
  },
  {
    id: 'alliances',
    label: 'Alliance (Onboarding)',
    description: 'Motor principal de matchmaking, onboarding de alianzas y conexiones de valor.'
  },
  {
    id: 'chats',
    label: 'Chats',
    description: 'Conversaciones entre empresas y entre equipos, sin salir de Conectados.'
  },
  {
    id: 'assistant',
    label: 'Asistente virtual',
    description: 'Copiloto para analizar el negocio, sugerir acciones y recomendar alianzas.'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Vista ejecutiva del estado del negocio, ejecucion y prioridades.'
  }
];

function ClientView({ onNavigate }) {
  return (
    <div className="view-stack">
      <section className="section-header">
        <div>
          <p className="eyebrow">Vista cliente</p>
          <h2>Todo Conectados sintetizado en seis puntos claros.</h2>
        </div>
      </section>

      <section className="client-view-hero glass-card">
        <div className="client-view-copy">
          <span className="client-view-tag">Que ve el cliente</span>
          <h3>Una experiencia simple, ordenada y orientada a negocio.</h3>
          <p>
            La vista principal resume todo el producto en modulos faciles de
            entender. El cliente entra, entiende rapido el sistema y navega
            entre los puntos clave sin ruido.
          </p>
        </div>
        <div className="client-view-pillars">
          {clientSections.map((section, index) => (
            <button
              className="client-pillar-card"
              key={section.id}
              onClick={() => onNavigate(section.id)}
              type="button"
            >
              <span className="client-pillar-index">0{index + 1}</span>
              <strong>{section.label}</strong>
              <p>{section.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="client-summary-grid">
        <article className="glass-card client-summary-card">
          <h3>Lado izquierdo</h3>
          <ul className="clean-list">
            {clientSections.map((section) => (
              <li key={section.id}>{section.label}</li>
            ))}
          </ul>
        </article>

        <article className="glass-card client-summary-card">
          <h3>Lectura inmediata</h3>
          <p>
            El cliente percibe una plataforma clara: gestion, perfil, alianzas,
            conversaciones, IA y control ejecutivo.
          </p>
        </article>

        <article className="glass-card client-summary-card">
          <h3>Objetivo de esta vista</h3>
          <p>
            Reducir complejidad visual, mejorar comprension comercial y mostrar
            rapido el valor de Conectados.
          </p>
        </article>
      </section>
    </div>
  );
}

export default ClientView;
