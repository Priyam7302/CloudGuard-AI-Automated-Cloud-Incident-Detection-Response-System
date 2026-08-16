import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const api = axios.create({
  baseURL: API_BASE_URL,
  // The Lambda reads every incident object from S3 on each list call,
  // so allow it a generous window before giving up.
  timeout: 30000,
});

export const getIncidents = () => api.get("/incidents");

export const getIncident = (id) => api.get(`/incidents/${id}`);

export function describeApiError(error) {
  if (!API_BASE_URL) {
    return "No API endpoint is configured for this dashboard.";
  }
  if (error?.code === "ECONNABORTED") {
    return "The incidents API timed out. The Lambda may be cold-starting — try again.";
  }
  if (error?.response) {
    return `The incidents API responded with HTTP ${error.response.status}.`;
  }
  return "Could not reach the incidents API. Check your network connection.";
}

export default api;
