const configuredApiUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}`
  .trim()
  .replace(/\/+$/, "");

if (!configuredApiUrl) {
  throw new Error("Set NEXT_PUBLIC_API_URL before starting the client.");
}

export const API_BASE_URL = configuredApiUrl;
export const booksEndpoint = `${API_BASE_URL}/books`;
export const newArrivalsEndpoint = `${booksEndpoint}/new-arrivals`;
export const borrowsEndpoint = `${API_BASE_URL}/borrows`;
export const myBooksEndpoint = `${API_BASE_URL}/my-books`;

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
