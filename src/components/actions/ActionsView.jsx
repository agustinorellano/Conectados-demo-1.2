function ActionsView({ actionItems }) {
  return (
    <div className="view-stack">
      <section className="section-header">
        <div>
          <p className="eyebrow">Acciones</p>
          <h2>Tareas creadas por la empresa, separadas del sistema.</h2>
        </div>
      </section>

      <section className="action-list">
        {actionItems.map((item) => (
          <article className="glass-card action-card" key={item.title}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.owner}</p>
            </div>
            <span className="priority-badge">{item.priority}</span>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ActionsView;
