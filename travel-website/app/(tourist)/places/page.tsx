"use client";

import { useEffect, useState } from "react";
import PlaceSearch from "./components/PlaceSearch";
import PlaceExplorer from "./components/PlaceExplorer";
import type { Place } from "./components/types";

const API_URL =
  "https://6ab765359b03155d080883c1.mockapi.io/places";

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Không thể lấy dữ liệu địa điểm");
        }

        const data: Place[] = await res.json();

        setPlaces(data);
      } catch (error) {
        console.error(error);
        setError("Không thể tải danh sách địa điểm.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  return (
    <main
      className="
        min-h-screen overflow-hidden
        bg-[#f8fafc]
        pb-[100px]
        pt-[72px]
        text-slate-900
        font-sans
        [background:radial-gradient(circle_at_50%_-10%,rgba(99,102,241,0.12),transparent_35%),#f8fafc]
        max-[600px]:pb-[70px]
        max-[600px]:pt-12
      "
    >
      {/* HERO + VIETMAP SEARCH */}
      <section className="w-full px-6 max-[600px]:px-4">
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
            Tìm một nơi
            <br />
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

          {/* VIETMAP SEARCH */}
          <PlaceSearch />
        </div>
      </section>

      {/* PLACE SYSTEM */}
      <div className="mt-20 max-[600px]:mt-14">
        {error ? (
          <section className="mx-auto w-full max-w-[1080px] px-4 sm:px-6 lg:px-0">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          </section>
        ) : (
          <PlaceExplorer
            places={places}
            loading={loading}
          />
        )}
      </div>
    </main>
  );
}