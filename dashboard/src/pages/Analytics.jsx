import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Shield, TriangleAlert, Gauge, Zap, BarChart3 } from "lucide-react";

import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import ChartTooltip from "../components/ChartTooltip";
import { EmptyState, ErrorState, SkeletonRows } from "../components/DataState";
import { useIncidents } from "../hooks/useIncidents";
import { SEVERITIES } from "../lib/normalize";
import {
  SEVERITY_COLORS,
  CHART_BLUE,
  GRID_STROKE,
  HOVER_CURSOR,
  xAxisProps,
  yAxisProps,
} from "../lib/chartTheme";

import "../styles/analytics.css";

const dayLabelFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
});

function dailyCounts(incidents) {
  const byDay = new Map();
  for (const incident of incidents) {
    if (!incident.generatedDate) continue;
    const key = incident.generatedDate.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  if (byDay.size === 0) return [];

  const keys = [...byDay.keys()].sort();
  const start = new Date(`${keys[0]}T00:00:00Z`);
  const end = new Date(`${keys[keys.length - 1]}T00:00:00Z`);
  const spanDays = Math.round((end - start) / 86400000) + 1;

  // Fill gap days with zeros so the time axis is honest (cap the fill for
  // very long spans to keep the chart readable).
  if (spanDays > 60) {
    return keys.map((key) => ({
      label: dayLabelFormat.format(new Date(`${key}T00:00:00Z`)),
      count: byDay.get(key),
    }));
  }

  const days = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const date = new Date(t);
    const key = date.toISOString().slice(0, 10);
    days.push({
      label: dayLabelFormat.format(date),
      count: byDay.get(key) ?? 0,
    });
  }
  return days;
}

function topCounts(items, limit) {
  const counts = new Map();
  for (const item of items) {
    if (!item) continue;
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function Analytics() {
  const { incidents, loading, refreshing, error, refresh } = useIncidents();
  const list = useMemo(() => incidents ?? [], [incidents]);

  const model = useMemo(() => {
    const scored = list.filter((i) => typeof i.score === "number");
    const severityData = SEVERITIES.map((name) => ({
      name,
      value: list.filter((i) => i.severity === name).length,
      fill: SEVERITY_COLORS[name],
    })).filter((d) => d.value > 0);

    const allDetections = list.flatMap((i) => i.detections);

    return {
      total: list.length,
      highSeverity: list.filter((i) => i.severity === "Critical" || i.severity === "High").length,
      avgScore: scored.length
        ? Math.round(scored.reduce((sum, i) => sum + i.score, 0) / scored.length)
        : null,
      autoResponses: list
        .flatMap((i) => i.responses)
        .filter((r) => r.status === "Success").length,
      severityData,
      perDay: dailyCounts(list),
      topRules: topCounts(allDetections.map((d) => d.rule), 8),
      topTechniques: topCounts(
        list.flatMap((i) => i.mitre.map((m) => m.id)),
        8,
      ),
      categories: topCounts(allDetections.map((d) => d.category), 6),
    };
  }, [list]);

  if (loading) {
    return (
      <div className="page">
        <PageHeader
          title="Analytics"
          subtitle="Trends and detection breakdowns across all recorded incidents."
        />
        <SkeletonRows rows={1} height={104} />
        <div style={{ height: 16 }} />
        <SkeletonRows rows={2} height={300} />
      </div>
    );
  }

  if (error && list.length === 0) {
    return (
      <div className="page">
        <PageHeader title="Analytics" subtitle="Trends and detection breakdowns." />
        <div className="card">
          <ErrorState message={error} onRetry={refresh} />
        </div>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="page">
        <PageHeader title="Analytics" subtitle="Trends and detection breakdowns." />
        <div className="card">
          <EmptyState
            icon={BarChart3}
            title="Nothing to chart yet"
            message="Analytics light up once CloudGuard records its first incident."
          />
        </div>
      </div>
    );
  }

  const showBarLabels = model.perDay.length <= 16;

  return (
    <div className="page">
      <PageHeader
        title="Analytics"
        subtitle="Trends and detection breakdowns across all recorded incidents."
      />

      <div className={`dim-while-refreshing ${refreshing ? "is-refreshing" : ""}`}>
        <div className="stats-row">
          <SummaryCard
            label="Total incidents"
            value={model.total}
            hint="Stored in the S3 evidence bucket"
            icon={Shield}
            tone="accent"
          />
          <SummaryCard
            label="High severity"
            value={model.highSeverity}
            hint="Rated High or Critical"
            icon={TriangleAlert}
            tone="high"
          />
          <SummaryCard
            label="Average threat score"
            value={model.avgScore ?? "—"}
            hint="Across scored incidents"
            icon={Gauge}
            tone="accent"
          />
          <SummaryCard
            label="Automated responses"
            value={model.autoResponses}
            hint="Actions executed successfully"
            icon={Zap}
            tone="low"
          />
        </div>

        <div className="charts-grid">
          {/* Severity distribution ------------------------------------- */}
          <section className="card card-pad chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Severity distribution</h2>
                <p className="card-subtitle">Share of incidents per severity level</p>
              </div>
            </div>

            <div className="donut-layout">
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={model.severityData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={1.5}
                      stroke="var(--surface)"
                      strokeWidth={2}
                      isAnimationActive={true}
                    >
                      {model.severityData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <strong>{model.total}</strong>
                  <span>incidents</span>
                </div>
              </div>

              <div className="donut-legend">
                {model.severityData.map((entry) => (
                  <div className="legend-row" key={entry.name}>
                    <span className="legend-swatch" style={{ background: entry.fill }} />
                    <span className="legend-name">{entry.name}</span>
                    <span className="legend-value num">{entry.value}</span>
                    <span className="legend-pct muted num">
                      {Math.round((entry.value / model.total) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Incidents per day ------------------------------------------ */}
          <section className="card card-pad chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Incidents over time</h2>
                <p className="card-subtitle">Detections per day (UTC)</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={252}>
              <BarChart data={model.perDay} margin={{ top: 18, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="label" {...xAxisProps} interval="preserveStartEnd" minTickGap={24} />
                <YAxis allowDecimals={false} {...yAxisProps} />
                <Tooltip content={<ChartTooltip />} cursor={HOVER_CURSOR} />
                <Bar
                  dataKey="count"
                  name="Incidents"
                  fill={CHART_BLUE}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                >
                  {showBarLabels && (
                    <LabelList
                      dataKey="count"
                      position="top"
                      formatter={(value) => (value > 0 ? value : "")}
                      style={{ fill: "#a8b3c9", fontSize: 11.5 }}
                    />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* Top triggered rules ---------------------------------------- */}
          <section className="card card-pad chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Most triggered rules</h2>
                <p className="card-subtitle">Detection count per rule across all incidents</p>
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={Math.max(180, model.topRules.length * 38 + 30)}
            >
              <BarChart
                data={model.topRules}
                layout="vertical"
                margin={{ top: 0, right: 34, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" allowDecimals={false} {...xAxisProps} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  {...yAxisProps}
                />
                <Tooltip content={<ChartTooltip />} cursor={HOVER_CURSOR} />
                <Bar
                  dataKey="count"
                  name="Detections"
                  fill={CHART_BLUE}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fill: "#a8b3c9", fontSize: 11.5 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* MITRE techniques ------------------------------------------- */}
          <section className="card card-pad chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">MITRE ATT&amp;CK techniques</h2>
                <p className="card-subtitle">Incidents mapped to each technique</p>
              </div>
            </div>

            {model.topTechniques.length === 0 ? (
              <p className="muted">No MITRE mappings recorded.</p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(180, model.topTechniques.length * 38 + 30)}
              >
                <BarChart
                  data={model.topTechniques}
                  layout="vertical"
                  margin={{ top: 0, right: 34, left: 8, bottom: 0 }}
                >
                  <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} {...xAxisProps} />
                  <YAxis type="category" dataKey="name" width={80} {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} cursor={HOVER_CURSOR} />
                  <Bar
                    dataKey="count"
                    name="Incidents"
                    fill={CHART_BLUE}
                    radius={[0, 4, 4, 0]}
                    maxBarSize={18}
                  >
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fill: "#a8b3c9", fontSize: 11.5 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>

        {/* Detection categories ---------------------------------------- */}
        {model.categories.length > 0 && (
          <section className="card card-pad chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Detections by category</h2>
                <p className="card-subtitle">
                  Where the detection engine is finding activity (IAM, EC2, common behaviour)
                </p>
              </div>
            </div>

            <div className="category-bars">
              {model.categories.map((category) => {
                const max = model.categories[0].count;
                return (
                  <div className="category-row" key={category.name}>
                    <span className="category-name">{category.name}</span>
                    <div className="category-track">
                      <div
                        className="category-fill"
                        style={{ width: `${(category.count / max) * 100}%` }}
                      />
                    </div>
                    <span className="category-count num">{category.count}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Analytics;
