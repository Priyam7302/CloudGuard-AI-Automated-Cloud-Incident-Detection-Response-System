/**
 * Incident normalizer.
 *
 * The S3 bucket contains two generations of incident reports:
 *
 *  - New format (backend/reports/incident_report.py):
 *      { incident_id, generated_at, event{}, actor{}, network{}, context{},
 *        risk{ risk_score, severity, detections[] },
 *        threat{ threat_score, severity, detections[], total_detections },
 *        response: [{ rule, action, status, message }] }
 *
 *  - Legacy format (earlier deployments still stored in the bucket):
 *      { incident_id, generated_at, event_name, severity, threat_score, summary,
 *        mitre{ technique_id, technique_name, tactics },
 *        context{ actor, target_user, source_ip, aws_region, event_time,
 *                 mfa_used, is_after_hours, is_cross_user_action },
 *        evidence[], recommendations[], response?: { action, status, message } }
 *
 * Every page renders from the normalized shape produced here, so format
 * differences are handled in exactly one place.
 */

export const SEVERITIES = ["Critical", "High", "Medium", "Low"];

export const SEVERITY_RANK = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
  Unknown: 0,
};

// Thresholds mirror backend/engines/threat_engine.py
export function severityFromScore(score) {
  if (score == null || Number.isNaN(score)) return "Unknown";
  if (score >= 100) return "Critical";
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

// Safari rejects ISO fractions longer than 3 digits (Lambda emits 6).
export function parseDate(iso) {
  if (!iso) return null;
  const date = new Date(String(iso).replace(/\.(\d{3})\d+/, ".$1"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeMitre(mitre) {
  if (!mitre) return null;
  if (typeof mitre === "string") {
    return { id: mitre, name: null, tactics: [] };
  }
  return {
    id: mitre.technique_id ?? null,
    name: mitre.technique_name ?? null,
    tactics: Array.isArray(mitre.tactics) ? mitre.tactics : [],
  };
}

function normalizeDetection(detection) {
  return {
    rule: detection.rule ?? "Unknown rule",
    category: detection.category ?? null,
    severity: SEVERITIES.includes(detection.severity)
      ? detection.severity
      : "Unknown",
    score: typeof detection.score === "number" ? detection.score : null,
    reason: detection.reason ?? null,
    recommendation: detection.recommendation ?? null,
    mitre: normalizeMitre(detection.mitre),
  };
}

// New format stores an array of actions; legacy stores a single object.
function normalizeResponses(response) {
  const items = Array.isArray(response) ? response : response ? [response] : [];
  return items
    .filter((item) => item && (item.action || item.rule || item.message))
    .map((item) => ({
      rule: item.rule && item.rule !== "None" ? item.rule : null,
      action: item.action ?? null,
      status: item.status ?? "Unknown",
      message: item.message ?? null,
    }));
}

function buildSummary({ eventName, actor, detections, score, severity }) {
  if (!eventName) return "Incident recorded by CloudGuard AI.";
  const target =
    actor.targetUser && actor.targetUser !== actor.user
      ? ` targeting '${actor.targetUser}'`
      : "";
  const by = actor.user ? ` by '${actor.user}'` : "";
  const count = detections.length;
  const detectionPart = count
    ? `${count} detection${count === 1 ? "" : "s"} triggered`
    : "recorded";
  const scorePart = score != null ? `, threat score ${score} (${severity})` : "";
  return `${eventName}${by}${target} — ${detectionPart}${scorePart}.`;
}

export function normalizeIncident(raw) {
  const legacy = !raw.event && !raw.actor;
  const context = raw.context ?? {};
  const threat = raw.threat ?? {};
  const risk = raw.risk ?? {};

  const eventName = raw.event?.event_name ?? raw.event_name ?? context.event_name ?? null;
  const eventTime = raw.event?.event_time ?? context.event_time ?? null;

  const actor = {
    user: raw.actor?.user ?? context.actor ?? null,
    targetUser: raw.actor?.target_user ?? context.target_user ?? null,
    userType: raw.actor?.user_type ?? null,
    accountId: raw.actor?.account_id ?? null,
  };

  const network = {
    sourceIp: raw.network?.source_ip ?? context.source_ip ?? null,
    awsRegion: raw.network?.aws_region ?? context.aws_region ?? null,
    userAgent: raw.network?.user_agent ?? null,
  };

  const flags = {
    mfaUsed: context.mfa_used ?? null,
    afterHours: context.after_hours ?? context.is_after_hours ?? null,
    crossUser: context.cross_user_action ?? context.is_cross_user_action ?? null,
  };

  const rawScore = threat.threat_score ?? risk.risk_score ?? raw.threat_score;
  const score = typeof rawScore === "number" ? rawScore : null;

  const declaredSeverity = threat.severity ?? risk.severity ?? raw.severity;
  const severity = SEVERITIES.includes(declaredSeverity)
    ? declaredSeverity
    : severityFromScore(score);

  const detections = (threat.detections ?? risk.detections ?? []).map(
    normalizeDetection,
  );

  // Unique MITRE techniques across detections plus the legacy top-level field.
  const mitre = [];
  const seenTechniques = new Set();
  for (const candidate of [
    ...detections.map((d) => d.mitre),
    normalizeMitre(raw.mitre),
  ]) {
    if (candidate?.id && !seenTechniques.has(candidate.id)) {
      seenTechniques.add(candidate.id);
      mitre.push(candidate);
    }
  }

  const recommendations = Array.isArray(raw.recommendations)
    ? raw.recommendations
    : [
        ...new Set(
          detections.map((d) => d.recommendation).filter(Boolean),
        ),
      ];

  return {
    id: raw.incident_id ?? null,
    legacy,
    raw,
    generatedAt: raw.generated_at ?? eventTime ?? null,
    generatedDate: parseDate(raw.generated_at ?? eventTime),
    eventName,
    eventSource: raw.event?.event_source ?? null,
    eventTime,
    actor,
    network,
    flags,
    severity,
    score,
    detections,
    responses: normalizeResponses(raw.response),
    summary:
      raw.summary ??
      buildSummary({ eventName, actor, detections, score, severity }),
    evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
    recommendations,
    mitre,
  };
}

export function sortByNewest(incidents) {
  return [...incidents].sort(
    (a, b) => (b.generatedDate?.getTime() ?? 0) - (a.generatedDate?.getTime() ?? 0),
  );
}

export function countBySeverity(incidents) {
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0, Unknown: 0 };
  for (const incident of incidents) {
    counts[incident.severity] = (counts[incident.severity] ?? 0) + 1;
  }
  return counts;
}
