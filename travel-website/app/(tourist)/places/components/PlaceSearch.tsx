"use client";

import { useEffect, useRef, useState } from "react";

import type { Suggestion } from "./types";

export default function PlaceSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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
  }, [query, focus]);

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
                  setShowResults(false);
                  setCurrentAddress("");
                }}
              >
                ×
              </button>
            )}
          </form>

          {/* AUTOCOMPLETE */}
          {showResults && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
              <div className="max-h-[420px] overflow-y-auto py-1.5">
                {suggestions.map((place) => (
                  <button
                    key={place.ref_id}
                    type="button"
                    onClick={() => handleSelect(place)}
                    className="group flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base text-indigo-600">
                      ⌖
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold leading-5 text-slate-900">
                        {place.name || place.display}
                      </span>

                      <span className="mt-1 block line-clamp-2 text-[12px] leading-5 text-slate-500">
                        {formatCurrentAddress(place)}
                      </span>

                      {place.categories &&
                        place.categories.length > 0 && (
                          <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {place.categories[0]}
                          </span>
                        )}
                    </span>

                    <span className="mt-2 shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-400 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                      <span className="min-[601px]:hidden">
                        +
                      </span>

                      <span className="hidden min-[601px]:inline">
                        + Thêm
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LOADING */}
          {showResults &&
            loading &&
            query.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
                  Đang tìm kiếm...
                </div>
              </div>
            )}

          {/* NO RESULTS */}
          {showResults &&
            !loading &&
            query.trim().length >= 2 &&
            suggestions.length === 0 &&
            !error && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                <div className="text-sm text-slate-500">
                  Không tìm thấy địa điểm.
                </div>
              </div>
            )}
        </div>

        {/* ACTIONS */}
        <div className="grid w-full grid-cols-2 gap-2 min-[901px]:flex min-[901px]:w-auto min-[901px]:shrink-0">
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={locationLoading}
            className="inline-flex h-[52px] min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-[15px] text-[13px] font-[650] whitespace-nowrap text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[background,border-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_5px_14px_rgba(15,23,42,0.06)] disabled:cursor-wait disabled:opacity-55"
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
            className="inline-flex h-[52px] min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-[15px] text-[13px] font-[650] whitespace-nowrap text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[background,border-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_5px_14px_rgba(15,23,42,0.06)] disabled:cursor-wait disabled:opacity-55"
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

      {/* ERROR */}
      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
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