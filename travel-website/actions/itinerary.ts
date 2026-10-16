'use server';

import { revalidatePath } from "next/cache";

export interface Waypoint { name: string; lat: number; lng: number; }
export interface SaveItineraryInput {
  tripName?: string;
  waypoints: Waypoint[];
  vehicle?: string;
  distanceKm?: number;
  durationMin?: number;
}

// Kho lưu trữ dữ liệu phía máy chủ (Server Persistence Store)
const serverDb: Array<SaveItineraryInput & { id: string; createdAt: string }> = [];

export async function saveTripItineraryAction(input: SaveItineraryInput) {
  try {
    const { tripName, waypoints, vehicle = "car", distanceKm = 0, durationMin = 0 } = input;

    if (!waypoints || waypoints.length < 2) {
      return { success: false, message: "Hành trình cần ít nhất 2 điểm dừng." };
    }

    // Ghi nhận dữ liệu vào Server Persistence Store
    const record = {
      id: `trip_${Date.now()}`,
      tripName: tripName || `Lộ trình ${waypoints[0].name} - ${waypoints[waypoints.length - 1].name}`,
      waypoints,
      vehicle,
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMin: Math.round(durationMin),
      createdAt: new Date().toISOString(),
    };
    serverDb.push(record);

    console.log(`[Server Action] Đã lưu hành trình: "${record.tripName}" (ID: ${record.id})`);

    // Làm tươi Full Route Cache và Router Cache của route /map
    revalidatePath("/map");
    return { success: true, message: `Đã lưu thành công hành trình "${record.tripName}"!`, data: record };
  } catch (err) {
    return { success: false, message: "Có lỗi xảy ra trên máy chủ." };
  }
}
