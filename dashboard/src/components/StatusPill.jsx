import { Check, X, Minus } from "lucide-react";

const STYLES = {
  success: { className: "st-success", Icon: Check },
  failed: { className: "st-failed", Icon: X },
  skipped: { className: "st-skipped", Icon: Minus },
};

function StatusPill({ status }) {
  const key = (status ?? "").toLowerCase();
  const { className, Icon } = STYLES[key] ?? STYLES.skipped;
  return (
    <span className={`badge ${className}`}>
      <Icon size={12} strokeWidth={3} />
      {status ?? "Unknown"}
    </span>
  );
}

export default StatusPill;
