export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function sortByDistance(
  services: { location: { lat: number; lng: number } }[],
  lat: number,
  lng: number
) {
  return services.sort((a, b) => {
    const distanceA = calculateDistance(lat, lng, a.location.lat, a.location.lng);
    const distanceB = calculateDistance(lat, lng, b.location.lat, b.location.lng);
    return distanceA - distanceB;
  });
} 