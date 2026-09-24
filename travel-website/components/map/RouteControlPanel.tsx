"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  faBicycle,
  faPersonWalking,
  faMotorcycle,
  faGripVertical,
  faPlus,
  faTrash,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { HCM_LOCATIONS } from "@/constants/locations";
import { VEHICLE_OPTIONS } from "@/types/vietmap";
import type { Location, Vehicle, RouteInfo } from "@/types/vietmap";

// ── Brand palette (flat, no gradients) ─────────────────────────────────
const C = {
  darkest: "#1B262C",
  dark: "#0F4C75",
  mid: "#3282B8",
  light: "#BBE1FA",
} as const;

// ── Waypoint label: A, B, C, … ─────────────────────────────────────────
function waypointLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function waypointColor(index: number, total: number) {
  if (index === 0) return "#22c55e";
  if (index === total - 1) return "#ef4444";
  return C.mid;
}

// ── FA vehicle icon map ─────────────────────────────────────────────────
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

// ════════════════════════════════════════════════════════════════════════
// Custom Dropdown
// ════════════════════════════════════════════════════════════════════════
interface DropdownProps {
  value: Location | null;
  onChange: (loc: Location | null) => void;
  placeholder: string;
  /** IDs that are already selected in OTHER slots (to grey them out) */
  usedIds: string[];
  index: number;
  total: number;
}

function LocationDropdown({ value, onChange, placeholder, usedIds, index, total }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const dotColor = waypointColor(index, total);

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      {/* ── Trigger ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all text-left"
        style={{
          background: open ? `${C.light}70` : `${C.light}30`,
          border: `1.5px solid ${open ? C.mid : C.light}`,
          color: value ? C.darkest : "#9ca3af",
          fontFamily: "inherit",
          minWidth: 0,
        }}
      >
        {/* Dot indicator */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: dotColor }}
        />

        {/* Selected name or placeholder */}
        <span className="flex-1 truncate font-medium">
          {value ? value.name : placeholder}
        </span>

        {/* Chevron */}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: C.mid }}
        />
      </button>

      {/* ── Dropdown list ───────────────────────────────────────── */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-xl shadow-xl border overflow-hidden"
          style={{
            background: "#fff",
            borderColor: C.light,
            zIndex: 9999,
          }}
        >
          {/* Clear selection */}
          {value && (
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors"
              style={{ borderBottom: `1px solid ${C.light}60`, color: "#ef4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
              <span>Bỏ chọn</span>
            </button>
          )}

          {HCM_LOCATIONS.map((loc) => {
            const isSelected = value?.id === loc.id;
            const isUsed = usedIds.includes(loc.id);
            return (
              <button
                key={loc.id}
                type="button"
                disabled={isUsed && !isSelected}
                onClick={() => { onChange(loc); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors"
                style={{
                  background: isSelected ? `${C.light}` : "transparent",
                  color: isUsed && !isSelected ? "#9ca3af" : C.darkest,
                  cursor: isUsed && !isSelected ? "not-allowed" : "pointer",
                  opacity: isUsed && !isSelected ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isUsed)
                    e.currentTarget.style.background = `${C.light}50`;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="w-3 h-3 flex-shrink-0"
                  style={{ color: isSelected ? C.dark : C.mid }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`truncate ${isSelected ? "font-semibold" : "font-medium"}`}>
                    {loc.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: `${C.mid}99` }}>
                    {loc.address}
                  </p>
                </div>
                {isSelected && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: C.dark }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Main Panel
// ════════════════════════════════════════════════════════════════════════
interface RouteControlPanelProps {
  waypoints: (Location | null)[];
  vehicle: Vehicle;
  routeInfo: RouteInfo | null;
  loading: boolean;
  error: string | null;
  onUpdate: (index: number, loc: Location | null) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onVehicleChange: (v: Vehicle) => void;
  onCalculate: () => void;
  onClear: () => void;
  onClearError: () => void;
}

export default function RouteControlPanel({
  waypoints,
  vehicle,
  routeInfo,
  loading,
  error,
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

  // ── Drag & drop state ─────────────────────────────────────────────────
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.effectAllowed = "move";
      setDragIndex(index);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    },
    []
  );

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

  // IDs already selected (for greying out in other dropdowns)
  const selectedIds = waypoints.filter(Boolean).map((w) => w!.id);

  const canCalculate =
    waypoints.filter(Boolean).length >= 2 && !loading;

  const filledCount = waypoints.filter(Boolean).length;

  return (
    <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] sm:w-[22rem]">
      <div
        className="shadow-2xl rounded-2xl overflow-visible border"
        style={{
          background: "#ffffff",
          borderColor: C.light,
        }}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div
          className="px-4 py-3.5"
          style={{
            background: C.darkest,
            borderRadius: collapsed ? "1rem" : "1rem 1rem 0 0",
            transition: "border-radius 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${C.mid}30` }}
              >
                <FontAwesomeIcon
                  icon={faCompass}
                  className="w-4 h-4"
                  style={{ color: C.light }}
                />
              </div>
              <div>
                <h1
                  className="font-bold text-sm leading-tight tracking-wide"
                  style={{ color: "#fff" }}
                >
                  Vietmap Route Finder
                </h1>
                <p className="text-xs font-medium" style={{ color: `${C.light}bb` }}>
                  TP. Hồ Chí Minh
                </p>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: C.light }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${C.mid}30`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>
        </div>

        {/* ── Body (animated expand/collapse) ────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: collapsed ? "0fr" : "1fr",
            transition: "grid-template-rows 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
          <div className="p-3.5 space-y-3">
            {/* ── Waypoint List ──────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: C.mid }}
                >
                  Địa điểm ({filledCount} / {waypoints.length})
                </span>
                {/* Add waypoint button */}
                {waypoints.length < 8 && (
                  <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all"
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
                    Thêm điểm
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {waypoints.map((wp, i) => {
                  const isDragging = dragIndex === i;
                  const isDragOver = dragOverIndex === i && dragIndex !== i;

                  return (
                    <div
                      key={i}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDrop={() => handleDrop(i)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-2 rounded-xl p-1.5 transition-all"
                      style={{
                        background: isDragOver
                          ? `${C.light}80`
                          : isDragging
                            ? `${C.light}30`
                            : `${C.light}15`,
                        border: isDragOver
                          ? `2px dashed ${C.mid}`
                          : "2px solid transparent",
                        opacity: isDragging ? 0.5 : 1,
                        cursor: "default",
                      }}
                    >
                      {/* Drag handle */}
                      <div
                        className="flex-shrink-0 cursor-grab active:cursor-grabbing px-0.5"
                        title="Kéo để sắp xếp lại"
                        style={{ color: `${C.mid}60` }}
                      >
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className="w-3 h-3"
                        />
                      </div>

                      {/* Waypoint label badge */}
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: waypointColor(i, waypoints.length) }}
                      >
                        {waypointLabel(i)}
                      </div>

                      {/* Custom dropdown */}
                      <LocationDropdown
                        value={wp}
                        onChange={(loc) => onUpdate(i, loc)}
                        placeholder={i === 0 ? "Điểm xuất phát" : `Điểm ${waypointLabel(i)}`}
                        usedIds={selectedIds.filter(
                          (id) => id !== wp?.id
                        )}
                        index={i}
                        total={waypoints.length}
                      />

                      {/* Remove button — only when > 2 waypoints */}
                      {waypoints.length > 2 ? (
                        <button
                          type="button"
                          onClick={() => onRemove(i)}
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                          style={{ color: "#ef4444" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#fff5f5")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                          title="Xóa điểm này"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        </button>
                      ) : (
                        <div className="w-7 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Divider ────────────────────────────────────── */}
            <div className="h-px" style={{ background: `${C.light}80` }} />

            {/* ── Vehicle Selector ───────────────────────────── */}
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest block mb-2"
                style={{ color: C.mid }}
              >
                Phương tiện
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {VEHICLE_OPTIONS.map((v) => {
                  const active = vehicle === v.value;
                  return (
                    <button
                      key={v.value}
                      id={`vehicle-${v.value}`}
                      type="button"
                      onClick={() => { onVehicleChange(v.value); onClear(); }}
                      className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl text-[11px] font-semibold border transition-all duration-200"
                      style={{
                        background: active ? C.light : `${C.light}20`,
                        borderColor: active ? C.dark : `${C.light}80`,
                        color: active ? C.dark : C.mid,
                        boxShadow: active ? `0 2px 6px ${C.dark}20` : "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={FA_VEHICLE_ICONS[v.value]}
                        className="w-4 h-4"
                      />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Error Banner ────────────────────────────────── */}
            {error && (
              <div
                className="flex items-start gap-2 rounded-xl px-3 py-2.5 animate-in slide-in-from-top-2 duration-300"
                style={{
                  background: "#fff1f2",
                  border: "1.5px solid #fecaca",
                }}
              >
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-red-700 flex-1 leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={onClearError}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* ── Route Info Card ─────────────────────────────── */}
            {routeInfo && (
              <div
                className="rounded-xl px-4 py-3 animate-in slide-in-from-bottom-2 duration-300"
                style={{
                  background: `${C.light}60`,
                  border: `1.5px solid ${C.mid}40`,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5"
                  style={{ color: C.dark }}
                >
                  <FontAwesomeIcon icon={faRoute} className="w-2.5 h-2.5" />
                  Thông tin lộ trình
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    className="rounded-lg px-3 py-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.8)" }}
                  >
                    <div
                      className="flex items-center justify-center gap-1 mb-1"
                      style={{ color: C.mid }}
                    >
                      <FontAwesomeIcon icon={faRoute} className="w-2.5 h-2.5" />
                      <span className="text-xs font-medium">Khoảng cách</span>
                    </div>
                    <p className="text-xl font-extrabold" style={{ color: C.dark }}>
                      {routeInfo.distanceKm}
                      <span className="text-sm font-semibold ml-0.5" style={{ color: C.mid }}>
                        km
                      </span>
                    </p>
                  </div>
                  <div
                    className="rounded-lg px-3 py-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.8)" }}
                  >
                    <div
                      className="flex items-center justify-center gap-1 mb-1"
                      style={{ color: C.mid }}
                    >
                      <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" />
                      <span className="text-xs font-medium">Thời gian</span>
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

            {/* ── Action Buttons ──────────────────────────────── */}
            <div className="flex gap-2">
              <button
                id="find-route-btn"
                type="button"
                onClick={onCalculate}
                disabled={!canCalculate}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                style={
                  canCalculate
                    ? {
                      background: C.dark,
                      color: "#fff",
                      boxShadow: `0 4px 12px ${C.dark}40`,
                      letterSpacing: "0.02em",
                    }
                    : {
                      background: `${C.light}60`,
                      color: `${C.mid}80`,
                      cursor: "not-allowed",
                    }
                }
                onMouseEnter={(e) => {
                  if (canCalculate) {
                    e.currentTarget.style.background = C.mid;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canCalculate) {
                    e.currentTarget.style.background = C.dark;
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="w-4 h-4 animate-spin"
                    />
                    Đang tính toán...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCompass} className="w-4 h-4" />
                    Tìm đường
                  </>
                )}
              </button>

              {(routeInfo || error) && (
                <button
                  id="clear-route-btn"
                  type="button"
                  onClick={onClear}
                  className="px-3 py-2.5 rounded-xl transition-all duration-200 font-medium"
                  style={{
                    background: `${C.light}40`,
                    color: C.mid,
                    border: `1.5px solid ${C.light}`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.light)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = `${C.light}40`)
                  }
                  aria-label="Xóa lộ trình"
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
