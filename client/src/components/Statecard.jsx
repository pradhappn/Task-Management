import "../styles/Statecard.css";

function StatCard({ title, value, icon, tone, description }) {
  return (
    <article className="stat-card surface-card">
      <div className={`stat-icon stat-icon-${tone}`}>
        <i className={`bi ${icon}`} aria-hidden="true" />
      </div>

      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-description">{description}</p>
    </article>
  );
}

export default StatCard;