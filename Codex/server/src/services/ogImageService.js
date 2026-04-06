function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitLines(input = "", maxLineLength = 24) {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLineLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export function buildOgSvg({
  eyebrow = "Khajuraho Roads",
  title = "",
  subtitle = "",
  accent = "#c57236"
}) {
  const titleLines = splitLines(title);
  const safeEyebrow = escapeXml(eyebrow);
  const safeSubtitle = escapeXml(subtitle);

  const titleMarkup = titleLines
    .map(
      (line, index) =>
        `<text x="84" y="${170 + index * 76}" font-size="58" font-weight="700" fill="#1f1a17" font-family="'Georgia', serif">${escapeXml(line)}</text>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F5E7D6"/>
      <stop offset="1" stop-color="#F8F1E8"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1040 120) rotate(132.847) scale(409.521 559.086)">
      <stop stop-color="${accent}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg)"/>
  <rect width="1200" height="630" rx="36" fill="url(#glow)"/>
  <rect x="70" y="70" width="1060" height="490" rx="32" fill="white" fill-opacity="0.74" stroke="white" stroke-opacity="0.6"/>
  <text x="84" y="120" font-size="22" letter-spacing="7" font-weight="700" fill="${accent}" font-family="Arial, sans-serif">${safeEyebrow}</text>
  ${titleMarkup}
  <text x="84" y="470" font-size="28" fill="#5A5148" font-family="Arial, sans-serif">${safeSubtitle}</text>
  <rect x="84" y="504" width="250" height="16" rx="8" fill="${accent}" fill-opacity="0.95"/>
  <text x="84" y="560" font-size="24" fill="#1f1a17" font-family="Arial, sans-serif">Khajuraho, Panna, Airport Pickup, Temple Tours</text>
</svg>`;
}
