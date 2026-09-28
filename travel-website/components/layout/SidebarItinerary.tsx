"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faMap, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname } from "next/navigation";

export default function SidebarItinerary() {
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const loadSavedPlaces = async () => {
    try {
      const savedList: number[] = JSON.parse(localStorage.getItem("my_list") || "[]");
      if (savedList.length > 0) {
        const res = await fetch("/api/places");
        if (res.ok) {
          const data = await res.json();
          const routePlaces = data.filter((p: any) => savedList.includes(Number(p.id)));
          setSavedPlaces(routePlaces);
        }
      } else {
        setSavedPlaces([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải lộ trình đã lưu:", err);
    }
  };

  useEffect(() => {
    loadSavedPlaces();
    
    const handleStorageChange = () => {
      loadSavedPlaces();
      setIsSidebarOpen(true);
    };

    window.addEventListener("itinerary_updated", handleStorageChange);
    return () => {
      window.removeEventListener("itinerary_updated", handleStorageChange);
    };
  }, []);

  const handleCreateRoute = () => {
    if (savedPlaces.length > 0) {
      router.push("/map");
    }
  };

  const handleRemoveSavedPlace = (id: string | number) => {
    const updated = savedPlaces.filter(p => p.id.toString() !== id.toString());
    setSavedPlaces(updated);
    const savedList: number[] = JSON.parse(localStorage.getItem("my_list") || "[]");
    localStorage.setItem("my_list", JSON.stringify(savedList.filter(item => item.toString() !== id.toString())));
    window.dispatchEvent(new Event("itinerary_updated"));
  };

  if (pathname === '/map') return null;

  return (
    <div 
      className={`fixed top-16 bottom-0 right-0 z-[1000] bg-white dark:bg-[#1B262C] border-l border-slate-200 dark:border-[#3282B8]/30 flex flex-col transition-all duration-300 shadow-xl ${isSidebarOpen ? 'w-80' : 'w-0'}`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -left-10 top-6 bg-white dark:bg-[#0F4C75] border border-r-0 border-slate-200 dark:border-[#3282B8]/30 rounded-l-xl p-2.5 shadow-md text-slate-700 dark:text-[#BBE1FA] hover:bg-slate-50 transition-colors"
        title={isSidebarOpen ? "Thu gọn danh sách" : "Mở danh sách địa điểm"}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faChevronRight : faChevronLeft} className="w-4 h-4" />
        {!isSidebarOpen && savedPlaces.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {savedPlaces.length}
          </span>
        )}
      </button>

      {/* Sidebar Content */}
      <div className={`flex flex-col h-full w-80 overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
        <div className="p-4 border-b border-slate-200 dark:border-[#3282B8]/30 bg-slate-50 dark:bg-[#0F4C75]/40 flex-shrink-0">
          <h2 className="font-bold text-[#0F4C75] dark:text-[#BBE1FA] flex items-center gap-2">
            <FontAwesomeIcon icon={faMap} /> Lộ trình của bạn
          </h2>
          <p className="text-xs text-slate-500 mt-1">Danh sách địa điểm để lập lộ trình</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedPlaces.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-8">
              Chưa có địa điểm nào được chọn. Hãy thêm địa điểm vào lộ trình!
            </div>
          ) : (
            savedPlaces.map(place => (
              <div key={place.id} className="bg-white dark:bg-[#0F4C75]/20 border border-slate-200 dark:border-[#3282B8]/30 rounded-lg p-3 shadow-sm flex gap-3 relative group">
                {(place.image || place.thumbnail) ? (
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={place.image || place.thumbnail} alt={place.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md flex-shrink-0 bg-white border border-slate-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faMap} className="text-slate-200 w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-white truncate">{place.name}</h4>
                  <p className="text-xs text-slate-500 truncate mt-1">{place.ward}</p>
                </div>
                <button 
                  onClick={() => handleRemoveSavedPlace(place.id)}
                  className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa khỏi danh sách"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-[#3282B8]/30 bg-white dark:bg-[#1B262C] flex-shrink-0">
          <button
            onClick={handleCreateRoute}
            disabled={savedPlaces.length === 0}
            className="w-full py-3 bg-[#0F4C75] hover:bg-[#3282B8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-sm text-sm flex justify-center items-center gap-2"
          >
            Tạo Lộ Trình
          </button>
        </div>
      </div>
    </div>
  );
}
