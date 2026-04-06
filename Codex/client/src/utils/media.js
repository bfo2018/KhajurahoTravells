export function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return "";
  }

  try {
    const url = new URL(apiUrl, window.location.origin);
    return url.origin;
  } catch {
    return "";
  }
}

export function resolveMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${getApiOrigin()}${path}`;
}

export function getGeneratedOgImageUrl(type, slug) {
  const origin = getApiOrigin();
  if (!origin || !type || !slug) return "";
  return `${origin}/api/seo/og/${type}/${slug}.svg`;
}

export function getGeneratedOgPreviewUrl(type, title, subtitle = "") {
  const origin = getApiOrigin();
  if (!origin) return "";
  const params = new URLSearchParams({
    type,
    title,
    subtitle
  });
  return `${origin}/api/seo/og/preview.svg?${params.toString()}`;
}
