import { useEffect, useSyncExternalStore } from "react";
import { getIncidents, describeApiError } from "../services/api";
import { normalizeIncident, sortByNewest } from "../lib/normalize";

/**
 * Module-level incidents store shared by every page. Data is fetched once,
 * cached, and refreshed in the background (manual refresh button or the
 * auto-refresh interval from Settings) without flashing loading states.
 */

let state = {
  incidents: null, // null = never loaded; [] = loaded, empty
  loading: false,
  refreshing: false,
  error: null,
  lastUpdated: null,
  lastLatencyMs: null,
};

const listeners = new Set();
let inflight = null;

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshIncidents() {
  if (inflight) return inflight;

  const firstLoad = state.incidents === null;
  setState({ loading: firstLoad, refreshing: !firstLoad });

  const startedAt = performance.now();
  inflight = getIncidents()
    .then((response) => {
      const list = Array.isArray(response.data) ? response.data : [];
      setState({
        incidents: sortByNewest(list.map(normalizeIncident)),
        loading: false,
        refreshing: false,
        error: null,
        lastUpdated: Date.now(),
        lastLatencyMs: Math.round(performance.now() - startedAt),
      });
    })
    .catch((error) => {
      // Keep the last good data on background-refresh failures.
      setState({
        loading: false,
        refreshing: false,
        error: describeApiError(error),
      });
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function useIncidents() {
  const snapshot = useSyncExternalStore(subscribe, () => state);

  useEffect(() => {
    if (state.incidents === null && !inflight) {
      refreshIncidents();
    }
  }, []);

  return { ...snapshot, refresh: refreshIncidents };
}
