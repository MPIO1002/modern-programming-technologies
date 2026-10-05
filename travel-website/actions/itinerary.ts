'use server';

import { revalidatePath } from "next/cache";

export interface SaveItineraryInput {
  tripName: string;
  waypoints: Array<{ name: string; lat: number; lng: number }>;
  vehicle?: string;
  distanceKm?: number;
  durationMin?: number;
}

export async function saveTripItineraryAction(input: SaveItineraryInput) {
  try {
    const { tripName, waypoints, vehicle, distanceKm, durationMin } = input;
    if (!tripName?.trim() || !waypoints || waypoints.length < 2) {
      return { success: false, message: "Dữ liệu hành trình không hợp lệ." };
    }

    console.log("==========================================================");
    console.log(`[Server Action] Xử lý lưu hành trình: "${tripName.trim()}"`);
    console.log(`[Thông tin] ID: trip_${Date.now()} | Phương tiện: ${vehicle || "car"} | Số điểm: ${waypoints.length}`);
    if (distanceKm && durationMin) {
      console.log(`[Thông số] Quãng đường: ${distanceKm} km | Thời gian: ${durationMin} phút`);
    }
    console.log("==========================================================");

    revalidatePath("/map");
    return { success: true, message: `Đã lưu thành công hành trình "${tripName.trim()}"!` };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra trên máy chủ." };
  }
}
