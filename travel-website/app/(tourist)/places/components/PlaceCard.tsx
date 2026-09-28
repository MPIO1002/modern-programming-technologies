import Link from "next/link";

type Place = {
  id: string | number;
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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {place.thumbnail ? (
          <img
            src={place.thumbnail}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Chưa có hình ảnh
          </div>
        )}

        {/* CATEGORY */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
          {place.category}
        </span>

        {/* PRICE */}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
          {place.price === "free" ? "Miễn phí" : "Có phí"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-slate-900">
          {place.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
          {place.description}
        </p>

        {place.openTime && (
          <p className="mt-3 text-xs font-medium text-slate-400">
            Thời gian: {place.openTime}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-slate-500">
            {place.category}
          </span>

          <Link
            href={`/places/${place.id}`}
            className="text-xs font-bold text-indigo-600 transition hover:text-indigo-800"
          >
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </article>
  );
}