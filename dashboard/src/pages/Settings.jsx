import { useState } from "react";
import {
  PlugZap,
  RefreshCw,
  Info,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import CopyButton from "../components/CopyButton";
import { useIncidents } from "../hooks/useIncidents";
import { useSettings } from "../hooks/useSettings";
import { API_BASE_URL } from "../services/api";
import { relativeTime } from "../lib/format";

import "../styles/settings.css";

const INTERVALS = [
  { value: 30, label: "Every 30 seconds" },
  { value: 60, label: "Every minute" },
  { value: 120, label: "Every 2 minutes" },
  { value: 300, label: "Every 5 minutes" },
];

const REPO_URL =
  "https://github.com/Priyam7302/CloudGuard-AI-Automated-Cloud-Incident-Detection-Response-System";

const STACK = ["Lambda", "EventBridge", "CloudTrail", "S3", "SNS", "API Gateway"];

function Settings() {
  const { error, lastUpdated, lastLatencyMs, refreshing, refresh } = useIncidents();
  const [settings, updateSettings] = useSettings();
  const [testResult, setTestResult] = useState(null);

  const connected = Boolean(lastUpdated) && !error;

  async function testConnection() {
    setTestResult(null);
    const startedAt = performance.now();
    await refresh();
    const elapsed = Math.round(performance.now() - startedAt);
    setTestResult({ at: Date.now(), elapsed });
  }

  return (
    <div className="page settings-page">
      <PageHeader
        title="Settings"
        subtitle="Dashboard preferences — stored locally in this browser."
      />

      {/* Connection ------------------------------------------------------- */}
      <section className="card card-pad">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <PlugZap size={15} className="title-icon" /> API connection
            </h2>
            <p className="card-subtitle">
              The dashboard talks to the CloudGuard Lambda through this endpoint —
              no AWS credentials are needed in the browser.
            </p>
          </div>
          <span className={`conn-pill ${connected ? "ok" : error ? "err" : ""}`}>
            {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {connected ? "Connected" : error ? "Offline" : "Connecting"}
          </span>
        </div>

        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Endpoint</strong>
            <span className="muted">CloudGuard incidents API</span>
          </div>
          <div className="endpoint-box">
            <code className="mono truncate">{API_BASE_URL || "Not configured"}</code>
            {API_BASE_URL && <CopyButton text={API_BASE_URL} label="Copy endpoint" />}
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Status</strong>
            <span className="muted">
              {connected
                ? `Last synced ${relativeTime(new Date(lastUpdated))}${
                    lastLatencyMs != null ? ` · ${lastLatencyMs} ms round trip` : ""
                  }`
                : (error ?? "Waiting for the first sync…")}
            </span>
          </div>
          <button className="btn" onClick={testConnection} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? "spin" : undefined} />
            Test connection
          </button>
        </div>

        {testResult && (
          <p className={`test-result ${error ? "fail" : "ok"}`}>
            {error
              ? `Test failed — ${error}`
              : `Success — incidents fetched in ${testResult.elapsed} ms.`}
          </p>
        )}
      </section>

      {/* Data refresh ------------------------------------------------------ */}
      <section className="card card-pad">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <RefreshCw size={15} className="title-icon" /> Data refresh
            </h2>
            <p className="card-subtitle">
              How often the dashboard re-fetches incidents in the background.
            </p>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Auto-refresh</strong>
            <span className="muted">Keep incident data up to date automatically</span>
          </div>
          <button
            role="switch"
            aria-checked={settings.autoRefresh}
            aria-label="Toggle auto-refresh"
            className={`switch ${settings.autoRefresh ? "on" : ""}`}
            onClick={() => updateSettings({ autoRefresh: !settings.autoRefresh })}
          >
            <span className="switch-thumb" />
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Refresh interval</strong>
            <span className="muted">Applies while auto-refresh is on</span>
          </div>
          <select
            className="select"
            value={settings.refreshIntervalSec}
            disabled={!settings.autoRefresh}
            onChange={(e) =>
              updateSettings({ refreshIntervalSec: Number(e.target.value) })
            }
            aria-label="Refresh interval"
          >
            {INTERVALS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* About ------------------------------------------------------------- */}
      <section className="card card-pad">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Info size={15} className="title-icon" /> About CloudGuard AI
            </h2>
          </div>
        </div>

        <p className="about-text">
          CloudGuard AI is a serverless, rule-based cloud security platform. A single
          Lambda ingests CloudTrail events via EventBridge, evaluates 20 hand-written
          detection rules, scores the threat, executes automated remediation where
          possible, preserves forensic evidence in S3 and alerts responders through
          SNS. This dashboard is a live client of that pipeline.
        </p>

        <div className="filter-row about-stack">
          {STACK.map((item) => (
            <span className="chip" key={item}>
              {item}
            </span>
          ))}
          <span className="chip chip-accent">MITRE ATT&amp;CK mapped</span>
        </div>

        <a className="btn about-link" href={REPO_URL} target="_blank" rel="noreferrer">
          View project on GitHub
          <ExternalLink size={14} />
        </a>
      </section>
    </div>
  );
}

export default Settings;
