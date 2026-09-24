import type { Location } from "@/types/vietmap";

export const HCM_LOCATIONS: Location[] = [
  {
    id: "ben-thanh",
    name: "Chợ Bến Thành",
    address: "Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    lat: 10.7725,
    lng: 106.698,
  },
  {
    id: "nha-tho-duc-ba",
    name: "Nhà thờ Đức Bà",
    address: "01 Công xã Paris, Phường Bến Nghé, Quận 1, TP.HCM",
    lat: 10.7798,
    lng: 106.699,
  },
  {
    id: "landmark-81",
    name: "Landmark 81",
    address: "720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM",
    lat: 10.7951,
    lng: 106.7218,
  },
  {
    id: "nguyen-hue",
    name: "Phố đi bộ Nguyễn Huệ",
    address: "Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    lat: 10.7743,
    lng: 106.7037,
  },
  {
    id: "thaocamvien",
    name: "Thảo Cầm Viên Sài Gòn",
    address: "02 Nguyễn Bỉnh Khiêm, Phường Bến Nghé, Quận 1, TP.HCM",
    lat: 10.7876,
    lng: 106.7053,
  },
  {
    id: "dinh-doc-lap",
    name: "Dinh Độc Lập",
    address: "135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP.HCM",
    lat: 10.777,
    lng: 106.6953,
  },
];

export const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];
export const DEFAULT_ZOOM = 13;
