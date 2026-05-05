function RecommendationsView({ columns }) {
  const labels = {
    pending: 'Pendiente',
    inProgress: 'En progreso',
    done: 'Hecho'
  };

  return (
    <div className="view-stack">
      <section className="section-header">
        <div>
          <p className="eyebrow">Recomendaciones</p>
          <h2>Tablero Kanban para transformar insight en accion.</h2>
        </div>
      </section>

      <section className="kanban-board">
        {Object.entries(columns).map(([key, items]) => (
          <article className="glass-card kanban-column" key={key}>
            <h3>{labels[key]}</h3>
            {items.map((item) => (
              <div className="kanban-card" key={item}>
                {item}
              </div>
            ))}
          </article>
        ))}
      </section>
    </div>
  );
}

export default RecommendationsView;
