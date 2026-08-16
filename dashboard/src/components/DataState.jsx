import { Inbox, CircleAlert, RefreshCw } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, message, children }) {
  return (
    <div className="data-state">
      <Icon size={30} strokeWidth={1.6} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="data-state">
      <CircleAlert size={30} strokeWidth={1.6} />
      <h3>Something went wrong</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

export function SkeletonRows({ rows = 5, height = 44, gap = 10 }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap }}
      aria-hidden="true"
      data-testid="skeleton"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}
