export function normalizeStatus(status) {
  return status
    ?.toLowerCase()
    .trim()
    .replaceAll(" ", "_");
}

const APP_STATUS_COLORS = {
  running: "orange",
  ready: "green",
  not_ready: "orange",
  pending: "blue",
  failed: "red",
  terminating: "default",
  unknown: "default",
};

export function getAppStatusColor(status) {
  return (
    APP_STATUS_COLORS[normalizeStatus(status)] ??
    "default"
  );
}