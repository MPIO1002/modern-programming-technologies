import Link from "next/link";

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
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-[#3282B8]/30 bg-white dark:bg-[#0F4C75]/40 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex flex-col h-full">
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
          <p className="mt-3 text-xs font-medium text-slate-400 dark:text-[#3282B8] transition-colors">
            Thời gian: {place.openTime}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-[#3282B8]/20 transition-colors">
          <Link
            href={`/places/${place.slug || place.id}`}
            className="text-xs font-bold text-indigo-600 dark:text-[#BBE1FA] bg-indigo-50 dark:bg-[#0F4C75] hover:bg-indigo-100 dark:hover:bg-[#3282B8] px-4 py-2 rounded-lg transition-colors w-full text-center"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}