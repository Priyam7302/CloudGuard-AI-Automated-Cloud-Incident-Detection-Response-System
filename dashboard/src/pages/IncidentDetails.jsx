import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Globe,
  Fingerprint,
  Check,
  X,
  Minus,
  Zap,
  ListChecks,
  Braces,
  Crosshair,
  FileSearch,
} from "lucide-react";

import SeverityBadge from "../components/SeverityBadge";
import StatusPill from "../components/StatusPill";
import ScoreMeter from "../components/ScoreMeter";
import MitreChip from "../components/MitreChip";
import CopyButton from "../components/CopyButton";
import { ErrorState, SkeletonRows } from "../components/DataState";
import { getIncident } from "../services/api";
import { useIncidents } from "../hooks/useIncidents";
import { normalizeIncident } from "../lib/normalize";
import { formatDateTime, relativeTime, shortId } from "../lib/format";

import "../styles/incidentdetails.css";

function FlagRow({ label, value, invertGood = false }) {
  // value: true / false / null. `invertGood` marks flags where true is bad.
  const unknown = value == null;
  const good = invertGood ? value === false : value === true;
  const Icon = unknown ? Minus : good ? Check : X;
  const tone = unknown ? "skip" : good ? "ok" : "fail";
  const text = unknown ? "Unknown" : value ? "Yes" : "No";

  return (
    <div className="flag-row">
      <span className={`flag-icon ${tone}`}>
        <Icon size={13} strokeWidth={2.8} />
      </span>
      <span className="flag-label">{label}</span>
      <span className={`flag-value ${tone}`}>{text}</span>
    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className={`info-value ${mono ? "mono" : ""}`} title={typeof value === "string" ? value : undefined}>
        {value ?? "—"}
      </span>
    </div>
  );
}

function IncidentDetails() {
  const { id } = useParams();
  const { incidents } = useIncidents();

  const cached = useMemo(
    () => incidents?.find((incident) => incident.id === id) ?? null,
    [incidents, id],
  );

  const [detail, setDetail] = useState({ id, fetched: null, failed: false, loading: true });

  // Reset for a new incident id during render, not in the effect body.
  if (detail.id !== id) {
    setDetail({ id, fetched: null, failed: false, loading: true });
  }

  useEffect(() => {
    let cancelled = false;

    getIncident(id)
      .then((response) => {
        if (!cancelled) {
          setDetail({ id, fetched: normalizeIncident(response.data), failed: false, loading: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail({ id, fetched: null, failed: true, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const { fetched, failed, loading } = detail;

  // Prefer the fresh fetch; fall back to the cached list entry so the page
  // still renders if the detail route hiccups (it 500s on unknown IDs).
  const incident = fetched ?? cached;

  if (!incident && loading) {
    return (
      <div className="page details-page">
        <SkeletonRows rows={1} height={180} />
        <div style={{ height: 16 }} />
        <SkeletonRows rows={3} height={120} />
      </div>
    );
  }

  if (!incident && failed) {
    return (
      <div className="page">
        <ErrorState message="This incident could not be loaded — it may have been removed from the evidence store.">
        </ErrorState>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/incidents" className="btn">
            <ArrowLeft size={14} />
            Back to incidents
          </Link>
        </div>
      </div>
    );
  }

  if (!incident) return null;

  const rawJson = JSON.stringify(incident.raw, null, 2);

  return (
    <div className="page details-page">
      <Link to="/incidents" className="btn btn-ghost back-link">
        <ArrowLeft size={15} />
        All incidents
      </Link>

      {/* Header ---------------------------------------------------------- */}
      <section className="card card-pad details-hero">
        <div className="hero-main">
          <div className="hero-title-row">
            <SeverityBadge severity={incident.severity} />
            {incident.legacy && (
              <span className="chip" title="Stored in the earlier report schema">
                Legacy format
              </span>
            )}
          </div>

          <h1 className="hero-title">{incident.eventName ?? "Unknown event"}</h1>
          <p className="hero-summary">{incident.summary}</p>

          <div className="hero-meta">
            <span className="chip mono">
              {shortId(incident.id)}
              <CopyButton text={incident.id ?? ""} label="Copy incident ID" />
            </span>
            {incident.eventSource && <span className="chip mono">{incident.eventSource}</span>}
            {incident.network.awsRegion && (
              <span className="chip mono">{incident.network.awsRegion}</span>
            )}
            <span
              className="chip"
              title={formatDateTime(incident.generatedDate)}
            >
              {relativeTime(incident.generatedDate)} · {formatDateTime(incident.generatedDate)}
            </span>
          </div>
        </div>

        <div className="hero-score">
          <p className="hero-score-label">Threat score</p>
          <p className="hero-score-value num">
            {incident.score ?? "—"}
            <span className="hero-score-max">/100</span>
          </p>
          <ScoreMeter score={incident.score} severity={incident.severity} height={8} />
          <p className="hero-score-sub">
            {incident.detections.length > 0
              ? `${incident.detections.length} detection${incident.detections.length === 1 ? "" : "s"} triggered`
              : "No rule breakdown available"}
          </p>
        </div>
      </section>

      {/* Identity / network / behaviour ----------------------------------- */}
      <div className="details-grid">
        <section className="card card-pad">
          <div className="card-header">
            <h2 className="card-title">
              <User size={15} className="title-icon" /> Actor
            </h2>
          </div>
          <InfoRow label="IAM user" value={incident.actor.user} mono />
          <InfoRow label="Target user" value={incident.actor.targetUser} mono />
          <InfoRow label="Identity type" value={incident.actor.userType} />
          <InfoRow label="Account ID" value={incident.actor.accountId} mono />
        </section>

        <section className="card card-pad">
          <div className="card-header">
            <h2 className="card-title">
              <Globe size={15} className="title-icon" /> Network
            </h2>
          </div>
          <InfoRow label="Source IP" value={incident.network.sourceIp} mono />
          <InfoRow label="AWS region" value={incident.network.awsRegion} mono />
          <InfoRow label="Event time" value={formatDateTime(incident.eventTime)} />
          <InfoRow label="User agent" value={incident.network.userAgent} mono />
        </section>

        <section className="card card-pad">
          <div className="card-header">
            <h2 className="card-title">
              <Fingerprint size={15} className="title-icon" /> Behaviour signals
            </h2>
          </div>
          <FlagRow label="MFA used" value={incident.flags.mfaUsed} />
          <FlagRow label="After-hours activity" value={incident.flags.afterHours} invertGood />
          <FlagRow label="Cross-user operation" value={incident.flags.crossUser} invertGood />
        </section>
      </div>

      {/* Detections -------------------------------------------------------- */}
      {incident.detections.length > 0 && (
        <section className="card card-pad">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <FileSearch size={15} className="title-icon" /> Triggered detections
              </h2>
              <p className="card-subtitle">
                Each rule adds its score to the cumulative threat score
              </p>
            </div>
            <span className="chip">{incident.detections.length} rules matched</span>
          </div>

          <div className="detections-list">
            {incident.detections.map((detection, index) => (
              <article className="detection-item" key={`${detection.rule}-${index}`}>
                <div className="detection-head">
                  <strong>{detection.rule}</strong>
                  {detection.category && <span className="chip">{detection.category}</span>}
                  <SeverityBadge severity={detection.severity} />
                  <span className="detection-score num">
                    {detection.score != null ? `+${detection.score}` : ""}
                  </span>
                </div>
                {detection.reason && <p className="detection-reason">{detection.reason}</p>}
                {detection.mitre && (
                  <div className="detection-mitre">
                    <MitreChip mitre={detection.mitre} />
                    {detection.mitre.name && (
                      <span className="muted">{detection.mitre.name}</span>
                    )}
                    {detection.mitre.tactics?.length > 0 && (
                      <span className="muted">· {detection.mitre.tactics.join(", ")}</span>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="details-grid-2">
        {/* Automated response ------------------------------------------- */}
        <section className="card card-pad">
          <div className="card-header">
            <h2 className="card-title">
              <Zap size={15} className="title-icon" /> Automated response
            </h2>
          </div>

          {incident.responses.length === 0 ? (
            <p className="muted">No automated response was recorded for this incident.</p>
          ) : (
            <div className="response-list">
              {incident.responses.map((response, index) => (
                <div className="response-item" key={index}>
                  <StatusPill status={response.status} />
                  <div className="response-body">
                    <strong>
                      {response.action ?? "No action"}
                      {response.rule ? ` · ${response.rule}` : ""}
                    </strong>
                    {response.message && <p>{response.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommendations ---------------------------------------------- */}
        <section className="card card-pad">
          <div className="card-header">
            <h2 className="card-title">
              <ListChecks size={15} className="title-icon" /> Recommended actions
            </h2>
          </div>

          {incident.recommendations.length === 0 ? (
            <p className="muted">No recommendations recorded.</p>
          ) : (
            <ul className="recommendation-list">
              {incident.recommendations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

          {incident.mitre.length > 0 && (
            <>
              <div className="section-divider" />
              <h3 className="mini-title">
                <Crosshair size={13} /> MITRE ATT&amp;CK mapping
              </h3>
              <div className="mitre-summary">
                {incident.mitre.map((m) => (
                  <div className="mitre-line" key={m.id}>
                    <MitreChip mitre={m} />
                    {(m.name || m.tactics?.length > 0) && (
                      <span className="text-2">
                        {m.name}
                        {m.tactics?.length > 0 && (
                          <span className="muted">
                            {m.name ? " · " : ""}
                            {m.tactics.join(", ")}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Legacy evidence ---------------------------------------------------- */}
      {incident.evidence.length > 0 && (
        <section className="card card-pad">
          <div className="card-header">
            <h2 className="card-title">
              <FileSearch size={15} className="title-icon" /> Evidence
            </h2>
          </div>
          <div className="evidence-grid">
            {incident.evidence.map((item, index) => (
              <div className="info-row" key={index}>
                <span className="info-label">{item.type}</span>
                <span className="info-value">{String(item.value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Raw report --------------------------------------------------------- */}
      <section className="card">
        <details className="raw-details">
          <summary>
            <span className="row">
              <Braces size={15} className="title-icon" />
              <span className="card-title">Raw incident report</span>
              <span className="card-subtitle">exact JSON stored in S3</span>
            </span>
            <CopyButton text={rawJson} label="Copy JSON" />
          </summary>
          <pre className="raw-json mono">{rawJson}</pre>
        </details>
      </section>
    </div>
  );
}

export default IncidentDetails;
