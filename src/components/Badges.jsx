const STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function StatusBadge({ status }) {
  const cls = `status-badge status-${status.toLowerCase()}`;
  return <span className={cls}>{STATUS_LABELS[status] || status}</span>;
}

export function PriorityDot({ priority }) {
  if (!priority) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--ink-soft)" }}>
      <span className={`priority-dot priority-${priority.toLowerCase()}`} />
      {priority.charAt(0) + priority.slice(1).toLowerCase()} priority
    </span>
  );
}
