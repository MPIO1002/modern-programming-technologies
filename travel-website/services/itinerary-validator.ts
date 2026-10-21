export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
}

export interface SaveItineraryInput {
  tripName?: string;
  waypoints: Waypoint[];
  vehicle?: string;
  distanceKm?: number;
  durationMin?: number;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  errors?: string[];
  safeVehicle: string;
}

const ALLOWED_VEHICLES = ["car", "bike", "foot", "motorcycle"];

/**
 * Thẩm định dữ liệu đầu vào phía máy chủ (Defense-in-Depth):
 * - Kiểm tra số lượng điểm dừng (2 - 25)
 * - Kiểm tra kiểu dữ liệu và phạm vi tọa độ chuẩn quốc tế WGS84
 * - Whitelist phương tiện di chuyển
 */
export function validateItineraryInput(input: SaveItineraryInput): ValidationResult {
  const { waypoints, vehicle = "car" } = input;
  const errors: string[] = [];

  // 1. Kiểm tra cấu trúc danh sách điểm dừng
  if (!waypoints || !Array.isArray(waypoints)) {
    return {
      isValid: false,
      message: "Dữ liệu điểm dừng không hợp lệ (phải là danh sách mảng).",
      safeVehicle: "car",
    };
  }

  if (waypoints.length < 2) {
    return {
      isValid: false,
      message: "Hành trình cần ít nhất 2 điểm dừng (điểm xuất phát và điểm đến).",
      safeVehicle: "car",
    };
  }

  if (waypoints.length > 25) {
    return {
      isValid: false,
      message: "Hành trình vượt quá giới hạn tối đa cho phép (25 điểm dừng).",
      safeVehicle: "car",
    };
  }

  // 2. Kiểm tra chi tiết từng điểm dừng và phạm vi tọa độ WGS84
  waypoints.forEach((wp, index) => {
    if (!wp || typeof wp !== "object") {
      errors.push(`Điểm dừng thứ ${index + 1} có cấu trúc không hợp lệ.`);
      return;
    }

    const pointName = typeof wp.name === "string" ? wp.name.trim() : "";
    if (!pointName) {
      errors.push(`Điểm dừng thứ ${index + 1} thiếu tên địa danh hợp lệ.`);
    }

    if (
      typeof wp.lat !== "number" ||
      !Number.isFinite(wp.lat) ||
      wp.lat < -90 ||
      wp.lat > 90
    ) {
      errors.push(
        `Điểm dừng thứ ${index + 1} có vĩ độ (lat: ${wp.lat}) không hợp lệ (phạm vi: -90 đến 90).`
      );
    }

    if (
      typeof wp.lng !== "number" ||
      !Number.isFinite(wp.lng) ||
      wp.lng < -180 ||
      wp.lng > 180
    ) {
      errors.push(
        `Điểm dừng thứ ${index + 1} có kinh độ (lng: ${wp.lng}) không hợp lệ (phạm vi: -180 đến 180).`
      );
    }
  });

  const safeVehicle = ALLOWED_VEHICLES.includes(vehicle) ? vehicle : "car";

  if (errors.length > 0) {
    return {
      isValid: false,
      message: "Dữ liệu tọa độ điểm dừng không vượt qua kiểm tra an toàn phía máy chủ.",
      errors,
      safeVehicle,
    };
  }

  return {
    isValid: true,
    message: "Dữ liệu hợp lệ.",
    safeVehicle,
  };
}
