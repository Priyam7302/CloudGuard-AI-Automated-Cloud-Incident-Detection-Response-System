import { useNavigate } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";

import SeverityBadge from "./SeverityBadge";
import ScoreMeter from "./ScoreMeter";
import MitreChip from "./MitreChip";
import { EmptyState, ErrorState, SkeletonRows } from "./DataState";
import { relativeTime, shortId } from "../lib/format";

import "../styles/incidenttable.css";

const SOURCE_LABELS = {
  "iam.amazonaws.com": "IAM",
  "ec2.amazonaws.com": "EC2",
  "cloudtrail.amazonaws.com": "CloudTrail",
  "s3.amazonaws.com": "S3",
};

function sourceLabel(incident) {
  if (incident.eventSource) {
    return (
      SOURCE_LABELS[incident.eventSource] ??
      incident.eventSource.split(".")[0].toUpperCase()
    );
  }
  return null;
}

/**
 * Presentational incidents table. Data comes in via props (from the shared
 * incidents store) so every page shows the same, consistently sorted list.
 */
function IncidentTable({ incidents, loading, error, onRetry, emptyMessage }) {
  const navigate = useNavigate();

  if (loading) {
    return <SkeletonRows rows={6} height={47} />;
  }

  if (error && !incidents?.length) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!incidents?.length) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No incidents detected"
        message={
          emptyMessage ??
          "CloudGuard hasn't flagged any CloudTrail activity yet. New detections appear here in real time."
        }
      />
    );
  }

  function open(incident) {
    if (incident.id) navigate(`/incidents/${incident.id}`);
  }

  return (
    <div className="table-scroll">
      <table className="data-table incident-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Event</th>
            <th className="hide-md">Actor</th>
            <th>Severity</th>
            <th className="col-score">Threat score</th>
            <th className="hide-md">MITRE</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id ?? incident.generatedAt}
              className="row-link"
              tabIndex={0}
              onClick={() => open(incident)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(incident);
                }
              }}
            >
              <td>
                <div className="stack-xs">
                  <span className="mono incident-id">{shortId(incident.id)}</span>
                  <span className="muted cell-sub">
                    {relativeTime(incident.generatedDate)}
                  </span>
                </div>
              </td>

              <td>
                <div className="row">
                  <span className="event-name truncate">
                    {incident.eventName ?? "Unknown event"}
                  </span>
                  {sourceLabel(incident) && (
                    <span className="chip">{sourceLabel(incident)}</span>
                  )}
                </div>
              </td>

              <td className="hide-md">
                <div className="stack-xs">
                  <span className="truncate actor-cell">
                    {incident.actor.user ?? "—"}
                  </span>
                  {incident.actor.targetUser &&
                    incident.actor.targetUser !== incident.actor.user && (
                      <span className="muted cell-sub truncate">
                        → {incident.actor.targetUser}
                      </span>
                    )}
                </div>
              </td>

              <td>
                <SeverityBadge severity={incident.severity} />
              </td>

              <td className="col-score">
                <div className="score-cell">
                  <span className="num score-num">{incident.score ?? "—"}</span>
                  <ScoreMeter score={incident.score} severity={incident.severity} height={5} />
                </div>
              </td>

              <td className="hide-md">
                <div className="row mitre-cell">
                  {incident.mitre.slice(0, 2).map((m) => (
                    <MitreChip key={m.id} mitre={m} />
                  ))}
                  {incident.mitre.length > 2 && (
                    <span className="chip">+{incident.mitre.length - 2}</span>
                  )}
                  {incident.mitre.length === 0 && <span className="muted">—</span>}
                </div>
              </td>

              <td className="col-chevron">
                <ChevronRight size={15} className="row-chevron" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentTable;
