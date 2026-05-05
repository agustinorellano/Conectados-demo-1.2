function ProfileDrawer({ company, score, onClose }) {
  if (!company) {
    return null;
  }

  return (
    <div className="drawer-shell">
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="profile-drawer">
        <button className="drawer-close" onClick={onClose} type="button">
          Cerrar
        </button>
        <div className="profile-top">
          <div className="logo-core large">{company.logo}</div>
          <div>
            <p className="eyebrow">{company.sector}</p>
            <h3>{company.name}</h3>
            <span>
              {company.location} · {company.size}
            </span>
          </div>
        </div>
        <div className="detail-score">
          <span>Match score</span>
          <strong>{score}%</strong>
        </div>
        <p>{company.culture}</p>
        <p>
          <strong>Que ofrece:</strong> {company.offer}
        </p>
        <p>
          <strong>Que busca:</strong> {company.seeking}
        </p>
        <div className="tag-row">
          {company.goals.map((goal) => (
            <span className="tag soft" key={goal}>
              {goal}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default ProfileDrawer;
