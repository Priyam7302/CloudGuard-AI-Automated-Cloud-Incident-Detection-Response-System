import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard">📊 Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/incidents">🚨 Incidents</NavLink>
        </li>

        <li>
          <NavLink to="/analytics">📈 Analytics</NavLink>
        </li>

        <li>
          <NavLink to="/aws-resources">☁ AWS Resources</NavLink>
        </li>

        <li>
          <NavLink to="/settings">⚙ Settings</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
