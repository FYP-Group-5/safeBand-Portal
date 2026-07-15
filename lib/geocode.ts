const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

let lastRequest = 0;

export interface GeocodeResult {
  display_name: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeocodeResult | null> {
  // Respect Nominatim's 1 req/s policy
  const now = Date.now();
  const elapsed = now - lastRequest;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastRequest = Date.now();

  try {
    const res = await fetch(
      `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "SafeBand/1.0 (emergency-safety-app)",
        },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.error) return null;

    return {
      display_name: data.display_name,
      street: data.address?.road || data.address?.street || "",
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "",
      state: data.address?.state || "",
      country: data.address?.country || "",
    };
  } catch {
    return null;
  }
}

const addressCache = new Map<string, GeocodeResult>();

export async function getCachedAddress(
  lat: number,
  lng: number,
): Promise<GeocodeResult | null> {
  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = addressCache.get(key);
  if (cached) return cached;

  const result = await reverseGeocode(lat, lng);
  if (result) {
    addressCache.set(key, result);
  }
  return result;
}
