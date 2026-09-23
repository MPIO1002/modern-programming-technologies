"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import PlaceFilters from "./PlaceFilters";
import PlaceList from "./PlaceList";

import type {
  PlaceFiltersValue,
  Suggestion,
} from "./types";

type PlaceSearchProps = {
  filters: PlaceFiltersValue;
  onFiltersChange: (
    value: PlaceFiltersValue
  ) => void;
};

export default function PlaceSearch({
  filters,
  onFiltersChange,
}: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Suggestion[]
  >([]);

  const [results, setResults] = useState<
    Suggestion[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [showResults, setShowResults] =
    useState(false);

  const [currentAddress, setCurrentAddress] =
    useState("");

  const [focus, setFocus] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
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

    const timeout = window.setTimeout(
      async () => {
        try {
          setLoading(true);
          setError("");

          const params = new URLSearchParams();

          params.set("text", trimmedQuery);

          if (focus) {
            params.set("focus", focus);
          }

          if (filters.cityId) {
            params.set(
              "cityId",
              filters.cityId
            );
          }

          if (filters.wardId) {
            params.set(
              "wardId",
              filters.wardId
            );
          }

          if (filters.category) {
            params.set(
              "cats",
              filters.category
            );
          }

          const response = await fetch(
            `/api/vietmap/autocomplete?${params.toString()}`,
            {
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            throw new Error(
              "Không thể tìm kiếm địa điểm"
            );
          }

          const data = await response.json();

          const places = Array.isArray(data)
            ? data
            : [];

          // QUAN TRỌNG:
          // list chính = toàn bộ kết quả API trả về
          setResults(places);

          // dropdown suggestion dùng cùng data,
          // không tạo API flow thứ hai
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

          setError(
            "Có lỗi khi tìm kiếm. Thử lại nhé."
          );

          setSuggestions([]);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      },
      300
    );

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

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return;
    }

    // Enter = đóng autocomplete.
    // Không chọn suggestion đầu tiên.
    setShowResults(false);
  }

  function handleSelect(place: Suggestion) {
    setQuery(place.name || place.display);

    setSuggestions([]);

    // Không setResults([place])!
    // Giữ nguyên toàn bộ kết quả search.
    setShowResults(false);
  }

  async function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError(
        "Trình duyệt không hỗ trợ định vị."
      );
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } =
          position.coords;

        const nextFocus =
          `${latitude},${longitude}`;

        setFocus(nextFocus);

        try {
          const response = await fetch(
            `/api/vietmap/reverse?lat=${latitude}&lng=${longitude}`
          );

          if (!response.ok) {
            throw new Error(
              "Không thể lấy địa chỉ hiện tại"
            );
          }

          const data = await response.json();

          const place = Array.isArray(data)
            ? data[0]
            : data;

          if (!place) {
            throw new Error(
              "Không tìm thấy địa chỉ hiện tại"
            );
          }

          const address = formatCurrentAddress(
            place
          );

          setCurrentAddress(address);

          // Địa chỉ thật được đưa vào thanh search
          setQuery(address);

          // Đóng suggestion cũ
          setSuggestions([]);
          setShowResults(false);
        } catch (error) {
          console.error(error);

          setError(
            "Không lấy được địa chỉ hiện tại."
          );
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
          setError(
            "Không lấy được vị trí hiện tại."
          );
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
  <section className="places-explorer">
    {/* SEARCH + ACTIONS */}
    <div
      ref={searchRef}
      className="places-search-row"
    >
      <div className="places-search-wrapper">
        <form
          className="places-search"
          onSubmit={handleSubmit}
        >
          <span className="places-search-icon">
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
          />

          {query && (
            <button
              type="button"
              className="places-search-clear"
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

        {showResults &&
          suggestions.length > 0 && (
            <div className="places-search-suggestions">
              {suggestions.map((place) => (
                <button
                  key={place.ref_id}
                  type="button"
                  className="places-suggestion"
                  onClick={() =>
                    handleSelect(place)
                  }
                >
                  <span className="places-suggestion-icon">
                    ⌖
                  </span>

                  <span>
                    <strong>
                      {place.name}
                    </strong>

                    <small>
                      {formatCurrentAddress(place)}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}
      </div>

      <div className="places-search-actions">
        <button
          type="button"
          className="places-action-button"
          onClick={handleCurrentLocation}
          disabled={locationLoading}
        >
          <span>⌖</span>

          {locationLoading
            ? "Đang lấy vị trí..."
            : "Địa điểm hiện tại"}
        </button>

        <button
          type="button"
          className="places-action-button"
          onClick={() => {
            console.log("Saved places");
          }}
        >
          <span>♡</span>

          Địa chỉ đã lưu
        </button>
      </div>
    </div>

    {/* CURRENT LOCATION */}
    {currentAddress && (
      <div className="places-current-location">
        <span>📍</span>

        <div>
          <small>Vị trí hiện tại</small>
          <strong>{currentAddress}</strong>
        </div>
      </div>
    )}

    {/* FILTERS */}
    <PlaceFilters
      value={filters}
      onChange={onFiltersChange}
    />

    {error && (
      <div className="places-error">
        {error}
      </div>
    )}

    {/* RESULTS */}
    <div className="places-results">
      <div className="places-results-header">
        <div>
          <span className="places-results-eyebrow">
            KHÁM PHÁ
          </span>

          <h2>
            {query.trim()
              ? "Kết quả tìm kiếm"
              : "Khám phá địa điểm"}
          </h2>
        </div>

        {!loading &&
          results.length > 0 && (
            <span className="places-results-count">
              {results.length} kết quả
            </span>
          )}
      </div>

      <div className="places-results-content">
        {loading ? (
          <PlaceList.Skeleton />
        ) : results.length > 0 ? (
          <PlaceList
            places={results}
            onSelect={handleSelect}
          />
        ) : query.trim().length >= 2 ? (
          <div className="places-empty">
            <div className="places-empty-icon">
              ⌕
            </div>

            <h3>
              Không tìm thấy địa điểm
            </h3>

            <p>
              Thử tìm bằng tên địa điểm, tên đường
              hoặc địa chỉ khác nhé.
            </p>

            {(filters.cityId ||
              filters.wardId ||
              filters.category) && (
              <button
                type="button"
                className="places-empty-reset"
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
          <div className="places-empty places-empty-default">
            <div className="places-empty-icon">
              ⌖
            </div>

            <h3>
              Bắt đầu khám phá
            </h3>

            <p>
              Tìm kiếm địa điểm, địa chỉ hoặc chọn
              khu vực để khám phá những nơi xung quanh.
            </p>
          </div>
        )}
      </div>
    </div>
  </section>
  );
}

function formatCurrentAddress(
  place: Suggestion
) {
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