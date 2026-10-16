import type { Location } from "@/types/vietmap";

const CUSTOM_PLACES_KEY = "my_itinerary_custom_places";

export function getCustomItineraryPlaces(): Location[] {
  const value: unknown = JSON.parse(
    localStorage.getItem(CUSTOM_PLACES_KEY) || "[]"
  );

  if (!Array.isArray(value)) {
    throw new Error("Danh sách địa điểm lộ trình không hợp lệ");
  }

  return value.filter(
    (place): place is Location =>
      typeof place === "object" &&
      place !== null &&
      typeof place.id === "string" &&
      typeof place.name === "string" &&
      typeof place.address === "string" &&
      typeof place.lat === "number" &&
      Number.isFinite(place.lat) &&
      typeof place.lng === "number" &&
      Number.isFinite(place.lng)
  );
}

export function saveCustomItineraryPlace(place: Location): void {
  const places = getCustomItineraryPlaces();
  const updated = places.filter((savedPlace) => savedPlace.id !== place.id);

  localStorage.setItem(
    CUSTOM_PLACES_KEY,
    JSON.stringify([...updated, place])
  );
}

export function removeCustomItineraryPlace(id: string): void {
  const places = getCustomItineraryPlaces();
  localStorage.setItem(
    CUSTOM_PLACES_KEY,
    JSON.stringify(places.filter((place) => place.id !== id))
  );
}
