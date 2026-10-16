import Link from 'next/link';

export default function ExplorePlacesButton() {
  return (
    <Link
      href="/places"
      className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-[#0F4C75] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0F4C75]/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#3282B8] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3282B8]/40"
    >
      <span>Khám phá địa điểm</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
