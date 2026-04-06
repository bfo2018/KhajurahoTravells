const routeDistanceMap = {
  "khajuraho:western temple group": 6,
  "khajuraho:panna": 44,
  "khajuraho:raneh falls": 22,
  "khajuraho:khajuraho airport": 5,
  "khajuraho:khajuraho railway station": 9,
  "khajuraho airport:western temple group": 5,
  "khajuraho airport:chandela hotel": 4,
  "airport:chandela hotel": 4,
  "airport:western temple group": 5,
  "khajuraho:chandela hotel": 3,
  "western temple group:chandela hotel": 2,
  "panna:khajuraho": 44,
  "panna:raneh falls": 58
};

const placeCoordinates = {
  khajuraho: { lat: 24.8518, lng: 79.9335 },
  "khajuraho airport": { lat: 24.8172, lng: 79.9199 },
  "khajuraho railway station": { lat: 24.8587, lng: 79.9282 },
  "western temple group": { lat: 24.8512, lng: 79.9331 },
  "eastern temple group": { lat: 24.8528, lng: 79.9427 },
  "southern temple group": { lat: 24.8444, lng: 79.9287 },
  "chandela hotel": { lat: 24.8494, lng: 79.9306 },
  "panna": { lat: 24.7209, lng: 80.1873 },
  "panna national park": { lat: 24.5224, lng: 80.1961 },
  "raneh falls": { lat: 24.9055, lng: 79.4684 },
  "bageshwar dham": { lat: 24.7447, lng: 79.8166 }
};

function normalize(text) {
  const value = text.trim().toLowerCase();

  const aliasEntries = [
    ["khajuraho airport", ["airport", "khajuraho airport", "airport khajuraho", "airport road"]],
    ["khajuraho railway station", ["railway station", "station", "khajuraho railway station"]],
    ["chandela hotel", ["chandela hotel", "hotel chandela", "radisson chandela"]],
    ["western temple group", ["western temples", "western temple", "western temple group"]],
    ["eastern temple group", ["eastern temple", "eastern temple group", "eastern temples"]],
    ["southern temple group", ["southern temple", "southern temple group", "southern temples"]],
    ["panna national park", ["panna national park", "panna safari", "national park panna"]],
    ["raneh falls", ["raneh fall", "raneh falls"]],
    ["bageshwar dham", ["bageshwar dham", "bageshwar"]],
    ["khajuraho", ["khajuraho"]],
    ["panna", ["panna"]]
  ];

  for (const [canonical, aliases] of aliasEntries) {
    if (aliases.some((alias) => value.includes(alias))) {
      return canonical;
    }
  }

  return value;
}

export function estimateDistanceKm(pickupLocation, dropLocation) {
  const normalizedPickup = normalize(pickupLocation);
  const normalizedDrop = normalize(dropLocation);
  const exactKey = `${normalizedPickup}:${normalizedDrop}`;
  const reverseKey = `${normalizedDrop}:${normalizedPickup}`;

  if (routeDistanceMap[exactKey]) {
    return routeDistanceMap[exactKey];
  }

  if (routeDistanceMap[reverseKey]) {
    return routeDistanceMap[reverseKey];
  }

  const pickupPoint = placeCoordinates[normalizedPickup];
  const dropPoint = placeCoordinates[normalizedDrop];

  if (pickupPoint && dropPoint) {
    const haversineKm = calculateHaversineKm(pickupPoint, dropPoint);

    // Road travel is typically longer than straight-line distance.
    // Use a multiplier and a small floor for city routes.
    return Math.max(Math.round(haversineKm * 1.25), 2);
  }

  return null;
}

function calculateHaversineKm(pointA, pointB) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(pointB.lat - pointA.lat);
  const deltaLng = toRadians(pointB.lng - pointA.lng);
  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculatePrice({ distanceKm, pricePerKm }) {
  const billableKm = Number(distanceKm);
  return {
    billableKm,
    totalPrice: billableKm * pricePerKm
  };
}
