function MetricCard({ title, value, platform, icon, iconAlt, iconTone }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:scale-[1.03] hover:shadow-lg">
      <div
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${iconTone || 'bg-slate-100'}`}
      >
        <img
          alt={iconAlt || `${platform || title} logo`}
          className="h-7 w-7 object-contain"
          loading="lazy"
          src={icon}
        />
      </div>

      <div className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{value}</div>
      <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
    </article>
  );
}

export default MetricCard;
