"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PlaceCard from "./PlaceCard";
import PlaceCardSkeleton from "./PlaceCardSkeleton";
import type { Place } from "./types";

type Province = {
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  code: string;
};

type PlaceExplorerProps = {
  places: Place[];
  loading: boolean;
};

export default function PlaceExplorer({
  places,
  loading,
}: PlaceExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [price, setPrice] = useState("Tất cả");

  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState("");

  const provinceRef = useRef<HTMLDivElement>(null);

  // =========================
  // LOAD PROVINCES
  // =========================

  useEffect(() => {
    async function loadProvinces() {
      try {
        const response = await fetch("/vietmap/province.json");

        if (!response.ok) {
          throw new Error("Không thể tải danh sách tỉnh thành");
        }

        const data = await response.json();
        const provinceList = Object.values(data) as Province[];

        setProvinces(provinceList);
      } catch (error) {
        console.error("Load provinces error:", error);
      }
    }

    loadProvinces();
  }, []);

  // =========================
  // CLICK OUTSIDE PROVINCE
  // =========================

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        provinceRef.current &&
        !provinceRef.current.contains(event.target as Node)
      ) {
        setProvinceOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    return [
      "Tất cả",
      ...Array.from(
        new Set(
          places
            .map((place) => place.category)
            .filter(Boolean)
        )
      ),
    ];
  }, [places]);

  // =========================
  // SELECTED PROVINCE
  // =========================

  const selectedProvince = useMemo(() => {
    return provinces.find((item) => item.code === province);
  }, [provinces, province]);

  // =========================
  // FILTERED PROVINCES
  // =========================

  const filteredProvinces = useMemo(() => {
    const keyword = provinceSearch.trim().toLowerCase();

    if (!keyword) {
      return provinces;
    }

    return provinces.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.name_with_type.toLowerCase().includes(keyword)
    );
  }, [provinces, provinceSearch]);

  // =========================
  // FILTER PLACES
  // =========================

  const filteredPlaces = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesSearch =
        !keyword ||
        place.name.toLowerCase().includes(keyword) ||
        place.description.toLowerCase().includes(keyword) ||
        place.category.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "Tất cả" ||
        place.category === category;

      const matchesPrice =
        price === "Tất cả" ||
        (price === "Miễn phí" && place.price === "free") ||
        (price === "Có phí" && place.price !== "free");

      const matchesProvince =
        !province ||
        String(place.province) === String(province);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesProvince
      );
    });
  }, [places, search, category, price, province]);

  // =========================
  // ACTIVE FILTER
  // =========================

  const hasActiveFilter =
    search.trim() !== "" ||
    category !== "Tất cả" ||
    price !== "Tất cả" ||
    province !== "";

  // =========================
  // CLEAR
  // =========================

  const clearFilters = () => {
    setSearch("");
    setCategory("Tất cả");
    setPrice("Tất cả");
    setProvince("");
    setProvinceSearch("");
    setProvinceOpen(false);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <section className="mx-auto w-full max-w-[1080px] px-4 pb-16 sm:px-6 lg:px-0">
      {/* HEADER */}
      <div className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Địa điểm có trên hệ thống
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              {places.length} địa điểm
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Khám phá những địa điểm thú vị được đề xuất.
          </p>
        </div>

        {/* SEARCH + PROVINCE */}
        <div className="flex w-full flex-col gap-2 min-[900px]:w-auto min-[900px]:flex-row">
          {/* SEARCH */}
          <div className="relative w-full min-[900px]:w-[300px]">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm địa điểm..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-700"
              >
                ×
              </button>
            )}
          </div>

          {/* PROVINCE */}
          <div
            ref={provinceRef}
            className="relative w-full min-[900px]:w-[220px]"
          >
            <button
              type="button"
              onClick={() => {
                setProvinceOpen((current) => !current);
                setProvinceSearch("");
              }}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-left text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              <span className="truncate">
                {selectedProvince?.name ?? "Tất cả tỉnh thành"}
              </span>

              <span
                className={`ml-2 text-xs text-slate-400 transition-transform ${
                  provinceOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {provinceOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                {/* PROVINCE SEARCH */}
                <div className="border-b border-slate-100 p-2">
                  <input
                    type="text"
                    value={provinceSearch}
                    onChange={(event) =>
                      setProvinceSearch(event.target.value)
                    }
                    autoFocus
                    placeholder="Tìm tỉnh thành..."
                    className="h-9 w-full rounded-lg bg-slate-50 px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:bg-slate-100"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto p-1.5">
                  {/* ALL PROVINCES */}
                  <button
                    type="button"
                    onClick={() => {
                      setProvince("");
                      setProvinceOpen(false);
                      setProvinceSearch("");
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      province === ""
                        ? "bg-indigo-50 font-semibold text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>Tất cả tỉnh thành</span>

                    {province === "" && (
                      <span className="text-indigo-600">✓</span>
                    )}
                  </button>

                  {/* PROVINCE LIST */}
                  {filteredProvinces.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setProvince(item.code);
                        setProvinceOpen(false);
                        setProvinceSearch("");
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        province === item.code
                          ? "bg-indigo-50 font-semibold text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">
                        {item.name}
                      </span>

                      {province === item.code && (
                        <span className="ml-2 text-indigo-600">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}

                  {filteredProvinces.length === 0 && (
                    <div className="px-3 py-6 text-center text-xs text-slate-400">
                      Không tìm thấy tỉnh thành
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
        <div className="flex flex-col gap-3 min-[760px]:flex-row min-[760px]:items-center">
          {/* CATEGORIES */}
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto scrollbar-none">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  category === item
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* PRICE */}
          <div className="flex shrink-0 items-center gap-1 self-start rounded-full bg-slate-100 p-1 min-[760px]:self-auto">
            {["Tất cả", "Miễn phí", "Có phí"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPrice(item)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  price === item
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULT INFO */}
      <div className="mt-5 flex items-center justify-between gap-3">
        {!loading && (
          <>
            <p className="text-sm text-slate-500">
              Tìm thấy{" "}
              <span className="font-semibold text-slate-800">
                {filteredPlaces.length}
              </span>{" "}
              địa điểm

              {selectedProvince && (
                <>
                  {" "}tại{" "}
                  <span className="font-semibold text-slate-800">
                    {selectedProvince.name}
                  </span>
                </>
              )}
            </p>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Xóa bộ lọc
              </button>
            )}
          </>
        )}
      </div>

      {/* CARDS / SKELETON */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <PlaceCardSkeleton key={index} />
          ))
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))
        ) : (
          <div className="col-span-full flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                ⌕
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Không tìm thấy địa điểm
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Thử thay đổi từ khóa hoặc bộ lọc nhé.
              </p>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}