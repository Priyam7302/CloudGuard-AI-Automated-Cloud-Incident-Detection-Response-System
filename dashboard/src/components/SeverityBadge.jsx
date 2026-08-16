function SeverityBadge({ severity }) {
  const level = (severity ?? "Unknown").toLowerCase();
  return (
    <span className={`badge sev-${level}`}>
      <span className="dot" aria-hidden="true" />
      {severity ?? "Unknown"}
    </span>
  );
}

export default SeverityBadge;
