"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCompass,
  faRotateLeft,
  faSpinner,
  faChevronDown,
  faClock,
  faRoute,
  faXmark,
  faCircleExclamation,
  faCar,
  faMotorcycle,
  faPersonWalking,
  faGripVertical,
  faPlus,
  faTrash,
  faMagnifyingGlass,
  faPen,
  faBookmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { VEHICLE_OPTIONS } from "@/types/vietmap";
import type { Location, Vehicle, RouteInfo } from "@/types/vietmap";
import { saveTripItineraryAction } from "@/actions/itinerary";

// ── Brand palette ──────────────────────────────────────────────────────
const C = {
  darkest: "#1B262C",
  dark: "#0F4C75",
  mid: "#3282B8",
  light: "#BBE1FA",
} as const;

function waypointLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function waypointColor(index: number, total: number) {
  if (index === 0) return "#22c55e";
  if (index === total - 1) return "#ef4444";
  return C.mid;
}

const FA_VEHICLE_ICONS = {
  car: faCar,
  motorcycle: faMotorcycle,
  foot: faPersonWalking,
} as const;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} phút`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

interface VietmapAutocompleteItem {
  ref_id: string;
  name?: string;
  display?: string;
  address?: string;
  categories?: string[];
  boundaries?: Array<{ type: number; full_name?: string }>;
}

interface VietmapPlaceDetail {
  lat?: number | string;
  lng?: number | string;
}

function formatVietmapAddress(
  place: VietmapAutocompleteItem | null | undefined
): string {
  if (!place) return "";
  const boundaries = place.boundaries || [];
  const ward = boundaries.find((b) => b.type === 2);
  const city = boundaries.find((b) => b.type === 0);
  const parts = [ward?.full_name, city?.full_name].filter(Boolean);
  if (place.name && parts.length > 0) {
    return `${place.name}, ${parts.join(", ")}`;
  }
  return place.display || place.address || place.name || "";
}

// ════════════════════════════════════════════════════════════════════════
// Waypoint Search Input (Replaces static dropdown, matching PlaceSearch)
// ════════════════════════════════════════════════════════════════════════
interface WaypointSearchProps {
  value: Location | null;
  onChange: (loc: Location | null) => void;
  placeholder: string;
  popularPlaces: Location[];
}

function WaypointSearchItem({
  value,
  onChange,
  placeholder,
  popularPlaces,
}: WaypointSearchProps) {
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<VietmapAutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isEditing = isManualEditing || !value;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setIsManualEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autocomplete fetch with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/vietmap/autocomplete?text=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data : []);
          setShowDropdown(true);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Lỗi tìm kiếm Vietmap:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  // Handle selecting a Vietmap autocomplete suggestion
  const handleSelectSuggestion = async (item: VietmapAutocompleteItem) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vietmap/place?ref_id=${item.ref_id}`);
      if (!res.ok) throw new Error("Không thể lấy tọa độ");
      const details: VietmapPlaceDetail = await res.json();

      if (details && details.lat != null && details.lng != null) {
        onChange({
          id: item.ref_id || `loc-${item.name || "point"}`,
          name: item.name || item.display || "Địa điểm",
          address: formatVietmapAddress(item),
          lat: Number(details.lat),
          lng: Number(details.lng),
        });
        setIsManualEditing(false);
        setShowDropdown(false);
        setQuery("");
        setSuggestions([]);
      } else {
        alert("Không tìm thấy tọa độ của địa điểm này.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi lấy thông tin địa điểm.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a popular place from database
  const handleSelectPopular = (place: Location) => {
    onChange({
      ...place,
    });
    setIsManualEditing(false);
    setShowDropdown(false);
    setQuery("");
    setSuggestions([]);
  };

  // If already selected and not in editing mode -> Display place card
  if (value && !isEditing) {
    return (
      <div className="min-w-0 flex-1 flex items-center justify-between gap-1.5 py-1.5 px-2.5 rounded-lg border bg-white border-slate-200 hover:border-slate-300 transition-colors">
        <div
          className="min-w-0 flex-1 cursor-pointer select-none"
          onClick={() => {
            setIsManualEditing(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
        >
          <p className="text-xs font-semibold text-slate-800 truncate leading-snug">
            {value.name}
          </p>
          {value.address && (
            <p className="text-[10px] text-slate-500 truncate leading-snug mt-0.5">
              {value.address}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsManualEditing(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="p-1 rounded text-slate-400 hover:text-[#0F4C75] hover:bg-slate-100 transition-colors"
            title="Đổi địa điểm"
          >
            <FontAwesomeIcon icon={faPen} className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setIsManualEditing(false);
            }}
            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Xóa địa điểm"
          >
            <FontAwesomeIcon icon={faXmark} className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    );
  }

  // Search input mode (similar to PlaceSearch)
  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-white border-[#3282B8] ring-2 ring-[#BBE1FA]/40 transition-all">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="w-3 h-3 text-slate-400 shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const nextVal = e.target.value;
            setQuery(nextVal);
            if (nextVal.trim().length < 2) {
              setSuggestions([]);
            }
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
        />
        {loading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-3 h-3 text-[#3282B8] animate-spin shrink-0"
          />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
            }}
            className="text-slate-400 hover:text-slate-600 shrink-0 p-0.5"
          >
            <FontAwesomeIcon icon={faXmark} className="w-2.5 h-2.5" />
          </button>
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              setIsManualEditing(false);
              setQuery("");
              setSuggestions([]);
            }}
            className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
            title="Hủy"
          >
            Hủy
          </button>
        ) : null}
      </div>

      {/* Autocomplete / Suggestions Dropdown */}
      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-xl shadow-2xl border bg-white z-[9999] max-h-56 overflow-y-auto p-1.5 space-y-1"
          style={{ borderColor: C.light }}
        >
          {query.trim().length >= 2 ? (
            suggestions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                {loading
                  ? "Đang tìm kiếm..."
                  : "Không tìm thấy địa điểm phù hợp"}
              </div>
            ) : (
              suggestions.map((item) => (
                <button
                  key={item.ref_id}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors hover:bg-slate-50"
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="w-3 h-3 text-[#0F4C75] mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {item.name || item.display}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {formatVietmapAddress(item)}
                    </p>
                    {item.categories && item.categories.length > 0 && (
                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {item.categories[0]}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )
          ) : (
            // Quick-select from popular places
            <div>
              <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Gợi ý địa điểm nổi tiếng
              </p>
              {popularPlaces.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPopular(p)}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition-colors hover:bg-indigo-50/60"
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="w-3 h-3 text-[#3282B8] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {p.address}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Main RouteControlPanel
// ════════════════════════════════════════════════════════════════════════
interface RouteControlPanelProps {
  waypoints: (Location | null)[];
  vehicle: Vehicle;
  routeInfo: RouteInfo | null;
  loading: boolean;
  error: string | null;
  places: Location[];
  onUpdate: (index: number, loc: Location | null) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onVehicleChange: (v: Vehicle) => void;
  onCalculate: () => void;
  onClear: () => void;
  onClearError: () => void;
}

function RouteControlPanelComponent({
  waypoints,
  vehicle,
  routeInfo,
  loading,
  error,
  places,
  onUpdate,
  onAdd,
  onRemove,
  onReorder,
  onVehicleChange,
  onCalculate,
  onClear,
  onClearError,
}: RouteControlPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const handleSaveItinerary = useCallback(async () => {
    const validWaypoints = waypoints.filter(Boolean) as Location[];
    if (validWaypoints.length < 2) return;

    try {
      setSaving(true);
      const tripName = `Lộ trình ${validWaypoints[0].name} - ${
        validWaypoints[validWaypoints.length - 1].name
      }`;
      const res = await saveTripItineraryAction({
        tripName,
        waypoints: validWaypoints.map((w) => ({
          name: w.name,
          lat: w.lat,
          lng: w.lng,
        })),
        vehicle,
        distanceKm: routeInfo?.distanceKm,
        durationMin: routeInfo?.durationMin,
      });

      if (res.success) {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(res.message);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        setSaveSuccessMsg(null);
        setSaveErrorMsg(res.message || "Dữ liệu không hợp lệ.");
        setTimeout(() => setSaveErrorMsg(null), 5000);
      }
    } catch (err) {
      console.error("Lỗi khi gọi Server Action:", err);
      setSaveErrorMsg("Lỗi kết nối máy chủ khi lưu hành trình.");
      setTimeout(() => setSaveErrorMsg(null), 5000);
    } finally {
      setSaving(false);
    }
  }, [waypoints, vehicle, routeInfo]);

  // ── Drag & Drop ───────────────────────────────────────────────────────
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (index: number) => {
      if (dragIndex !== null && dragIndex !== index) {
        onReorder(dragIndex, index);
      }
      setDragIndex(null);
      setDragOverIndex(null);
    },
    [dragIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const canCalculate = waypoints.filter(Boolean).length >= 2 && !loading;
  const filledCount = waypoints.filter(Boolean).length;

  return (
    <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] sm:w-[24rem] max-w-[400px]">
      <div
        className="shadow-2xl rounded-2xl border w-full box-border"
        style={{
          background: "#ffffff",
          borderColor: C.light,
        }}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div
          className="px-4 py-3.5 w-full box-border"
          style={{
            background: C.darkest,
            borderRadius: collapsed ? "1rem" : "1rem 1rem 0 0",
            transition: "border-radius 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${C.mid}30` }}
              >
                <FontAwesomeIcon
                  icon={faCompass}
                  className="w-4 h-4"
                  style={{ color: C.light }}
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm leading-tight tracking-wide text-white truncate">
                  Vietmap Route Finder
                </h1>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: `${C.light}bb` }}
                >
                  TP. Hồ Chí Minh
                </p>
              </div>
            </div>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-1.5 rounded-lg transition-all shrink-0 ml-2"
              style={{ color: C.light }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${C.mid}30`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              aria-label="Thu gọn bảng điều khiển"
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        {!collapsed && (
          <div className="p-3.5 space-y-3 w-full box-border">
            {/* ── Waypoint List ──────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest truncate"
                  style={{ color: C.mid }}
                >
                  Điểm dừng ({filledCount} / {waypoints.length})
                </span>
                {waypoints.length < 8 && (
                  <button
                    type="button"
                    onClick={onAdd}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                    style={{
                      background: `${C.light}60`,
                      color: C.dark,
                      border: `1px solid ${C.light}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.light)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = `${C.light}60`)
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                    <span>Thêm điểm</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 w-full">
                {waypoints.map((wp, i) => {
                  const isDragging = dragIndex === i;
                  const isDragOver = dragOverIndex === i && dragIndex !== i;
                  const itemKey = wp?.id ? `wp-${wp.id}` : `slot-${i}`;

                  return (
                    <div
                      key={itemKey}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDrop={() => handleDrop(i)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-1.5 rounded-xl p-1.5 transition-all w-full min-w-0"
                      style={{
                        background: isDragOver
                          ? `${C.light}80`
                          : isDragging
                          ? `${C.light}30`
                          : `${C.light}20`,
                        border: isDragOver
                          ? `2px dashed ${C.mid}`
                          : "1.5px solid transparent",
                        opacity: isDragging ? 0.5 : 1,
                      }}
                    >
                      {/* Drag handle */}
                      <div
                        className="shrink-0 cursor-grab active:cursor-grabbing px-1 text-slate-400 hover:text-slate-600"
                        title="Kéo thả để đổi thứ tự"
                      >
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className="w-3 h-3"
                        />
                      </div>

                      {/* Waypoint label badge */}
                      <div
                        className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                        style={{
                          background: waypointColor(i, waypoints.length),
                        }}
                      >
                        {waypointLabel(i)}
                      </div>

                      {/* Search & Select component (like PlaceSearch) */}
                      <WaypointSearchItem
                        value={wp}
                        onChange={(loc) => onUpdate(i, loc)}
                        placeholder={
                          i === 0
                            ? "Tìm điểm xuất phát..."
                            : `Tìm điểm ${waypointLabel(i)}...`
                        }
                        popularPlaces={places}
                      />

                      {/* Remove button if > 2 waypoints */}
                      {waypoints.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onRemove(i)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Xóa điểm này"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Divider ────────────────────────────────────── */}
            <div
              className="h-px w-full"
              style={{ background: `${C.light}80` }}
            />

            {/* ── Vehicle Selector ───────────────────────────── */}
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                style={{ color: C.mid }}
              >
                Phương tiện
              </span>
              <div className="grid grid-cols-3 gap-1.5 w-full">
                {VEHICLE_OPTIONS.map((v) => {
                  const active = vehicle === v.value;
                  return (
                    <button
                      key={v.value}
                      id={`vehicle-${v.value}`}
                      type="button"
                      onClick={() => {
                        onVehicleChange(v.value);
                        onClear();
                      }}
                      className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all duration-200 min-w-0"
                      style={{
                        background: active ? C.light : `${C.light}20`,
                        borderColor: active ? C.dark : `${C.light}80`,
                        color: active ? C.dark : C.mid,
                        boxShadow: active ? `0 2px 6px ${C.dark}20` : "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={FA_VEHICLE_ICONS[v.value]}
                        className="w-3.5 h-3.5 shrink-0"
                      />
                      <span className="truncate">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Error Banner ────────────────────────────────── */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl px-3 py-2 bg-red-50 border border-red-200 animate-in fade-in duration-200">
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0"
                />
                <p className="text-xs text-red-700 flex-1 leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={onClearError}
                  className="text-red-400 hover:text-red-600 shrink-0"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* ── Route Info Card ─────────────────────────────── */}
            {routeInfo && (
              <div
                className="rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200"
                style={{
                  background: `${C.light}60`,
                  border: `1.5px solid ${C.mid}40`,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: C.dark }}
                >
                  <FontAwesomeIcon icon={faRoute} className="w-2.5 h-2.5" />
                  Thông tin lộ trình
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-2 text-center bg-white/90 shadow-sm">
                    <div
                      className="flex items-center justify-center gap-1 mb-0.5"
                      style={{ color: C.mid }}
                    >
                      <FontAwesomeIcon icon={faRoute} className="w-2.5 h-2.5" />
                      <span className="text-[11px] font-medium">Khoảng cách</span>
                    </div>
                    <p className="text-lg font-black" style={{ color: C.dark }}>
                      {routeInfo.distanceKm}
                      <span
                        className="text-xs font-semibold ml-0.5"
                        style={{ color: C.mid }}
                      >
                        km
                      </span>
                    </p>
                  </div>

                  <div className="rounded-lg p-2 text-center bg-white/90 shadow-sm">
                    <div
                      className="flex items-center justify-center gap-1 mb-0.5"
                      style={{ color: C.mid }}
                    >
                      <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" />
                      <span className="text-[11px] font-medium">Thời gian</span>
                    </div>
                    <p
                      className="text-sm font-extrabold leading-tight"
                      style={{ color: C.darkest }}
                    >
                      {formatDuration(routeInfo.durationMin)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Success Banner for Server Action ────────────────── */}
            {saveSuccessMsg && (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                />
                <span className="flex-1">{saveSuccessMsg}</span>
              </div>
            )}

            {/* ── Error Banner for Server Action Validation ───────── */}
            {saveErrorMsg && (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in duration-200">
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="w-3.5 h-3.5 text-rose-600 shrink-0"
                />
                <span className="flex-1">{saveErrorMsg}</span>
              </div>
            )}

            {/* ── Action Buttons ──────────────────────────────── */}
            <div className="flex gap-2 pt-1">
              <button
                id="find-route-btn"
                type="button"
                onClick={onCalculate}
                disabled={!canCalculate}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                style={
                  canCalculate
                    ? {
                        background: C.dark,
                        color: "#fff",
                        boxShadow: `0 4px 12px ${C.dark}40`,
                      }
                    : {
                        background: `${C.light}60`,
                        color: `${C.mid}80`,
                        cursor: "not-allowed",
                      }
                }
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="w-3.5 h-3.5 animate-spin"
                    />
                    <span>Đang tính toán...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCompass} className="w-3.5 h-3.5" />
                    <span>Tìm đường</span>
                  </>
                )}
              </button>

              {canCalculate && (
                <button
                  id="save-itinerary-btn"
                  type="button"
                  onClick={handleSaveItinerary}
                  disabled={saving}
                  className="px-3 py-2.5 rounded-xl transition-all font-semibold text-xs border flex items-center gap-1.5 shrink-0"
                  style={{
                    background: "#ecfdf5",
                    color: "#047857",
                    borderColor: "#a7f3d0",
                  }}
                  title="Lưu hành trình (Gọi Server Action)"
                >
                  <FontAwesomeIcon
                    icon={saving ? faSpinner : faBookmark}
                    className={`w-3 h-3 ${saving ? "animate-spin" : ""}`}
                  />
                  <span>{saving ? "Đang lưu..." : "Lưu"}</span>
                </button>
              )}

              {(routeInfo || error) && (
                <button
                  id="clear-route-btn"
                  type="button"
                  onClick={onClear}
                  className="px-3 py-2.5 rounded-xl transition-all font-medium text-xs border"
                  style={{
                    background: `${C.light}40`,
                    color: C.mid,
                    borderColor: C.light,
                  }}
                  title="Xóa lộ trình"
                >
                  <FontAwesomeIcon
                    icon={faRotateLeft}
                    className="w-3.5 h-3.5"
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(RouteControlPanelComponent);
