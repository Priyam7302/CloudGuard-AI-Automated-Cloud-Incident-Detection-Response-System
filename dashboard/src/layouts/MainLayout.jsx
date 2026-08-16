import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { refreshIncidents } from "../hooks/useIncidents";
import { useSettings } from "../hooks/useSettings";
import { pageTitle } from "../lib/pageTitle";

import "../styles/dashboard.css";

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const [{ autoRefresh, refreshIntervalSec }] = useSettings();

  // Close the mobile drawer when navigating (state adjusted during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Reset scroll and sync the document title on navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${pageTitle(pathname)} · CloudGuard AI`;
  }, [pathname]);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const id = setInterval(refreshIncidents, Math.max(15, refreshIntervalSec) * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, refreshIntervalSec]);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <div className="app-main">
        <Navbar onMenu={() => setMenuOpen(true)} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
