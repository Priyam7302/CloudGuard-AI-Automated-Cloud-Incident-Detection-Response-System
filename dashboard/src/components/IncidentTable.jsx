import incidentsData from "../data/incidentsData";
import "../styles/incidenttable.css";
import { useNavigate } from "react-router-dom";

function IncidentTable() {
  const navigate = useNavigate();
  return (
    <div className="table-container">
      <h2>Recent Incidents</h2>

      <table>
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Event</th>
            <th>Severity</th>
            <th>Threat Score</th>
            <th>MITRE</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {incidentsData.map((incident) => (
            <tr
              key={incident.id}
              onClick={() => navigate(`/incidents/${incident.id}`)}
            >
              <td>{incident.incidentId}</td>

              <td>{incident.event}</td>

              <td>
                <span className={`severity ${incident.severity.toLowerCase()}`}>
                  {incident.severity}
                </span>
              </td>

              <td>{incident.score}</td>

              <td>{incident.mitre}</td>

              <td>
                <span className={`status ${incident.status.toLowerCase()}`}>
                  {incident.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentTable;
