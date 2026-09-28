"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#3282B8]/30 bg-white/80 dark:bg-[#1B262C]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center gap-10 sm:gap-20">
        <Link 
          href="/places" 
          className={`text-sm font-bold tracking-wide transition ${pathname.startsWith('/places') ? 'text-[#0F4C75] dark:text-[#BBE1FA]' : 'text-slate-500 dark:text-slate-400 hover:text-[#0F4C75] dark:hover:text-[#BBE1FA]'}`}
        >
          KHÁM PHÁ
        </Link>

        <Link href="/" className="flex items-center gap-2 text-[#0F4C75] dark:text-[#BBE1FA] font-bold text-xl hover:opacity-80 transition z-10">
          <FontAwesomeIcon icon={faMapLocationDot} className="w-6 h-6" />
          <span className="hidden sm:inline">Vietmap Travel</span>
        </Link>
        
        <Link 
          href="/map" 
          className={`text-sm font-bold tracking-wide transition ${pathname === '/map' ? 'text-[#0F4C75] dark:text-[#BBE1FA]' : 'text-slate-500 dark:text-slate-400 hover:text-[#0F4C75] dark:hover:text-[#BBE1FA]'}`}
        >
          BẢN ĐỒ
        </Link>
      </div>
    </nav>
  );
}
