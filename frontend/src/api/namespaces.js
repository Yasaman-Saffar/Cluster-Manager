import { apiRequest } from "./http";

export function getNamespaces(clusterId) {
  return apiRequest(`/namespaces/?cluster=${clusterId}`);
}

export function createNamespace(data) {
  return apiRequest("/namespaces/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteNamespace(namespaceId) {
  return apiRequest(`/namespace/delete/${namespaceId}/`, {
    method: "DELETE",
  });
}
