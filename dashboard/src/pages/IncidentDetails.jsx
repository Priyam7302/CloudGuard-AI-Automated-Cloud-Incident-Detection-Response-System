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

      console.log("Incident Details:", response.data);

      setIncident(response.data);
    } catch (error) {
      console.error("Failed to fetch incident:", error);
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

  // ==========================
  // Support BOTH backend formats
  // ==========================

  const eventName =
    incident.event?.event_name || incident.event_name || "Unknown Event";

  const severity =
    incident.threat?.severity ||
    incident.risk?.severity ||
    incident.severity ||
    "Unknown";

  const threatScore =
    incident.threat?.threat_score ??
    incident.risk?.risk_score ??
    incident.threat_score ??
    0;

  const summary =
    incident.threat?.summary || incident.summary || "No summary available.";

  const generatedAt =
    incident.generated_at || incident.event?.event_time || "-";

  const mitre =
    incident.mitre ||
    incident.threat?.detections?.find((d) => typeof d.mitre === "object")
      ?.mitre ||
    incident.risk?.detections?.find((d) => typeof d.mitre === "object")
      ?.mitre ||
    {};

  const context = incident.context || {};

  const evidence = incident.evidence || [];

  const recommendations = incident.recommendations || [];

  return (
    <div className="details-container">
      {/* Header */}

      <div className="summary-card">
        <div className="summary-header">
          <h1>{eventName}</h1>

          <span className={`severity-badge ${severity.toLowerCase()}`}>
            {severity}
          </span>
        </div>

        <p className="summary-text">{summary}</p>

        <div className="score-section">
          <h3>Threat Score</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${threatScore}%` }}
            ></div>
          </div>

          <strong>{threatScore}/100</strong>
        </div>

        <p className="generated-time">Generated At: {generatedAt}</p>
      </div>

      {/* MITRE */}

      <div className="section-card">
        <h2>MITRE ATT&CK</h2>

        <div className="info-grid">
          <div>
            <strong>Technique ID</strong>
            <p>{mitre.technique_id || "-"}</p>
          </div>

          <div>
            <strong>Technique Name</strong>
            <p>{mitre.technique_name || "-"}</p>
          </div>

          <div>
            <strong>Tactics</strong>
            <p>{mitre.tactics?.join(", ") || "-"}</p>
          </div>
        </div>
      </div>

      {/* Context */}

      <div className="section-card">
        <h2>Context</h2>

        <div className="info-grid">
          <div>
            <strong>Actor</strong>
            <p>{context.actor || "-"}</p>
          </div>

          <div>
            <strong>Target User</strong>
            <p>{context.target_user || "-"}</p>
          </div>

          <div>
            <strong>Source IP</strong>
            <p>{context.source_ip || "-"}</p>
          </div>

          <div>
            <strong>AWS Region</strong>
            <p>{context.aws_region || "-"}</p>
          </div>

          <div>
            <strong>MFA</strong>
            <p>{context.mfa_used ? "Enabled" : "Disabled"}</p>
          </div>

          <div>
            <strong>Cross User Action</strong>
            <p>{context.is_cross_user_action ? "Yes" : "No"}</p>
          </div>

          <div>
            <strong>After Hours</strong>
            <p>{context.is_after_hours ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Evidence */}

      <div className="section-card">
        <h2>Evidence</h2>

        {evidence.length > 0 ? (
          <ul className="list">
            {evidence.map((item, index) => (
              <li key={index}>
                <strong>{item.type}</strong> : {String(item.value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No evidence available.</p>
        )}
      </div>

      {/* Recommendations */}

      <div className="section-card">
        <h2>Recommendations</h2>

        {recommendations.length > 0 ? (
          <ul className="list">
            {recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
}

export default IncidentDetails;