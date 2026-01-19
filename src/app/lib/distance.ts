// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'mi' | 'km' = 'mi'
): number {
  const R = unit === 'mi' ? 3959 : 6371; // Earth's radius in miles or kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Format distance for display
export function formatDistance(distance: number, unit: 'mi' | 'km' = 'mi'): string {
  const unitLabel = unit === 'mi' ? 'mi' : 'km';
  
  if (distance < 0.1) {
    return `< 0.1 ${unitLabel} away`;
  }
  
  return `${distance.toFixed(1)} ${unitLabel} away`;
}
