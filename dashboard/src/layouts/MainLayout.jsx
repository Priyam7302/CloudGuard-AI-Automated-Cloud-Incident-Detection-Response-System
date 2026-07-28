import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { Outlet } from "react-router-dom";

import "../styles/dashboard.css";

function MainLayout() {
  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <Sidebar />

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
