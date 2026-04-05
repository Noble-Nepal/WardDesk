export default function StatusBadge({ meta }) {
  if (!meta) return null;
  const Icon = meta.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${meta.cls}`}
    >
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}
