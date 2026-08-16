import "../styles/summarycard.css";

/**
 * Stat tile: label + value (+ optional hint), with a tone-tinted icon chip.
 * Tones map to severity levels plus "accent" and "neutral".
 */
function SummaryCard({ label, value, hint, icon: Icon, tone = "neutral" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-top">
        <p className="stat-label">{label}</p>
        {Icon && (
          <span className="stat-icon">
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="stat-value">{value}</p>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
}

export default SummaryCard;
