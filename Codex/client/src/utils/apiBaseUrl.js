function normalizeApiBaseUrl(value) {
  if (!value) return "http://localhost:5000/api";

  let normalized = value.trim();

  if (normalized.startsWith("VITE_API_URL=")) {
    normalized = normalized.slice("VITE_API_URL=".length);
  }

  normalized = normalized.replace(/^https:\/(?!\/)/, "https://");
  normalized = normalized.replace(/^http:\/(?!\/)/, "http://");

  return normalized.replace(/\/$/, "");
}

export const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
