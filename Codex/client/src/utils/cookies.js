const CONSENT_COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export function getConsentCookieName() {
  return CONSENT_COOKIE_NAME;
}

export function readCookie(name) {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];

  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

export function writeCookie(name, data, maxAge = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(
    JSON.stringify(data)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
