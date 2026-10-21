"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faChevronDown,
  faRoute,
  faCar,
  faMotorcycle,
  faPersonWalking,
  faClock,
  faCalendarDay,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import type { Location, Vehicle } from "@/types/vietmap";
import type { SavedItineraryRecord } from "@/services/itinerary-server-store";

interface SavedItinerariesPanelProps {
  savedTrips: SavedItineraryRecord[];
  onLoadTrip: (waypoints: Location[], vehicle: Vehicle) => void;
}

// ── Brand palette đồng bộ chuẩn 100% với RouteControlPanel bên trái ─────
const C = {
  darkest: "#1B262C",
  dark: "#0F4C75",
  mid: "#3282B8",
  light: "#BBE1FA",
} as const;

const FA_VEHICLE_ICONS = {
  car: faCar,
  motorcycle: faMotorcycle,
  foot: faPersonWalking,
} as const;

const VEHICLE_LABELS: Record<string, string> = {
  car: "Ô tô",
  motorcycle: "Xe máy",
  foot: "Đi bộ",
};

export default function SavedItinerariesPanel({
  savedTrips,
  onLoadTrip,
}: SavedItinerariesPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Bảng hành trình máy chủ"
      className="absolute top-4 right-4 z-[1000] w-[calc(100%-2rem)] sm:w-[22rem] max-w-[380px] max-h-[calc(100vh-2rem)] flex flex-col pointer-events-auto"
    >
      <div
        className="shadow-2xl rounded-2xl border w-full box-border flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden"
        style={{
          background: "#ffffff",
          borderColor: C.light,
        }}
      >
        {/* ── Header: Đồng bộ 100% nhận diện với RouteControlPanel bên trái ── */}
        <div
          className="px-4 py-3.5 w-full box-border shrink-0 cursor-pointer select-none"
          style={{
            background: C.darkest,
            borderRadius: collapsed ? "1rem" : "1rem 1rem 0 0",
            transition: "border-radius 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => setCollapsed((c) => !c)}
        >
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${C.mid}30` }}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="w-4 h-4"
                  style={{ color: C.light }}
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm leading-tight tracking-wide text-white truncate flex items-center gap-2">
                  <span>Hành trình máy chủ</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded-full border"
                    style={{
                      background: `${C.mid}40`,
                      color: C.light,
                      borderColor: `${C.light}50`,
                    }}
                  >
                    {savedTrips.length}
                  </span>
                </h2>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: `${C.light}bb` }}
                >
                  Server Action & Store Persistence
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed((c) => !c);
              }}
              className="p-1.5 rounded-lg transition-all shrink-0 ml-2"
              style={{ color: C.light }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${C.mid}30`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              aria-label="Thu gọn hoặc mở rộng bảng hành trình"
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Body: Hiển thị danh sách hành trình đồng bộ phong cách với bên trái ── */}
        {!collapsed && (
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)] [scrollbar-width:thin]">
            {/* Section label */}
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: C.dark }}
              >
                LỘ TRÌNH ĐÃ LƯU ({savedTrips.length})
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Phiên khách lưu trữ
              </span>
            </div>

            {/* List items */}
            {savedTrips.length === 0 ? (
              <div
                className="p-4 rounded-xl border border-dashed text-center text-xs space-y-1.5"
                style={{
                  background: `${C.light}10`,
                  borderColor: C.light,
                  color: C.mid,
                }}
              >
                <FontAwesomeIcon icon={faRoute} className="w-5 h-5 mx-auto text-slate-400 block mb-1" />
                <p className="font-semibold text-slate-700">Chưa có hành trình nào</p>
                <p className="text-[11px] text-slate-500">
                  Lập lộ trình ở bảng bên trái và bấm <strong>Lưu</strong> để lưu trữ lên máy chủ.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedTrips.map((trip) => {
                  const vehicleKey = (trip.vehicle as keyof typeof FA_VEHICLE_ICONS) || "car";
                  const VehicleIcon = FA_VEHICLE_ICONS[vehicleKey] || faCar;
                  const vehicleLabel = VEHICLE_LABELS[vehicleKey] || trip.vehicle;

                  return (
                    <div
                      key={trip.id}
                      className="rounded-xl p-3 border transition-all duration-200 hover:shadow-md flex flex-col gap-2.5"
                      style={{
                        background: `${C.light}15`,
                        borderColor: `${C.light}90`,
                      }}
                    >
                      {/* Tiêu đề lộ trình */}
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-bold text-xs text-slate-800 truncate leading-snug"
                            title={trip.tripName}
                          >
                            {trip.tripName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 mt-1">
                            <span
                              className="inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded text-[10px]"
                              style={{
                                background: `${C.mid}20`,
                                color: C.dark,
                              }}
                            >
                              <FontAwesomeIcon icon={VehicleIcon} className="w-2.5 h-2.5" />
                              <span>{vehicleLabel}</span>
                            </span>
                            <span>• {trip.waypoints.length} điểm</span>
                            {trip.distanceKm > 0 && <span>• {trip.distanceKm} km</span>}
                            {trip.durationMin > 0 && (
                              <span className="flex items-center gap-0.5">
                                • <FontAwesomeIcon icon={faClock} className="w-2 h-2 text-slate-400" />
                                {trip.durationMin} phút
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Thông tin ngày lưu & Nút nạp lại lộ trình */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarDay} className="w-2.5 h-2.5 text-slate-400" />
                          <span>
                            {new Date(trip.createdAt).toLocaleDateString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const mappedWaypoints: Location[] = trip.waypoints.map(
                              (wp, idx) => ({
                                id: `${trip.id}-wp-${idx}`,
                                name: wp.name,
                                address: wp.name,
                                lat: wp.lat,
                                lng: wp.lng,
                              })
                            );
                            onLoadTrip(
                              mappedWaypoints,
                              (trip.vehicle as Vehicle) || "car"
                            );
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm"
                          style={{
                            background: C.dark,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = C.mid)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = C.dark)}
                          title="Nạp lại hành trình này lên bản đồ và tính toán lại"
                        >
                          <FontAwesomeIcon icon={faFolderOpen} className="w-3 h-3" />
                          <span>Nạp lên bản đồ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
