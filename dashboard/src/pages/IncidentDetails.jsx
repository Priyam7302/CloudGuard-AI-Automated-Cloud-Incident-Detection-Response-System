import { useParams } from "react-router-dom";
import incidentsData from "../data/incidentsData";
import "../styles/incidentdetails.css";

function IncidentDetails() {
  const { id } = useParams();

  const incident = incidentsData.find((item) => item.id === Number(id));

  if (!incident) {
    return <h2>Incident Not Found</h2>;
  }

  return (
    <div className="details-container">
      <h1>Incident Details</h1>

      <div className="details-grid">
        <div className="detail-card">
          <h3>Incident ID</h3>
          <p>{incident.incidentId}</p>
        </div>

        <div className="detail-card">
          <h3>Event</h3>
          <p>{incident.event}</p>
        </div>

        <div className="detail-card">
          <h3>Severity</h3>
          <p>{incident.severity}</p>
        </div>

        <div className="detail-card">
          <h3>Threat Score</h3>
          <p>{incident.score}</p>
        </div>

        <div className="detail-card">
          <h3>MITRE Technique</h3>
          <p>{incident.mitre}</p>
        </div>

        <div className="detail-card">
          <h3>Actor</h3>
          <p>{incident.actor}</p>
        </div>

        <div className="detail-card">
          <h3>Target User</h3>
          <p>{incident.targetUser}</p>
        </div>

        <div className="detail-card">
          <h3>Source IP</h3>
          <p>{incident.sourceIP}</p>
        </div>

        <div className="detail-card">
          <h3>Region</h3>
          <p>{incident.region}</p>
        </div>

        <div className="detail-card">
          <h3>Status</h3>
          <p>{incident.status}</p>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetails;
