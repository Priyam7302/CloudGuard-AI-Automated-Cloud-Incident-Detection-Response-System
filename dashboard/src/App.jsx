import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import AwsResources from "./pages/AwsResources";
import Settings from "./pages/Settings";
import IncidentDetails from "./pages/IncidentDetails";
import { SkeletonRows } from "./components/DataState";

// Analytics is the only consumer of recharts — split it out of the main bundle.
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/incidents/:id" element={<IncidentDetails />} />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<SkeletonRows rows={3} height={120} />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route path="/aws-resources" element={<AwsResources />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
