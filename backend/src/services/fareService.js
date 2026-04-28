
const PRICING = {
  baseFare: 12000,
  perKm: 4500,
  perMin: 800,
  accessibilityLiftFee: 7000,
  minimumFare: 25000,
  surgeHours: [7, 8, 9, 18, 19, 20],
  surgeMultiplier: 1.2
};

function computeFare(distanceKm, durationMin) {
  const hour = new Date().getHours();
  const surge = PRICING.surgeHours.includes(hour) ? PRICING.surgeMultiplier : 1;

  const rawFare =
    (PRICING.baseFare + distanceKm * PRICING.perKm + durationMin * PRICING.perMin + PRICING.accessibilityLiftFee) * surge;

  return Math.max(Math.round(rawFare), PRICING.minimumFare);
}

async function getRouteInfo(origin, destination) {
  const distanceKm = Math.max(haversineDistance(origin, destination), 1);
  const durationMin = Math.ceil((distanceKm / 35) * 60);

  return {
    distanceKm,
    durationMin,
    fareUzs: computeFare(distanceKm, durationMin)
  };
}


function haversineDistance(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const q =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}

export { getRouteInfo, computeFare };
