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
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);

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
      className={`
        relative min-w-0
        min-[901px]:flex-1
        ${disabled ? "opacity-50" : ""}
      `}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="
          flex min-h-[46px] w-full
          items-center justify-between
          gap-[10px]
          rounded-[11px]
          border border-slate-200
          bg-white
          px-[13px]
          text-left
          text-[13px]
          font-[550]
          text-slate-700
          outline-none
          transition-[background,border-color,box-shadow]
          duration-150
          hover:border-slate-300
          hover:bg-slate-50
          focus-visible:border-indigo-400
          focus-visible:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]
          disabled:cursor-not-allowed
        "
      >
        <span
          className={`
            min-w-0 flex-1 truncate
            ${
              selected
                ? "font-semibold text-slate-700"
                : "font-normal text-slate-400"
            }
          `}
        >
          {selected?.name_with_type || placeholder}
        </span>

        <span
          className={`
            flex h-[22px] w-[22px]
            shrink-0
            items-center justify-center
            text-[13px]
            text-slate-400
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        >
          ↓
        </span>
      </button>

      {open && !disabled && (
        <div
          className="
            absolute
            left-0 right-0
            top-[calc(100%+8px)]
            z-[300]
            min-w-[240px]
            overflow-hidden
            rounded-[14px]
            border border-slate-200
            bg-white
            shadow-[0_18px_45px_rgba(15,23,42,0.13),0_4px_12px_rgba(15,23,42,0.05)]
          "
        >
          <div
            className="
              mx-2 mt-2
              flex h-[38px]
              items-center
              gap-2
              rounded-[9px]
              border border-slate-200
              bg-slate-50
              px-[10px]
            "
          >
            <span className="text-[15px] text-slate-400">
              ⌕
            </span>

            <input
              autoFocus
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
              placeholder="Tìm kiếm..."
              className="
                h-full min-w-0 flex-1
                border-0
                bg-transparent
                p-0
                text-[13px]
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />
          </div>

          <div className="max-h-[270px] overflow-y-auto px-[7px] pb-[7px] pt-[3px]">
            {filteredOptions.length === 0 ? (
              <div className="px-[10px] py-[18px] text-center text-[13px] text-slate-400">
                Không tìm thấy
              </div>
            ) : (
              filteredOptions.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onChange(item.code);
                    setKeyword("");
                    setOpen(false);
                  }}
                  className={`
                    block w-full
                    rounded-[8px]
                    border-0
                    px-[10px]
                    py-[10px]
                    text-left
                    text-[13px]
                    transition-colors
                    ${
                      item.code === value
                        ? "bg-indigo-50 font-[650] text-indigo-600"
                        : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
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
  const [provinces, setProvinces] = useState<AdminOption[]>([]);
  const [wards, setWards] = useState<AdminOption[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

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
              a.name.localeCompare(b.name)
            );

        const wardList: AdminOption[] =
          Object.entries(wardData)
            .map(([code, data]) => ({
              code,
              ...data,
            }))
            .sort((a, b) =>
              a.name.localeCompare(b.name)
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

  function handleProvinceChange(cityId: string) {
    onChange({
      cityId,
      wardId: "",
      category: value.category,
    });
  }

  function handleWardChange(wardId: string) {
    onChange({
      ...value,
      wardId,
    });
  }

  function handleCategoryChange(category: string) {
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

  const hasActiveFilters = Boolean(
    value.cityId ||
      value.wardId ||
      value.category
  );

  const categoryOptions: AdminOption[] =
    CATEGORY_OPTIONS.map((item) => ({
      code: item.value,
      name: item.label,
      name_with_type: item.label,
      slug: item.value,
      type: "category",
    }));

  if (loadingAdmin) {
    return (
      <div
        className="
          grid grid-cols-2
          gap-[10px]
          min-[901px]:flex
          max-[600px]:gap-2
          max-[420px]:grid-cols-1
        "
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
              min-h-[46px]
              flex-1
              rounded-[11px]
              bg-[linear-gradient(90deg,#f1f5f9_25%,#e2e8f0_50%,#f1f5f9_75%)]
              [background-size:200%_100%]
              animate-places-filter-shimmer
            "
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-2
        gap-[10px]
        min-[901px]:flex
        max-[600px]:gap-2
        max-[420px]:grid-cols-1
      "
    >
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
        options={categoryOptions}
        onChange={handleCategoryChange}
      />

      <button
        type="button"
        disabled={!hasActiveFilters}
        onClick={resetFilters}
        className="
          inline-flex
          min-h-[46px]
          w-full
          items-center
          justify-center
          gap-[7px]
          rounded-[11px]
          border border-slate-200
          bg-white
          px-[15px]
          text-[13px]
          font-[650]
          text-slate-500
          transition-[background,border-color,transform]
          duration-150
          hover:border-slate-300
          hover:bg-slate-50
          hover:text-slate-700
          hover:-translate-y-px
          disabled:cursor-not-allowed
          disabled:opacity-[0.45]
          min-[901px]:w-auto
          min-[901px]:shrink-0
        "
      >
        <span className="text-[17px] leading-none">
          ↺
        </span>

        Đặt lại
      </button>
    </div>
  );
}
