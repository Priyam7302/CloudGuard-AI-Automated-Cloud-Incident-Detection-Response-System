import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Analytics from "./pages/Analytics";
import AwsResources from "./pages/AwsResources";
import Settings from "./pages/Settings";
import IncidentDetails from "./pages/IncidentDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/incidents" element={<Incidents />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/aws-resources" element={<AwsResources />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/incidents/:id" element={<IncidentDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
