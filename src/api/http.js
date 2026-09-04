const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body && {
          "Content-Type": "application/json",
        }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Could not connect to the backend.");
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.detail ||
      "Something went wrong."
    );
  }

  return data;
}