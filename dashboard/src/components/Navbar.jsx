import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, RefreshCw, Wifi, WifiOff } from "lucide-react";

import { useIncidents } from "../hooks/useIncidents";
import { relativeTime } from "../lib/format";
import { pageTitle } from "../lib/pageTitle";
import "../styles/navbar.css";

function Navbar({ onMenu }) {
  const { pathname } = useLocation();
  const { loading, refreshing, error, lastUpdated, refresh } = useIncidents();

  // Re-render every 30s so "Updated X min ago" stays honest.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const busy = loading || refreshing;
  const connected = Boolean(lastUpdated) && !error;

  return (
    <header className="topbar">
      <button className="btn btn-ghost btn-icon topbar-menu" onClick={onMenu} aria-label="Open menu">
        <Menu size={19} />
      </button>

      <div className="topbar-title">
        <h2>{pageTitle(pathname)}</h2>
      </div>

      <div className="topbar-right">
        {lastUpdated && (
          <span className="topbar-updated muted">
            Updated {relativeTime(new Date(lastUpdated))}
          </span>
        )}

        <span
          className={`conn-pill ${connected ? "ok" : error ? "err" : ""}`}
          title={error ?? "Connected to the CloudGuard incidents API"}
        >
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected ? "Live" : error ? "Offline" : "Connecting"}
        </span>

        <button
          className="btn btn-icon"
          onClick={refresh}
          disabled={busy}
          aria-label="Refresh incidents"
          title="Refresh incidents"
        >
          <RefreshCw size={15} className={busy ? "spin" : undefined} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
