import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  TriangleAlert,
  Gauge,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Check,
  X,
  Minus,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import IncidentTable from "../components/IncidentTable";
import { SkeletonRows } from "../components/DataState";
import { useIncidents } from "../hooks/useIncidents";
import { countBySeverity } from "../lib/normalize";
import { relativeTime } from "../lib/format";

const RECENT_LIMIT = 7;

const FEED_ICONS = {
  success: { className: "ok", Icon: Check },
  failed: { className: "fail", Icon: X },
  skipped: { className: "skip", Icon: Minus },
};

function Dashboard() {
  const { incidents, loading, refreshing, error, refresh } = useIncidents();
  const list = useMemo(() => incidents ?? [], [incidents]);

  const severityCounts = useMemo(() => countBySeverity(list), [list]);

  const stats = useMemo(() => {
    const detections = list.reduce((sum, i) => sum + i.detections.length, 0);
    const responses = list.flatMap((incident) =>
      incident.responses.map((response) => ({ ...response, incident })),
    );
    return {
      detections,
      responsesSucceeded: responses.filter((r) => r.status === "Success").length,
      mfaAbsent: list.filter((i) => i.flags.mfaUsed === false).length,
      afterHours: list.filter((i) => i.flags.afterHours === true).length,
      crossUser: list.filter((i) => i.flags.crossUser === true).length,
      recentResponses: responses.slice(0, 6),
    };
  }, [list]);

  return (
    <div className="page">
      <PageHeader
        title="Security Overview"
        subtitle="Live CloudTrail threat detection and automated response across your AWS account."
      >
        <Link to="/analytics" className="btn">
          View analytics
          <ArrowUpRight size={14} />
        </Link>
      </PageHeader>

      <div className={`dim-while-refreshing ${refreshing ? "is-refreshing" : ""}`}>
        {loading ? (
          <SkeletonRows rows={1} height={104} />
        ) : (
          <div className="stats-row">
            <SummaryCard
              label="Critical"
              value={severityCounts.Critical}
              hint="Threat score ≥ 100"
              icon={ShieldAlert}
              tone="critical"
            />
            <SummaryCard
              label="High"
              value={severityCounts.High}
              hint="Threat score 70–99"
              icon={TriangleAlert}
              tone="high"
            />
            <SummaryCard
              label="Medium"
              value={severityCounts.Medium}
              hint="Threat score 40–69"
              icon={Gauge}
              tone="medium"
            />
            <SummaryCard
              label="Low"
              value={severityCounts.Low}
              hint="Threat score below 40"
              icon={ShieldCheck}
              tone="low"
            />
          </div>
        )}

        <div className="overview-grid">
          <section className="card card-pad">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recent incidents</h2>
                <p className="card-subtitle">
                  Latest detections from the CloudGuard pipeline
                </p>
              </div>
              <Link to="/incidents" className="btn btn-ghost">
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <IncidentTable
              incidents={list.slice(0, RECENT_LIMIT)}
              loading={loading}
              error={error}
              onRetry={refresh}
            />
          </section>

          <div className="overview-side">
            <section className="card card-pad">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Automated responses</h2>
                  <p className="card-subtitle">Actions taken by the response engine</p>
                </div>
                <span className="chip chip-accent">
                  <Zap size={11} />
                  {stats.responsesSucceeded} executed
                </span>
              </div>

              {loading ? (
                <SkeletonRows rows={4} height={40} />
              ) : stats.recentResponses.length === 0 ? (
                <p className="muted">No automated actions recorded yet.</p>
              ) : (
                <div className="feed-list">
                  {stats.recentResponses.map((response, index) => {
                    const { className, Icon } =
                      FEED_ICONS[(response.status ?? "").toLowerCase()] ??
                      FEED_ICONS.skipped;
                    return (
                      <div className="feed-item" key={index}>
                        <span className={`feed-icon ${className}`}>
                          <Icon size={14} strokeWidth={2.6} />
                        </span>
                        <div className="feed-body">
                          <strong>
                            {response.action ?? "No action"}
                            {response.rule ? ` · ${response.rule}` : ""}
                          </strong>
                          {response.message && <p>{response.message}</p>}
                          <time>
                            {relativeTime(response.incident.generatedDate)}
                          </time>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="card card-pad">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Detection posture</h2>
                  <p className="card-subtitle">Signals across all incidents</p>
                </div>
              </div>

              {loading ? (
                <SkeletonRows rows={4} height={22} />
              ) : (
                <div className="posture-list">
                  <div className="posture-item">
                    <span>Total incidents</span>
                    <strong className="num">{list.length}</strong>
                  </div>
                  <div className="posture-item">
                    <span>Detections triggered</span>
                    <strong className="num">{stats.detections}</strong>
                  </div>
                  <div className="posture-item">
                    <span>Actions without MFA</span>
                    <strong className="num">{stats.mfaAbsent}</strong>
                  </div>
                  <div className="posture-item">
                    <span>After-hours activity</span>
                    <strong className="num">{stats.afterHours}</strong>
                  </div>
                  <div className="posture-item">
                    <span>Cross-user operations</span>
                    <strong className="num">{stats.crossUser}</strong>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
