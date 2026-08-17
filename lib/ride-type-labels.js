// Client-safe ride type constants (no DB imports) — for display labels only.
export const DEFAULT_RIDE_TYPES = [
  { id: 'motorbike', name: 'Motorbike', icon: '🏍️', base_price: 50, per_km: 30, capacity: 1, description: 'Fastest way through traffic' },
  { id: 'electric_bike', name: 'Electric Bike', icon: '⚡', base_price: 50, per_km: 25, capacity: 1, description: 'Eco-friendly — 5 KSh less per km' },
];

export function getDefaultRideType(id) {
  return DEFAULT_RIDE_TYPES.find((t) => t.id === id) || null;
}
