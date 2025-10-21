// Geocode utility using Mapbox Geocoding API
// This converts city, state, country into latitude/longitude coordinates

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

export interface Coordinates {
  longitude: number;
  latitude: number;
}

// Cache to avoid repeated API calls for the same location
const geocodeCache = new Map<string, Coordinates>();

export async function geocodeLocation(
  city?: string,
  state?: string,
  country?: string,
): Promise<Coordinates | null> {
  if (!city && !state && !country) {
    return null;
  }

  // Build query string
  const parts = [city, state, country].filter(Boolean);
  const query = parts.join(", ");

  // Check cache
  if (geocodeCache.has(query)) {
    return geocodeCache.get(query)!;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1`,
    );

    if (!response.ok) {
      console.error("Geocoding failed:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      const coords = { longitude, latitude };

      // Cache the result
      geocodeCache.set(query, coords);

      return coords;
    }

    return null;
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
}

// Helper to geocode multiple locations in parallel
export async function geocodeMultiple(
  locations: Array<{
    id: string;
    city?: string;
    state?: string;
    country?: string;
  }>,
): Promise<
  Array<{
    id: string;
    coordinates: Coordinates | null;
  }>
> {
  const results = await Promise.all(
    locations.map(async (location) => ({
      id: location.id,
      coordinates: await geocodeLocation(
        location.city,
        location.state,
        location.country,
      ),
    })),
  );

  return results;
}

// Mock coordinates for common US cities (fallback if geocoding fails)
export const CITY_COORDINATES: Record<string, Coordinates> = {
  "New York": { longitude: -74.006, latitude: 40.7128 },
  "Los Angeles": { longitude: -118.2437, latitude: 34.0522 },
  Chicago: { longitude: -87.6298, latitude: 41.8781 },
  Houston: { longitude: -95.3698, latitude: 29.7604 },
  Phoenix: { longitude: -112.074, latitude: 33.4484 },
  Philadelphia: { longitude: -75.1652, latitude: 39.9526 },
  "San Antonio": { longitude: -98.4936, latitude: 29.4241 },
  "San Diego": { longitude: -117.1611, latitude: 32.7157 },
  Dallas: { longitude: -96.797, latitude: 32.7767 },
  "San Jose": { longitude: -121.8863, latitude: 37.3382 },
  Austin: { longitude: -97.7431, latitude: 30.2672 },
  Jacksonville: { longitude: -81.6557, latitude: 30.3322 },
  Miami: { longitude: -80.1918, latitude: 25.7617 },
  Seattle: { longitude: -122.3321, latitude: 47.6062 },
  Denver: { longitude: -104.9903, latitude: 39.7392 },
  Boston: { longitude: -71.0589, latitude: 42.3601 },
  Portland: { longitude: -122.6765, latitude: 45.5152 },
  "Las Vegas": { longitude: -115.1398, latitude: 36.1699 },
  Nashville: { longitude: -86.7816, latitude: 36.1627 },
  Atlanta: { longitude: -84.388, latitude: 33.749 },
};

// Get fallback coordinates if geocoding fails
export function getFallbackCoordinates(city?: string): Coordinates | null {
  if (!city) return null;

  const cityKey = Object.keys(CITY_COORDINATES).find(
    (key) => key.toLowerCase() === city.toLowerCase(),
  );

  return cityKey ? CITY_COORDINATES[cityKey] : null;
}
