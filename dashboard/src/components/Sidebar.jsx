import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  Cloud,
  Settings,
  Shield,
  X,
} from "lucide-react";

import { useIncidents } from "../hooks/useIncidents";
import "../styles/sidebar.css";

const SECTIONS = [
  {
    label: "Monitor",
    items: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { to: "/incidents", label: "Incidents", icon: ShieldAlert },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/aws-resources", label: "AWS Resources", icon: Cloud },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function Sidebar({ open, onClose }) {
  const { incidents, error, lastUpdated } = useIncidents();
  const connected = Boolean(lastUpdated) && !error;

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <Shield size={19} />
        </span>
        <span className="brand-text">
          <strong>CloudGuard AI</strong>
          <span>Security Operations</span>
        </span>
        <button
          className="btn btn-ghost btn-icon sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {SECTIONS.map((section) => (
          <div key={section.label} className="nav-section">
            <p className="nav-section-label">{section.label}</p>
            {section.items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className="nav-link" onClick={onClose}>
                <Icon size={17} />
                <span>{label}</span>
                {to === "/incidents" && incidents?.length > 0 && (
                  <span className="nav-count num">{incidents.length}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className={`live-dot ${connected ? "on" : error ? "err" : ""}`} />
        <div className="sidebar-foot-text">
          <strong>{connected ? "Pipeline connected" : error ? "API unreachable" : "Connecting…"}</strong>
          <span className="mono">AWS · us-east-1</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
