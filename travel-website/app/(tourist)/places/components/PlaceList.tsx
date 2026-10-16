"use client";

import type { Suggestion } from "./types";

type PlaceListProps = {
  places: Suggestion[];
  onSelect: (place: Suggestion) => void;
};

export function PlaceListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
        >
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-200" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default function PlaceList({
  places,
  onSelect,
}: PlaceListProps) {
  if (places.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
          ⌕
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Chưa có kết quả
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Thử tìm tên địa điểm, đường hoặc địa chỉ khác nhé.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {places.map((place, index) => (
        <button
          key={`${place.ref_id}-${index}`}
          type="button"
          onClick={() => onSelect(place)}
          className="group flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50/40 hover:shadow-sm"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500 transition group-hover:bg-indigo-100 group-hover:text-indigo-700">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
                  {place.name}
                </h3>

                {place.categories &&
                  place.categories.length > 0 && (
                    <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                      {place.categories[0]}
                    </span>
                  )}
              </div>

              <span className="shrink-0 text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                →
              </span>
            </div>

            <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500 sm:text-sm">
              <span className="mt-0.5 shrink-0 text-slate-400">
                ⌖
              </span>

              <span>{formatNewAddress(place)}</span>
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

function formatNewAddress(place: Suggestion) {
  if (!place.boundaries?.length) {
    return place.display || place.address;
  }

  const ward = place.boundaries.find(
    (item) => item.type === 2
  );

  const city = place.boundaries.find(
    (item) => item.type === 0
  );

  const parts = [
    ward?.full_name,
    city?.full_name,
  ].filter(Boolean);

  if (parts.length === 0) {
    return place.display || place.address;
  }

  const base = place.name?.trim();

  return base
    ? `${base}, ${parts.join(", ")}`
    : parts.join(", ");
}