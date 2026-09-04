import { apiRequest } from "./http";

export function getApps(namespaceId) {
  return apiRequest(`/app/?namespace=${namespaceId}`);
}

export function getApp(appId) {
  return apiRequest(`/app/update/${appId}/`);
}

export function createApp(data) {
  return apiRequest("/app/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateApp(appId, data) {
  return apiRequest(`/app/update/${appId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteApp(appId) {
  return apiRequest(`/app/delete/${appId}/`, {
    method: "DELETE",
  });
}