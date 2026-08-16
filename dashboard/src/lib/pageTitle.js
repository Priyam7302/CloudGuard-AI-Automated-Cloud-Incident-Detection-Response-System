const TITLES = [
  { match: /^\/dashboard/, title: "Security Overview" },
  { match: /^\/incidents\/.+/, title: "Incident Details" },
  { match: /^\/incidents/, title: "Incidents" },
  { match: /^\/analytics/, title: "Analytics" },
  { match: /^\/aws-resources/, title: "AWS Resources" },
  { match: /^\/settings/, title: "Settings" },
];

export function pageTitle(pathname) {
  return TITLES.find(({ match }) => match.test(pathname))?.title ?? "CloudGuard AI";
}
