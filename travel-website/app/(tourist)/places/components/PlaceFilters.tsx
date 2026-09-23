"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AdminOption,
  PlaceFiltersValue,
} from "./types";

type PlaceFiltersProps = {
  value: PlaceFiltersValue;
  onChange: (value: PlaceFiltersValue) => void;
};

type ComboBoxProps = {
  value: string;
  placeholder: string;
  options: AdminOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

type CategoryOption = {
  value: string;
  label: string;
};

/*
 * Vietmap POI category codes.
 *
 * Không chọn category = vẫn search toàn bộ:
 * POI + ADDRESS + STREET + CITY + WARD...
 *
 * Các mã dưới đây dùng cho filter POI.
 * Vietmap sử dụng tham số `cats` để lọc POI.
 */
const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: "",
    label: "Tất cả loại địa điểm",
  },
  {
    value: "1002-1",
    label: "Nhà hàng",
  },
  {
    value: "1002-2",
    label: "Quán cà phê",
  },
  {
    value: "1002-3",
    label: "Quán ăn",
  },
  {
    value: "1002-4",
    label: "Khách sạn",
  },
  {
    value: "1002-5",
    label: "Mua sắm",
  },
  {
    value: "1002-6",
    label: "Du lịch",
  },
  {
    value: "1002-7",
    label: "Giải trí",
  },
];

function AdminComboBox({
  value,
  placeholder,
  options,
  disabled = false,
  onChange,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(
    (item) => item.code === value
  );

  const filteredOptions = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) {
      return options;
    }

    return options.filter((item) =>
      `${item.name} ${item.name_with_type} ${item.slug}`
        .toLowerCase()
        .includes(q)
    );
  }, [keyword, options]);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`places-combobox ${
        disabled
          ? "places-combobox-disabled"
          : ""
      }`}
    >
      <button
        type="button"
        className="places-combobox-trigger"
        disabled={disabled}
        onClick={() =>
          setOpen((current) => !current)
        }
      >
        <span
          className={
            selected
              ? "places-combobox-value"
              : "places-combobox-placeholder"
          }
        >
          {selected?.name_with_type ||
            placeholder}
        </span>

        <span
          className={`places-combobox-chevron ${
            open
              ? "places-combobox-chevron-open"
              : ""
          }`}
        >
          ↓
        </span>
      </button>

      {open && !disabled && (
        <div className="places-combobox-menu">
          <div className="places-combobox-search">
            <span>⌕</span>

            <input
              autoFocus
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="places-combobox-options">
            {filteredOptions.length === 0 ? (
              <div className="places-combobox-empty">
                Không tìm thấy
              </div>
            ) : (
              filteredOptions.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`places-combobox-option ${
                    item.code === value
                      ? "places-combobox-option-active"
                      : ""
                  }`}
                  onClick={() => {
                    onChange(item.code);
                    setKeyword("");
                    setOpen(false);
                  }}
                >
                  {item.name_with_type}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlaceFilters({
  value,
  onChange,
}: PlaceFiltersProps) {
  const [provinces, setProvinces] =
    useState<AdminOption[]>([]);

  const [wards, setWards] =
    useState<AdminOption[]>([]);

  const [loadingAdmin, setLoadingAdmin] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAdminData() {
      try {
        setLoadingAdmin(true);

        const [
          provinceResponse,
          wardResponse,
        ] = await Promise.all([
          fetch("/vietmap/province.json"),
          fetch("/vietmap/ward.json"),
        ]);

        if (
          !provinceResponse.ok ||
          !wardResponse.ok
        ) {
          throw new Error(
            "Không thể tải dữ liệu hành chính"
          );
        }

        const provinceData =
          (await provinceResponse.json()) as Record<
            string,
            Omit<AdminOption, "code">
          >;

        const wardData =
          (await wardResponse.json()) as Record<
            string,
            Omit<AdminOption, "code">
          >;

        if (cancelled) {
          return;
        }

        const provinceList: AdminOption[] =
          Object.entries(provinceData)
            .map(([code, data]) => ({
              code,
              ...data,
            }))
            .sort((a, b) =>
              a.name.localeCompare(
                b.name,
                "vi"
              )
            );

        const wardList: AdminOption[] =
          Object.entries(wardData)
            .map(([code, data]) => ({
              code,
              ...data,
            }))
            .sort((a, b) =>
              a.name.localeCompare(
                b.name,
                "vi"
              )
            );

        setProvinces(provinceList);
        setWards(wardList);
      } catch (error) {
        console.error(
          "Administrative data error:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingAdmin(false);
        }
      }
    }

    loadAdminData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredWards = useMemo(() => {
    if (!value.cityId) {
      return [];
    }

    return wards.filter(
      (ward) =>
        ward.parent_code === value.cityId
    );
  }, [wards, value.cityId]);

  function handleProvinceChange(
    cityId: string
  ) {
    onChange({
      cityId,
      wardId: "",
      category: value.category,
    });
  }

  function handleWardChange(
    wardId: string
  ) {
    onChange({
      ...value,
      wardId,
    });
  }

  function handleCategoryChange(
    category: string
  ) {
    onChange({
      ...value,
      category,
    });
  }

  function resetFilters() {
    onChange({
      cityId: "",
      wardId: "",
      category: "",
    });
  }

  const hasActiveFilters =
    Boolean(
      value.cityId ||
        value.wardId ||
        value.category
    );

  if (loadingAdmin) {
    return (
      <div className="places-filters">
        <div className="places-filter-skeleton" />
        <div className="places-filter-skeleton" />
        <div className="places-filter-skeleton" />
        <div className="places-filter-skeleton places-filter-reset-skeleton" />
      </div>
    );
  }

  return (
    <div className="places-filters">
      <AdminComboBox
        value={value.cityId}
        options={provinces}
        placeholder="Tỉnh / Thành phố"
        onChange={handleProvinceChange}
      />

      <AdminComboBox
        value={value.wardId}
        options={filteredWards}
        disabled={!value.cityId}
        placeholder={
          value.cityId
            ? "Phường / Xã"
            : "Chọn tỉnh trước"
        }
        onChange={handleWardChange}
      />

      <AdminComboBox
        value={value.category}
        placeholder="Tất cả loại địa điểm"
        options={CATEGORY_OPTIONS.map(
          (item) => ({
            code: item.value,
            name: item.label,
            name_with_type: item.label,
            slug: item.value,
            type: "category",
          })
        )}
        onChange={handleCategoryChange}
      />

      <button
        type="button"
        className={`places-filter-reset ${
          !hasActiveFilters
            ? "places-filter-reset-disabled"
            : ""
        }`}
        disabled={!hasActiveFilters}
        onClick={resetFilters}
      >
        <span>↺</span>
        Đặt lại
      </button>
    </div>
  );
}