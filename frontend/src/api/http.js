const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          ...(options.body && {
            "Content-Type": "application/json",
          }),
          ...options.headers,
        },
      }
    );
  } catch {
    throw new Error(
      "Could not connect to the backend."
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes(
    "application/json"
  )
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage =
      typeof data === "object"
        ? data.error ||
          data.detail ||
          JSON.stringify(data)
        : data;

    throw new Error(
      errorMessage || "Something went wrong."
    );
  }

  return data;
}