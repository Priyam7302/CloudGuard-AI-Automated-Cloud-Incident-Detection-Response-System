import { Crosshair } from "lucide-react";

function MitreChip({ mitre }) {
  if (!mitre?.id) return null;
  const tooltip = [mitre.name, mitre.tactics?.length ? `Tactics: ${mitre.tactics.join(", ")}` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <span className="chip chip-accent mono" title={tooltip || undefined}>
      <Crosshair size={11} />
      {mitre.id}
    </span>
  );
}

export default MitreChip;
