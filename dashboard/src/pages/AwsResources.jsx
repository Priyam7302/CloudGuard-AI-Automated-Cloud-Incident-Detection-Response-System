import { useMemo } from "react";
import {
  ScrollText,
  Route,
  Zap,
  Database,
  Bell,
  Network,
  KeyRound,
  Server,
  Activity,
  ArrowRight,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import { SkeletonRows } from "../components/DataState";
import { useIncidents } from "../hooks/useIncidents";
import { API_BASE_URL } from "../services/api";
import { relativeTime } from "../lib/format";

import "../styles/awsresources.css";

const PIPELINE = ["CloudTrail", "EventBridge", "Lambda", "S3 + SNS"];

function AwsResources() {
  const { incidents, loading, error, lastUpdated, lastLatencyMs } = useIncidents();
  const list = useMemo(() => incidents ?? [], [incidents]);

  const derived = useMemo(() => {
    const detections = list.flatMap((i) => i.detections);
    const categoryCount = (name) =>
      detections.filter((d) => d.category === name).length;
    return {
      total: list.length,
      accountId: list.find((i) => i.actor.accountId)?.actor.accountId ?? null,
      regions: [
        ...new Set(
          list
            .map((i) => i.network.awsRegion)
            .filter((region) => region && region !== "Unknown"),
        ),
      ],
      lastIncident: list[0]?.generatedDate ?? null,
      alertsSent: list.length,
      iamDetections: categoryCount("IAM"),
      ec2Detections: categoryCount("EC2"),
      commonDetections: categoryCount("Common"),
      remediations: list
        .flatMap((i) => i.responses)
        .filter((r) => r.status === "Success" && r.action && r.action !== "Notify")
        .length,
    };
  }, [list]);

  const apiHost = API_BASE_URL ? new URL(API_BASE_URL).host : "not configured";
  const connected = Boolean(lastUpdated) && !error;

  const services = [
    {
      name: "AWS CloudTrail",
      role: "Event source",
      icon: ScrollText,
      description:
        "Records every management API call in the account. Each event enters the detection pipeline the moment it is logged.",
      stat: `${derived.total} events flagged as incidents`,
    },
    {
      name: "Amazon EventBridge",
      role: "Event router",
      icon: Route,
      description:
        "Matches CloudTrail management events and invokes the detection Lambda in real time — no polling, no standing servers.",
      stat: "Streaming CloudTrail → Lambda",
    },
    {
      name: "AWS Lambda",
      role: "Detection & response engine",
      icon: Zap,
      description:
        "cloudguard-ai evaluates 20 hand-written rules, computes the threat score, executes automated remediation and writes the report.",
      stat: `${derived.remediations} automated remediation${derived.remediations === 1 ? "" : "s"} executed`,
    },
    {
      name: "Amazon S3",
      role: "Forensic evidence store",
      icon: Database,
      description:
        "Every incident is preserved as an immutable, timestamped JSON artifact for forensics and audit.",
      stat: `${derived.total} incident reports stored`,
    },
    {
      name: "Amazon SNS",
      role: "Alerting",
      icon: Bell,
      description:
        "Dispatches a formatted alert to subscribed responders for every incident the pipeline produces.",
      stat: `${derived.alertsSent} alerts dispatched`,
    },
    {
      name: "API Gateway",
      role: "Dashboard API",
      icon: Network,
      description:
        "HTTP API exposing GET /incidents and GET /incidents/{id} from the same Lambda — this dashboard is a live client.",
      stat: connected
        ? `Connected · ${lastLatencyMs != null ? `${lastLatencyMs} ms` : "live"}`
        : error
          ? "Unreachable"
          : "Connecting…",
      statTone: connected ? "ok" : error ? "fail" : undefined,
      extra: apiHost,
    },
  ];

  const surfaces = [
    {
      name: "IAM activity",
      icon: KeyRound,
      description: "Users, access keys, policies, login profiles, trust relationships, CloudTrail tampering.",
      count: derived.iamDetections,
    },
    {
      name: "EC2 lifecycle",
      icon: Server,
      description: "Instance launches, stops, terminations, snapshots and security-group changes.",
      count: derived.ec2Detections,
    },
    {
      name: "Behaviour signals",
      icon: Activity,
      description: "Missing MFA, after-hours activity, cross-user operations, scripted user agents.",
      count: derived.commonDetections,
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="AWS Resources"
        subtitle="The serverless pipeline behind CloudGuard — live figures come straight from the incidents API."
      />

      <div className="aws-meta-row">
        {derived.accountId && (
          <span className="chip mono">Account · {derived.accountId}</span>
        )}
        {derived.regions.length > 0 && (
          <span className="chip mono">
            {derived.regions.length === 1 ? "Region" : "Regions"} ·{" "}
            {derived.regions.join(", ")}
          </span>
        )}
        {derived.lastIncident && (
          <span className="chip">
            Last incident {relativeTime(derived.lastIncident)}
          </span>
        )}
      </div>

      {/* Pipeline strip ---------------------------------------------------- */}
      <div className="card card-pad pipeline-strip" aria-label="Detection pipeline order">
        {PIPELINE.map((step, index) => (
          <span className="pipeline-step-wrap" key={step}>
            <span className={`pipeline-step ${index === 2 ? "hot" : ""}`}>{step}</span>
            {index < PIPELINE.length - 1 && (
              <ArrowRight size={15} className="pipeline-arrow" />
            )}
          </span>
        ))}
        <span className="pipeline-note muted">
          detect → analyze → respond → preserve, inside one Lambda invocation
        </span>
      </div>

      {loading ? (
        <SkeletonRows rows={2} height={150} />
      ) : (
        <>
          <div className="service-grid">
            {services.map(({ name, role, icon: Icon, description, stat, statTone, extra }) => (
              <section className="card card-pad service-card" key={name}>
                <div className="service-head">
                  <span className="service-icon">
                    <Icon size={17} />
                  </span>
                  <div>
                    <h2 className="card-title">{name}</h2>
                    <p className="service-role">{role}</p>
                  </div>
                </div>
                <p className="service-desc">{description}</p>
                <div className="service-foot">
                  <span className={`service-stat ${statTone ?? ""}`}>{stat}</span>
                  {extra && <span className="muted mono service-extra truncate">{extra}</span>}
                </div>
              </section>
            ))}
          </div>

          <h2 className="section-heading">Monitored surfaces</h2>
          <div className="surface-grid">
            {surfaces.map(({ name, icon: Icon, description, count }) => (
              <section className="card card-pad surface-card" key={name}>
                <span className="service-icon">
                  <Icon size={17} />
                </span>
                <div className="surface-body">
                  <h3 className="card-title">{name}</h3>
                  <p className="service-desc">{description}</p>
                </div>
                <div className="surface-count">
                  <strong className="num">{count}</strong>
                  <span>detections</span>
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AwsResources;
