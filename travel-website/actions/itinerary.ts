'use server';

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  saveItineraryRecord,
  getSavedItineraries,
  SavedItineraryRecord,
} from "@/services/itinerary-server-store";
import {
  validateItineraryInput,
  SaveItineraryInput,
  Waypoint,
} from "@/services/itinerary-validator";

export type { Waypoint, SaveItineraryInput };

export interface ActionResponse {
  success: boolean;
  message: string;
  data?: SavedItineraryRecord;
  errors?: string[];
}

export async function saveTripItineraryAction(
  input: SaveItineraryInput
): Promise<ActionResponse> {
  try {
    // 1. Thẩm định dữ liệu máy chủ (Kiểm tra waypoints & tọa độ WGS84)
    const validation = validateItineraryInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message,
        errors: validation.errors,
      };
    }

    // 2. Định danh người dùng qua Anonymous Cookie (Per-User Isolation)
    const cookieStore = await cookies();
    let guestId = cookieStore.get("tourist_guest_id")?.value;
    if (!guestId) {
      guestId = `guest_${crypto.randomUUID().slice(0, 12)}`;
      cookieStore.set("tourist_guest_id", guestId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    // 3. Chuẩn bị bản ghi và lưu trữ bền vững vào Server Store
    const tripName =
      input.tripName?.trim() ||
      `Lộ trình ${input.waypoints[0].name} - ${input.waypoints[input.waypoints.length - 1].name}`;

    const record: SavedItineraryRecord = {
      id: `trip_${Date.now()}`,
      userId: guestId,
      tripName,
      waypoints: input.waypoints,
      vehicle: validation.safeVehicle,
      distanceKm: Number((input.distanceKm || 0).toFixed(2)),
      durationMin: Math.round(input.durationMin || 0),
      createdAt: new Date().toISOString(),
    };

    await saveItineraryRecord(record);

    // 4. Log máy chủ
    console.log(`[Server Action] Xử lý lưu hành trình: "${record.tripName}"`);
    console.log(
      `[Thông tin] ID: ${record.id} | Phương tiện: ${record.vehicle} | Số điểm: ${record.waypoints.length}`
    );

    // 5. Làm tươi Route Cache của trang /map
    revalidatePath("/map");

    return {
      success: true,
      message: `Đã lưu thành công hành trình "${record.tripName}"!`,
      data: record,
    };
  } catch (err) {
    console.error("[Server Action Error]:", err);
    return { success: false, message: "Có lỗi xảy ra trên máy chủ khi ghi nhận hành trình." };
  }
}

export async function getMySavedItinerariesAction(): Promise<SavedItineraryRecord[]> {
  try {
    const cookieStore = await cookies();
    const guestId = cookieStore.get("tourist_guest_id")?.value;
    if (!guestId) return [];
    return await getSavedItineraries(guestId);
  } catch (error) {
    return [];
  }
}
