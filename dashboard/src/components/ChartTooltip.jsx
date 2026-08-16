/** Dark tooltip card: the value leads, the series name follows. */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      {label != null && label !== "" && <p className="chart-tip-label">{label}</p>}
      {payload.map((entry) => (
        <div className="chart-tip-row" key={entry.dataKey ?? entry.name}>
          <span
            className="chart-tip-key"
            style={{ background: entry.payload?.fill ?? entry.color }}
          />
          <strong className="num">{entry.value}</strong>
          <span className="chart-tip-name">{entry.name}</span>
        </div>
      ))}
    </div>
  );
}

export default ChartTooltip;
