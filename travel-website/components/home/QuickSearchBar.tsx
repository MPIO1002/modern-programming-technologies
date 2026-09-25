'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/places?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto p-2.5 bg-[#0F4C75]/85 backdrop-blur-md rounded-2xl border border-[#3282B8]/40 shadow-2xl"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm địa điểm, di tích lịch sử, ẩm thực..."
          className="w-full px-5 py-3.5 rounded-xl bg-[#1B262C]/90 text-[#BBE1FA] placeholder-[#BBE1FA]/60 border border-transparent focus:border-[#3282B8] focus:outline-none text-sm transition"
        />
      </div>
      <button
        type="submit"
        className="px-8 py-3.5 bg-[#3282B8] hover:bg-[#0F4C75] text-white font-semibold rounded-xl transition duration-200 shadow-md text-sm cursor-pointer whitespace-nowrap border border-[#BBE1FA]/20"
      >
        Khám phá
      </button>
    </form>
  );
}