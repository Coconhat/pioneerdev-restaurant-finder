import { AllowedParams, FoursquarePlace } from "../types/foursquare-type";

export async function searchPlaces(
  params: AllowedParams
): Promise<FoursquarePlace[]> {
  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!apiKey)
    throw new Error("Missing FOURSQUARE_API_KEY environment variable.");

  // Build query string
  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, String(params[key]));
    }
  }

  // Defaults
  if (!queryParams.has("sort")) queryParams.set("sort", "RELEVANCE");
  if (!queryParams.has("limit")) queryParams.set("limit", "10");

  const url = `https://places-api.foursquare.com/places/search?${queryParams.toString()}`;
  console.log(url);
  console.log("Foursquare Query Params:", Object.fromEntries(queryParams));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-Places-Api-Version": "2025-06-17",
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    console.error("Foursquare API error:", errorMessage);
    throw new Error(`Foursquare API request failed (${res.status})`);
  }
  const json = await res.json();

  return json.results.map((place: any) => ({
    id: place.fsq_place_id,
    name: place.name,
    category: place.categories?.[0]?.name,
    address: place.location?.formatted_address,
    distance: place.distance,
    lat: place.latitude,
    lng: place.longitude,
  }));
}
