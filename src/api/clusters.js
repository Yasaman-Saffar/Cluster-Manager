import { apiRequest } from "./http";

export function getClusters() {
  return apiRequest("/clusters/");
}

export function createCluster(data) {
  return apiRequest("/clusters/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}