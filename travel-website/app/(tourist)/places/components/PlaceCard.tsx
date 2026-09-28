"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Place = {
  id: string | number;
  slug?: string;
  name: string;
  description: string;
  category: string;
  price: "free" | string;
  thumbnail?: string;
  openTime?: string;
};

type PlaceCardProps = {
  place: Place;
};

export default function PlaceCard({ place }: PlaceCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const checkAdded = () => {
      const savedList: number[] = JSON.parse(localStorage.getItem("my_list") || "[]");
      setIsAdded(savedList.includes(Number(place.id)));
    };
    checkAdded();
    window.addEventListener("itinerary_updated", checkAdded);
    return () => window.removeEventListener("itinerary_updated", checkAdded);
  }, [place.id]);

  const handleToggleItinerary = (e: React.MouseEvent) => {
    e.preventDefault();
    const savedList: number[] = JSON.parse(localStorage.getItem("my_list") || "[]");
    const placeId = Number(place.id);
    let newList;
    if (savedList.includes(placeId)) {
      newList = savedList.filter(id => id !== placeId);
    } else {
      newList = [...savedList, placeId];
    }
    localStorage.setItem("my_list", JSON.stringify(newList));
    window.dispatchEvent(new Event("itinerary_updated"));
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-[#3282B8]/30 bg-white dark:bg-[#0F4C75]/40 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex flex-col h-full relative">
      
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#1B262C]">
        {place.thumbnail ? (
          <img
            src={place.thumbnail}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Chưa có hình ảnh
          </div>
        )}

        {/* CATEGORY */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 dark:bg-[#1B262C]/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-[#BBE1FA] shadow-sm backdrop-blur transition-colors">
          {place.category}
        </span>

        {/* PRICE */}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 dark:bg-[#1B262C]/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-amber-300 shadow-sm backdrop-blur transition-colors">
          {place.price === "free" ? "Miễn phí" : "Có phí"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#BBE1FA] transition-colors">
          {place.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-300 transition-colors">
          {place.description}
        </p>

        {place.openTime && (
          <p className="mt-3 mb-4 text-xs font-medium text-slate-400 dark:text-[#3282B8] transition-colors">
            Thời gian: {place.openTime}
          </p>
        )}

        {/* ACTION BUTTONS (STACKED) */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-[#3282B8]/20 transition-colors">
          <Link
            href={`/places/${place.slug || place.id}`}
            className="w-full text-xs font-bold text-indigo-600 dark:text-[#BBE1FA] bg-indigo-50 dark:bg-[#0F4C75] hover:bg-indigo-100 dark:hover:bg-[#3282B8] px-3 py-2.5 rounded-xl transition-colors text-center"
          >
            Chi tiết
          </Link>
          
          <button
            onClick={handleToggleItinerary}
            className={`w-full text-xs font-bold px-3 py-2.5 rounded-xl transition-colors text-center border shadow-sm ${
              isAdded 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                : 'bg-[#0F4C75] text-white border-transparent hover:bg-[#3282B8]'
            }`}
          >
            {isAdded ? "✓ Đã thêm vào lộ trình" : "+ Thêm vào lộ trình"}
          </button>
        </div>
      </div>
    </article>
  );
}