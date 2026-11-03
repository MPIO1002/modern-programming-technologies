import { normalizePlaces } from "./places.service";
import type { Place } from "../app/(tourist)/places/components/types";

const DEFAULT_DELAY_MS = 500;

function getBenchmarkDelayMs() {
  const configuredDelay = Number(process.env.BENCHMARK_DELAY_MS);

  if (!Number.isFinite(configuredDelay) || configuredDelay < 0) {
    return DEFAULT_DELAY_MS;
  }

  return Math.min(configuredDelay, 30_000);
}

export async function getBenchmarkPlaces(): Promise<Place[]> {
  const apiUrl = process.env.MOCKAPI_PLACES_URL;

  if (!apiUrl) {
    throw new Error("Thiếu cấu hình MOCKAPI_PLACES_URL");
  }

  const delayMs = getBenchmarkDelayMs();
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const response = await fetch(apiUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Không thể lấy dữ liệu địa điểm (${response.status})`);
  }

  return normalizePlaces(await response.json());
}
