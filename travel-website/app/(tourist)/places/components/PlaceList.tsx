"use client";

import type { Suggestion } from "./types";

type PlaceListProps = {
  places: Suggestion[];
  onSelect: (place: Suggestion) => void;
};

export default function PlaceList({
  places,
  onSelect,
}: PlaceListProps) {
  if (places.length === 0) {
    return (
      <div className="places-empty">
        <div className="places-empty-icon">⌕</div>

        <h3>Chưa có kết quả</h3>

        <p>
          Thử tìm tên địa điểm, đường hoặc địa chỉ khác nhé.
        </p>
      </div>
    );
  }

  return (
    <div className="places-list">
      {places.map((place, index) => (
        <button
          key={`${place.ref_id}-${index}`}
          type="button"
          className="places-item"
          onClick={() => onSelect(place)}
        >
          <div className="places-number">
            {index + 1}
          </div>

          <div className="places-item-content">
            <div className="places-name-row">
              <div>
                <h3 className="places-name">
                  {place.name}
                </h3>

                {place.categories &&
                  place.categories.length > 0 && (
                    <span className="places-category">
                      {place.categories[0]}
                    </span>
                  )}
              </div>

              <span className="places-arrow">
                →
              </span>
            </div>

            <p className="places-address">
              <span className="places-location-icon">
                ⌖
              </span>

              <span>
                {formatNewAddress(place)}
              </span>
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

PlaceList.Skeleton = function PlaceListSkeleton() {
  return (
    <div className="places-list">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          className="places-skeleton-item"
          key={index}
        >
          <div className="places-skeleton-number" />

          <div className="places-skeleton-content">
            <div className="places-skeleton-name" />
            <div className="places-skeleton-address" />
          </div>
        </div>
      ))}
    </div>
  );
};