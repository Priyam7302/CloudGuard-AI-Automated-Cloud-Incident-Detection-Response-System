/**
 * Shared chart styling. Palette decisions:
 *  - Severity is a status scale (good → critical), validated against the card
 *    surface (CVD ΔE 12.4 worst pair, all ≥ 3:1 contrast).
 *  - Nominal count charts are a single series → every bar wears slot-1 blue.
 *  - Grid and axes are solid hairlines, one step off the surface.
 */

export const SEVERITY_COLORS = {
  Critical: "var(--sev-critical)",
  High: "var(--sev-high)",
  Medium: "var(--sev-medium)",
  Low: "var(--sev-low)",
  Unknown: "var(--ink-3)",
};

export const CHART_BLUE = "var(--chart-1)";
export const GRID_STROKE = "rgba(148, 163, 184, 0.10)";
export const AXIS_STROKE = "rgba(148, 163, 184, 0.22)";
export const HOVER_CURSOR = { fill: "rgba(148, 163, 184, 0.07)" };

export const tickStyle = { fill: "#8494ad", fontSize: 12 };

export const xAxisProps = {
  tickLine: false,
  axisLine: { stroke: AXIS_STROKE },
  tick: tickStyle,
};

export const yAxisProps = {
  tickLine: false,
  axisLine: false,
  tick: tickStyle,
};
