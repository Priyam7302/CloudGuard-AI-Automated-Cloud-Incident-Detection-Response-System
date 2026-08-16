const TONES = {
  Critical: "var(--sev-critical)",
  High: "var(--sev-high)",
  Medium: "var(--sev-medium)",
  Low: "var(--sev-low)",
  Unknown: "var(--ink-3)",
};

/**
 * Threat-score meter: the fill carries severity, the unfilled track is a
 * lighter step of the same hue so state reads across the whole bar.
 */
function ScoreMeter({ score, severity = "Unknown", height = 7 }) {
  const value = typeof score === "number" ? Math.max(0, Math.min(100, score)) : 0;
  const color = TONES[severity] ?? TONES.Unknown;

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={`Threat score ${value} out of 100`}
      style={{
        height,
        borderRadius: 99,
        background: `color-mix(in srgb, ${color} 18%, transparent)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          borderRadius: 99,
          background: color,
          transition: "width 500ms var(--ease)",
        }}
      />
    </div>
  );
}

export default ScoreMeter;
