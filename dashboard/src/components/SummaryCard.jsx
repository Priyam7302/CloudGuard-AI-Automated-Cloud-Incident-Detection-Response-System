import "../styles/summarycard.css";

function SummaryCard(props) {
  return (
    <div className="summary-card">

      <h3>{props.title}</h3>

      <h1>{props.value}</h1>

    </div>
  );
}

export default SummaryCard;