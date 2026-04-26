import axios from 'axios';
import env from '../config/env.js';

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
  if (!env.googleMapsApiKey) {
    const distanceKm = Math.max(haversineDistance(origin, destination), 1);
    const durationMin = Math.ceil((distanceKm / 35) * 60);
    return {
      distanceKm,
      durationMin,
      fareUzs: computeFare(distanceKm, durationMin)
    };
  }

  const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  const response = await axios.get(url, {
    params: {
      origins: `${origin.lat},${origin.lng}`,
      destinations: `${destination.lat},${destination.lng}`,
      mode: 'driving',
      key: env.googleMapsApiKey
    }
  });

  const element = response.data?.rows?.[0]?.elements?.[0];
  if (!element || element.status !== 'OK') {
    throw new Error("Masofa hisoblab bo'lmadi");
  }

  const distanceKm = Number((element.distance.value / 1000).toFixed(2));
  const durationMin = Math.ceil(element.duration.value / 60);
  const fareUzs = computeFare(distanceKm, durationMin);

  return { distanceKm, durationMin, fareUzs };
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
