import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIncident } from "../services/api";

import "../styles/incidentdetails.css";

function IncidentDetails() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncident();
  }, []);

  async function fetchIncident() {
    try {
      const response = await getIncident(id);
      setIncident(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h2 className="loading">Loading Incident...</h2>;
  }

  if (!incident) {
    return <h2 className="loading">Incident Not Found</h2>;
  }

  return (
    <div className="details-container">
      {/* Header */}

      <div className="summary-card">
        <div className="summary-header">
          <h1>{incident.event_name}</h1>

          <span className={`severity-badge ${incident.severity.toLowerCase()}`}>
            {incident.severity}
          </span>
        </div>

        <p className="summary-text">{incident.summary}</p>

        <div className="score-section">
          <h3>Threat Score</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${incident.threat_score}%` }}
            ></div>
          </div>

          <strong>{incident.threat_score}/100</strong>
        </div>

        <p className="generated-time">Generated At: {incident.generated_at}</p>
      </div>

      {/* MITRE */}

      <div className="section-card">
        <h2>MITRE ATT&CK</h2>

        <div className="info-grid">
          <div>
            <strong>Technique ID</strong>
            <p>{incident.mitre.technique_id}</p>
          </div>

          <div>
            <strong>Technique Name</strong>
            <p>{incident.mitre.technique_name}</p>
          </div>

          <div>
            <strong>Tactics</strong>
            <p>{incident.mitre.tactics.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Context */}

      <div className="section-card">
        <h2>Context</h2>

        <div className="info-grid">
          <div>
            <strong>Actor</strong>
            <p>{incident.context.actor}</p>
          </div>

          <div>
            <strong>Target User</strong>
            <p>{incident.context.target_user}</p>
          </div>

          <div>
            <strong>Source IP</strong>
            <p>{incident.context.source_ip}</p>
          </div>

          <div>
            <strong>AWS Region</strong>
            <p>{incident.context.aws_region}</p>
          </div>

          <div>
            <strong>MFA</strong>
            <p>{incident.context.mfa_used ? "Enabled" : "Disabled"}</p>
          </div>

          <div>
            <strong>Cross User Action</strong>
            <p>{incident.context.is_cross_user_action ? "Yes" : "No"}</p>
          </div>

          <div>
            <strong>After Hours</strong>
            <p>{incident.context.is_after_hours ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Evidence */}

      <div className="section-card">
        <h2>Evidence</h2>

        <ul className="list">
          {incident.evidence.map((item, index) => (
            <li key={index}>
              <strong>{item.type}</strong> : {String(item.value)}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}

      <div className="section-card">
        <h2>Recommendations</h2>

        <ul className="list">
          {incident.recommendations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IncidentDetails;

