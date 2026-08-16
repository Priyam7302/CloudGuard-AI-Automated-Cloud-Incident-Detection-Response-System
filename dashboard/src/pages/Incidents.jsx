import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import PageHeader from "../components/PageHeader";
import IncidentTable from "../components/IncidentTable";
import { useIncidents } from "../hooks/useIncidents";
import { SEVERITIES } from "../lib/normalize";

const SORTS = {
  newest: {
    label: "Newest first",
    fn: (a, b) => (b.generatedDate?.getTime() ?? 0) - (a.generatedDate?.getTime() ?? 0),
  },
  oldest: {
    label: "Oldest first",
    fn: (a, b) => (a.generatedDate?.getTime() ?? 0) - (b.generatedDate?.getTime() ?? 0),
  },
  score: {
    label: "Highest score",
    fn: (a, b) => (b.score ?? -1) - (a.score ?? -1),
  },
};

function matchesQuery(incident, query) {
  const haystack = [
    incident.id,
    incident.eventName,
    incident.actor.user,
    incident.actor.targetUser,
    incident.network.sourceIp,
    incident.network.awsRegion,
    ...incident.mitre.map((m) => m.id),
    ...incident.detections.map((d) => d.rule),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function Incidents() {
  const { incidents, loading, refreshing, error, refresh } = useIncidents();
  const list = useMemo(() => incidents ?? [], [incidents]);

  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("All");
  const [sort, setSort] = useState("newest");

  const severityCounts = useMemo(() => {
    const counts = { All: list.length };
    for (const level of SEVERITIES) {
      counts[level] = list.filter((i) => i.severity === level).length;
    }
    return counts;
  }, [list]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return list
      .filter((incident) => severity === "All" || incident.severity === severity)
      .filter((incident) => !normalizedQuery || matchesQuery(incident, normalizedQuery))
      .sort(SORTS[sort].fn);
  }, [list, query, severity, sort]);

  const hasFilters = query.trim() !== "" || severity !== "All";

  return (
    <div className="page">
      <PageHeader
        title="Incidents"
        subtitle="Investigate every incident flagged by the detection engine."
      />

      <div className="card">
        <div className="card-pad incidents-toolbar">
          <div className="search-box incidents-search">
            <Search size={15} />
            <input
              type="search"
              className="input"
              placeholder="Search by event, actor, IP, MITRE technique…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search incidents"
            />
          </div>

          <div className="filter-row" role="group" aria-label="Filter by severity">
            {["All", ...SEVERITIES].map((level) => (
              <button
                key={level}
                className={`filter-chip ${severity === level ? "active" : ""}`}
                onClick={() => setSeverity(level)}
              >
                {level}
                <span className="num"> {severityCounts[level] ?? 0}</span>
              </button>
            ))}
          </div>

          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort incidents"
          >
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={`dim-while-refreshing ${refreshing ? "is-refreshing" : ""}`}>
          <IncidentTable
            incidents={filtered}
            loading={loading}
            error={error}
            onRetry={refresh}
            emptyMessage={
              hasFilters
                ? "No incidents match the current search or filters."
                : undefined
            }
          />
        </div>

        {!loading && filtered.length > 0 && (
          <p className="muted incidents-count">
            Showing {filtered.length} of {list.length} incidents
          </p>
        )}
      </div>
    </div>
  );
}

export default Incidents;
