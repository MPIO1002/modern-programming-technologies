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
    <main className="places-page">
      <section className="places-hero">
        <div className="places-hero-inner">
          <span className="places-eyebrow">KHÁM PHÁ VIỆT NAM</span>

          <h1 className="places-title">
            Tìm một nơi
            <br />
            <span>bạn muốn đến</span>
          </h1>

          <p className="places-description">
            Tìm kiếm địa điểm, đường phố, nhà hàng và những nơi thú vị xung
            quanh bạn.
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