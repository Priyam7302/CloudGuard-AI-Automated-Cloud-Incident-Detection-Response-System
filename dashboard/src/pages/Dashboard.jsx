import SummaryCard from "../components/SummaryCard";
import summaryData from "../data/summaryData";
import IncidentTable from "../components/IncidentTable";

function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      <p>Real-Time Cloud Threat Detection & Security Monitoring</p>

      <div className="summary">
        {summaryData.map((item) => (
          <SummaryCard key={item.id} title={item.title} value={item.value} />
        ))}
      </div>

      <IncidentTable />
    </>
  );
}

export default Dashboard;
