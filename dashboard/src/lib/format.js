import { parseDate } from "./normalize";

// Backend timestamps (CloudTrail, Lambda) are UTC; the after-hours rule is
// evaluated in UTC too, so all times are displayed in UTC to stay consistent.
const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDateTime(value) {
  const date = value instanceof Date ? value : parseDate(value);
  return date ? `${dateTimeFormat.format(date)} UTC` : "—";
}

export function formatDate(value) {
  const date = value instanceof Date ? value : parseDate(value);
  return date ? dateFormat.format(date) : "—";
}

export function relativeTime(value, nowMs = Date.now()) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "—";
  const seconds = Math.round((nowMs - date.getTime()) / 1000);
  if (seconds < 45) return "just now";
  if (seconds < 90) return "1 min ago";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(date);
}

export function shortId(id) {
  return id ? String(id).slice(0, 8) : "—";
}
