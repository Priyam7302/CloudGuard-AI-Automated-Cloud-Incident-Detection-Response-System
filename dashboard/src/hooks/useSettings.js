import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cloudguard.settings";

const DEFAULTS = {
  autoRefresh: true,
  refreshIntervalSec: 60,
};

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...DEFAULTS, ...(stored ?? {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

let state = load();
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateSettings(patch) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing / storage disabled — settings just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, () => state);
  return [settings, updateSettings];
}
