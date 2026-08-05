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

      console.log("Incidents:", response.data);

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
          {incidents.map((incident) => {
            // Supports BOTH old and new backend formats

            const eventName =
              incident.event?.event_name || incident.event_name || "Unknown";

            const severity =
              incident.threat?.severity ||
              incident.risk?.severity ||
              incident.severity ||
              "Unknown";

            const threatScore =
              incident.threat?.threat_score ??
              incident.risk?.risk_score ??
              incident.threat_score ??
              "-";

            const mitreTechnique =
              incident.mitre?.technique_id ||
              incident.threat?.detections?.find(
                (d) => typeof d.mitre === "object",
              )?.mitre?.technique_id ||
              incident.risk?.detections?.find(
                (d) => typeof d.mitre === "object",
              )?.mitre?.technique_id ||
              "-";

            return (
              <tr
                key={incident.incident_id}
                onClick={() => navigate(`/incidents/${incident.incident_id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  {incident.incident_id
                    ? `${incident.incident_id.slice(0, 8)}...`
                    : "-"}
                </td>

                <td>{eventName}</td>

                <td>
                  <span className={`severity ${severity.toLowerCase()}`}>
                    {severity}
                  </span>
                </td>

                <td>{threatScore}</td>

                <td>{mitreTechnique}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentTable;
