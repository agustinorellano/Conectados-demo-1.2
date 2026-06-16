function ManualView() {
  return (
    <div className="view-stack">
      <section className="section-header">
        <div>
          <p className="eyebrow">Manual</p>
          <h2>Guia viva de la plataforma.</h2>
        </div>
      </section>

      <section className="manual-grid">
        <article className="glass-card">
          <h3>Como funciona</h3>
          <p>
            El sistema analiza compatibilidad economica, capacidad operativa y
            reciprocidad antes de mostrar alianzas.
          </p>
        </article>
        <article className="glass-card">
          <h3>Buenas practicas</h3>
          <p>
            Mantene el perfil actualizado, converti cada chat en una tarea y
            usá el dashboard para priorizar ejecucion real.
          </p>
        </article>
        <article className="glass-card">
          <h3>Soporte</h3>
          <p>
            El producto privilegia conversacion, propuestas y seguimiento dentro
            de Conectados para evitar fuga de usuarios.
          </p>
        </article>
      </section>
    </div>
  );
}

export default ManualView;
