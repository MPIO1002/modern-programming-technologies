"use client";

import { useState } from "react";
import PlaceSearch from "./components/PlaceSearch";
import type { PlaceFiltersValue } from "./components/types";

export default function PlacesPage() {
  const [filters, setFilters] = useState<PlaceFiltersValue>({
    cityId: "",
    wardId: "",
    category: "",
  });

  return (
    <main
      className="
        min-h-screen overflow-hidden
        bg-[#f8fafc]
        px-6 pb-[100px] pt-[72px]
        text-slate-900
        font-sans
        [background:radial-gradient(circle_at_50%_-10%,rgba(99,102,241,0.12),transparent_35%),#f8fafc]
        max-[600px]:px-4
        max-[600px]:pb-[70px]
        max-[600px]:pt-12
      "
    >
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1080px]">
          <span
            className="
              mb-[18px] block
              text-[12px] font-[750]
              tracking-[0.12em]
              text-indigo-500
            "
          >
            KHÁM PHÁ VIỆT NAM
          </span>

          <h1
            className="
              m-0
              text-[clamp(42px,6vw,68px)]
              font-[750]
              leading-[1.02]
              tracking-[-0.055em]
              text-slate-900
              max-[600px]:text-[clamp(38px,12vw,52px)]
            "
          >
            Tìm một nơi<br />
            <span className="text-slate-500">
              bạn muốn đến
            </span>
          </h1>

          <p
            className="
              mt-6
              max-w-[620px]
              text-[17px]
              font-normal
              leading-[1.7]
              text-slate-500
              max-[600px]:text-[15px]
            "
          >
            Tìm kiếm địa điểm, đường phố, nhà hàng và những nơi thú vị
            xung quanh bạn.
          </p>

          <PlaceSearch
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </section>
    </main>
  );
}
