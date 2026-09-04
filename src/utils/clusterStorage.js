const STORAGE_KEY = "mock-connected-clusters";

export function getStoredClusters() {
  try {
    const clusters = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(clusters) ? clusters : [];
  } catch {
    return [];
  }
}

export function storeCluster(cluster) {
  const clusters = getStoredClusters();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...clusters, cluster])
  );
}