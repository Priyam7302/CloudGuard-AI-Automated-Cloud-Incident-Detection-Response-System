import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "../styles/incidenttable.css";

function IncidentTable() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const response = await api.get("/incidents");

      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h3>Loading incidents...</h3>;
  }

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
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.incident_id}
              onClick={() => navigate(`/incidents/${incident.incident_id}`)}
            >
              <td>{incident.incident_id.slice(0, 8)}...</td>

              <td>{incident.event_name}</td>

              <td>
                <span className={`severity ${incident.severity.toLowerCase()}`}>
                  {incident.severity}
                </span>
              </td>

              <td>{incident.threat_score}</td>

              <td>{incident.mitre.technique_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentTable;
