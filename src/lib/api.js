export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const booksEndpoint = `${API_BASE_URL}/books`;

export async function apiFetch(url, options = {}) {
  const tokenResponse = await fetch("/api/auth/token", {
    cache: "no-store",
    credentials: "same-origin",
  });
  const tokenData = await tokenResponse.json().catch(() => null);

  if (!tokenResponse.ok || typeof tokenData?.token !== "string") {
    throw new Error("Your session could not be verified. Please sign in again.");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${tokenData.token}`);

  return fetch(url, { ...options, headers });
}
