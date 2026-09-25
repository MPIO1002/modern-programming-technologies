"use client";

import { useEffect, useRef, useState } from "react";

import PlaceFilters from "./PlaceFilters";
import PlaceList, { PlaceListSkeleton } from "./PlaceList";

import type {
  PlaceFiltersValue,
  Suggestion,
} from "./types";

type PlaceSearchProps = {
  filters: PlaceFiltersValue;
  onFiltersChange: (value: PlaceFiltersValue) => void;
};

export default function PlaceSearch({
  filters,
  onFiltersChange,
}: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [results, setResults] = useState<Suggestion[]>([]);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [error, setError] = useState("");

  const [showResults, setShowResults] = useState(false);

  const [currentAddress, setCurrentAddress] = useState("");
  const [focus, setFocus] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setResults([]);
      setError("");
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("text", trimmedQuery);

        if (focus) {
          params.set("focus", focus);
        }

        if (filters.cityId) {
          params.set("cityId", filters.cityId);
        }

        if (filters.wardId) {
          params.set("wardId", filters.wardId);
        }

        if (filters.category) {
          params.set("cats", filters.category);
        }

        const response = await fetch(
          `/api/vietmap/autocomplete?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tìm kiếm địa điểm");
        }

        const data = await response.json();

        const places = Array.isArray(data) ? data : [];

        setResults(places);
        setSuggestions(places);
        setShowResults(true);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(err);

        setError("Có lỗi khi tìm kiếm. Thử lại nhé.");
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [
    query,
    focus,
    filters.cityId,
    filters.wardId,
    filters.category,
  ]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return;
    }

    setShowResults(false);
  }

  function handleSelect(place: Suggestion) {
    setQuery(place.name || place.display);

    setSuggestions([]);
    setShowResults(false);
  }

  async function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const nextFocus = `${latitude},${longitude}`;

        setFocus(nextFocus);

        try {
          const response = await fetch(
            `/api/vietmap/reverse?lat=${latitude}&lng=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Không thể lấy địa chỉ hiện tại");
          }

          const data = await response.json();

          const place = Array.isArray(data) ? data[0] : data;

          if (!place) {
            throw new Error("Không tìm thấy địa chỉ hiện tại");
          }

          const address = formatCurrentAddress(place);

          setCurrentAddress(address);
          setQuery(address);
          setSuggestions([]);
          setShowResults(false);
        } catch (error) {
          console.error(error);
          setError("Không lấy được địa chỉ hiện tại.");
        } finally {
          setLocationLoading(false);
        }
      },
      (geoError) => {
        console.error(geoError);

        setLocationLoading(false);

        if (geoError.code === 1) {
          setError(
            "Bạn cần cho phép trình duyệt sử dụng vị trí."
          );
        } else {
          setError("Không lấy được vị trí hiện tại.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

  return (
    <section className="mx-auto mt-9 w-full max-w-[1080px]">
      {/* SEARCH + ACTIONS */}
      <div
        ref={searchRef}
        className="flex flex-col gap-2.5 min-[901px]:flex-row min-[901px]:items-stretch"
      >
        <div className="relative min-w-0 flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex h-[52px] items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_30px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 focus-within:border-indigo-300 focus-within:shadow-[0_1px_2px_rgba(15,23,42,0.03),0_12px_34px_rgba(15,23,42,0.08),0_0_0_4px_rgba(99,102,241,0.08)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[23px] leading-none text-slate-500">
              ⌕
            </span>

            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentAddress("");
                setShowResults(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowResults(true);
                }
              }}
              placeholder="Tìm kiếm địa điểm hoặc địa chỉ..."
              autoComplete="off"
              className="h-[50px] min-w-0 flex-1 bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
            />

            {query && (
              <button
                type="button"
                aria-label="Xóa tìm kiếm"
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setResults([]);
                  setShowResults(false);
                  setCurrentAddress("");
                }}
              >
                ×
              </button>
            )}
          </form>

          {showResults && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
              <div className="max-h-[360px] overflow-y-auto">
                {suggestions.map((place) => (
                  <button
                    key={place.ref_id}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                    onClick={() => handleSelect(place)}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm text-indigo-600">
                      ⌖
                    </span>

                    <span className="min-w-0">
                      <strong className="block truncate text-sm font-semibold text-slate-900">
                        {place.name}
                      </strong>

                      <small className="mt-1 block text-xs leading-5 text-slate-500">
                        {formatCurrentAddress(place)}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid w-full grid-cols-2 gap-2 min-[901px]:flex min-[901px]:w-auto min-[901px]:shrink-0">
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={locationLoading}
            className="inline-flex h-[52px] min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-[15px] text-[13px] font-[650] text-slate-600 whitespace-nowrap shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[background,border-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_5px_14px_rgba(15,23,42,0.06)] disabled:cursor-wait disabled:opacity-55"
          >
            <span className="text-base">⌖</span>

            <span className="hidden min-[601px]:inline">
              {locationLoading
                ? "Đang lấy vị trí..."
                : "Địa điểm hiện tại"}
            </span>

            <span className="min-[601px]:hidden">
              {locationLoading ? "Đang lấy..." : "Vị trí"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              console.log("Saved places");
            }}
            className="inline-flex h-[52px] min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-[15px] text-[13px] font-[650] text-slate-600 whitespace-nowrap shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[background,border-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_5px_14px_rgba(15,23,42,0.06)] disabled:cursor-wait disabled:opacity-55"
          >
            <span className="text-base">♡</span>

            <span className="hidden sm:inline">
              Địa chỉ đã lưu
            </span>

            <span className="sm:hidden">Đã lưu</span>
          </button>
        </div>
      </div>

      {/* CURRENT LOCATION */}
      {currentAddress && (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3.5">
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white text-base text-indigo-500">
            📍
          </span>

          <div className="min-w-0">
            <small className="block text-[10px] font-[700] uppercase tracking-[0.08em] text-indigo-500">
              Vị trí hiện tại
            </small>

            <strong className="mt-1 block text-sm font-medium leading-6 text-slate-800">
              {currentAddress}
            </strong>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="mt-3">
        <PlaceFilters
          value={filters}
          onChange={onFiltersChange}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* RESULTS */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.18em] text-indigo-500">
              KHÁM PHÁ
            </span>

            <h2 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">
              {query.trim()
                ? "Kết quả tìm kiếm"
                : "Khám phá địa điểm"}
            </h2>
          </div>

          {!loading && results.length > 0 && (
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {results.length} kết quả
            </span>
          )}
        </div>

        <div className="p-3 sm:p-4">
          {loading ? (
            <PlaceListSkeleton />
          ) : results.length > 0 ? (
            <PlaceList
              places={results}
              onSelect={handleSelect}
            />
          ) : query.trim().length >= 2 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                ⌕
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Không tìm thấy địa điểm
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Thử tìm bằng tên địa điểm, tên đường hoặc địa chỉ
                khác nhé.
              </p>

              {(filters.cityId ||
                filters.wardId ||
                filters.category) && (
                <button
                  type="button"
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  onClick={() =>
                    onFiltersChange({
                      cityId: "",
                      wardId: "",
                      category: "",
                    })
                  }
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-lg text-indigo-500">
                ⌖
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Bắt đầu khám phá
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Tìm kiếm địa điểm, địa chỉ hoặc chọn khu vực để khám
                phá những nơi xung quanh.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatCurrentAddress(place: Suggestion) {
  if (!place) {
    return "";
  }

  const boundaries = place.boundaries || [];

  const ward = boundaries.find(
    (item) => item.type === 2
  );

  const city = boundaries.find(
    (item) => item.type === 0
  );

  const adminParts = [
    ward?.full_name,
    city?.full_name,
  ].filter(Boolean);

  const name = place.name?.trim();

  if (name && adminParts.length > 0) {
    return `${name}, ${adminParts.join(", ")}`;
  }

  return (
    place.display ||
    place.address ||
    name ||
    ""
  );
}