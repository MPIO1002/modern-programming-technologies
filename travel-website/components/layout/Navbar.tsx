"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#3282B8]/30 bg-white/80 dark:bg-[#1B262C]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[#0F4C75] dark:text-[#BBE1FA] font-bold text-xl hover:opacity-80 transition">
          <FontAwesomeIcon icon={faMapLocationDot} className="w-6 h-6" />
          <span>Vietmap Travel</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/places" 
            className={`text-sm font-semibold transition ${pathname.startsWith('/places') ? 'text-[#0F4C75] dark:text-[#BBE1FA]' : 'text-slate-600 dark:text-slate-300 hover:text-[#0F4C75] dark:hover:text-[#BBE1FA]'}`}
          >
            Khám phá
          </Link>
          <Link 
            href="/map" 
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0F4C75] dark:hover:text-[#BBE1FA] transition"
          >
            Bản đồ
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
