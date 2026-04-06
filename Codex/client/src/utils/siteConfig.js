const siteUrl = (import.meta.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/$/, "");

export const siteConfig = {
  siteName: "Khajuraho Roads",
  siteUrl,
  defaultTitle: "Khajuraho Taxi Service | Cab Booking | Panna Tour Packages",
  defaultDescription:
    "Book trusted Khajuraho taxi service, airport pickup, car rental, and Panna tour packages with multilingual drivers and transparent pricing.",
  defaultKeywords: [
    "Khajuraho taxi service",
    "car rental in Khajuraho",
    "Khajuraho cab booking",
    "Khajuraho tour packages",
    "Khajuraho to Panna taxi",
    "Panna tour package",
    "Khajuraho airport pickup"
  ],
  defaultOgImage: "/media/travel-khajuraho.svg",
  business: {
    name: "Khajuraho Roads Tour & Travels",
    phone: "+91 7483667939",
    email: "info@navyom.com",
    address: "Khajuraho, Madhya Pradesh, India",
    mapQuery: "",
    whatsappNumber: "917483667939",
    services: [
      "Khajuraho taxi service",
      "Car rental in Khajuraho",
      "Khajuraho airport pickup",
      "Khajuraho to Panna taxi",
      "Temple sightseeing cabs",
      "Outstation cab booking"
    ]
  }
};

export function toAbsoluteUrl(pathname = "/") {
  return new URL(pathname, `${siteUrl}/`).toString();
}
