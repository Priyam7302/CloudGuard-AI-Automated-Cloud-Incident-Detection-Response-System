import { useEffect, useState } from "react";
import { getIncidents } from "../services/api";

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
} from "recharts";

import "../styles/analytics.css";

function Analytics() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const response = await getIncidents();
      setIncidents(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  // ---------------- KPI ----------------

  const totalIncidents = incidents.length;

  const criticalIncidents = incidents.filter(
    (incident) => incident.severity === "Critical",
  ).length;

  const averageThreatScore =
    totalIncidents > 0
      ? (
          incidents.reduce((sum, incident) => sum + incident.threat_score, 0) /
          totalIncidents
        ).toFixed(1)
      : 0;

  const highRiskIncidents = incidents.filter(
    (incident) => incident.threat_score >= 80,
  ).length;

  // ---------------- Pie Chart Data ----------------

  const severityData = [
    {
      name: "Critical",
      value: incidents.filter((i) => i.severity === "Critical").length,
    },
    {
      name: "High",
      value: incidents.filter((i) => i.severity === "High").length,
    },
    {
      name: "Medium",
      value: incidents.filter((i) => i.severity === "Medium").length,
    },
    {
      name: "Low",
      value: incidents.filter((i) => i.severity === "Low").length,
    },
  ];

  // ---------------- Threat Score Chart ----------------

  const threatScoreData = incidents.map((incident) => ({
    event: incident.event_name,
    score: incident.threat_score,
  }));

  const eventFrequency = Object.values(
    incidents.reduce((acc, incident) => {
      if (!acc[incident.event_name]) {
        acc[incident.event_name] = {
          event: incident.event_name,
          count: 0,
        };
      }

      acc[incident.event_name].count++;

      return acc;
    }, {}),
  );

  const COLORS = ["#dc2626", "#ea580c", "#eab308", "#16a34a"];

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>

      {/* KPI Cards */}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Incidents</h3>
          <h2>{totalIncidents}</h2>
        </div>

        <div className="stat-card critical">
          <h3>Critical Incidents</h3>
          <h2>{criticalIncidents}</h2>
        </div>

        <div className="stat-card">
          <h3>Average Threat Score</h3>
          <h2>{averageThreatScore}</h2>
        </div>

        <div className="stat-card warning">
          <h3>High Risk Incidents</h3>
          <h2>{highRiskIncidents}</h2>
        </div>
      </div>

      {/* Charts */}

      <div className="charts-grid">
        {/* Pie Chart */}

        <div className="chart-card">
          <h2>Severity Distribution</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {severityData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Score Chart */}

        <div className="chart-card">
          <h2>Threat Score by Event</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={threatScoreData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="event" />

              <YAxis domain={[0, 100]} />

              <Tooltip />
              <Bar dataKey="score" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h2>Event Frequency</h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={eventFrequency}>
            <CartesianGrid stroke="#475569" strokeDasharray="3 3" />

            <XAxis
              dataKey="event"
              stroke="#cbd5e1"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />

            <YAxis stroke="#cbd5e1" tick={{ fill: "#cbd5e1" }} />

            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
              }}
            />

            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
