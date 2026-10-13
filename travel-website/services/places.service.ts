import type { Place } from "../app/(tourist)/places/components/types";

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=60";

type RawPlace = Record<string, unknown>;

function isRawPlace(value: unknown): value is RawPlace {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizePlaces(data: unknown): Place[] {
  if (!Array.isArray(data) || !data.every(isRawPlace)) {
    throw new Error("Dữ liệu địa điểm không hợp lệ");
  }

  const seenIds = new Set<string>();

  return data.map((item, index) => {
    let id = item.id ? String(item.id) : String(index + 1);

    if (seenIds.has(id)) {
      id = String(index + 1);
      if (seenIds.has(id)) {
        id = `${String(item.id)}_${index}`;
      }
    }
    seenIds.add(id);

    let category =
      typeof item.category === "string" && item.category
        ? item.category
        : "Khám phá";
    if (category === "1002-6" || /^\d+(-\d+)?$/.test(category)) {
      category = "Khám phá";
    }

    const name = typeof item.name === "string" ? item.name : "";
    const existingSlug = typeof item.slug === "string" ? item.slug : "";
    const slug =
      !existingSlug || existingSlug.startsWith("slug ")
        ? name
            ? name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            : `place-${id}`
        : existingSlug;

    return {
      ...item,
      id,
      name,
      slug,
      description:
        typeof item.description === "string" ? item.description : "",
      thumbnail:
        typeof item.thumbnail === "string" && item.thumbnail
          ? item.thumbnail
          : DEFAULT_THUMBNAIL,
      lat: typeof item.lat === "number" ? item.lat : Number(item.lat) || 0,
      lng: typeof item.lng === "number" ? item.lng : Number(item.lng) || 0,
      category,
      openTime: typeof item.openTime === "string" ? item.openTime : "",
      price: typeof item.price === "string" ? item.price : "",
      experience: typeof item.experience === "string" ? item.experience : "",
      province:
        typeof item.province === "number"
          ? item.province
          : Number(item.province) || 0,
    };
  });
}
