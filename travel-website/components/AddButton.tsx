'use client';

import { useState, useEffect } from 'react';

type Props = {
  placeId: number;
};

export default function AddToItineraryButton({ placeId }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const checkAdded = () => {
      const savedList: number[] = JSON.parse(localStorage.getItem('my_list') || '[]');
      if (savedList.includes(Number(placeId))) {
        setIsAdded(true);
      } else {
        setIsAdded(false);
      }
    };
    
    checkAdded();
    window.addEventListener("itinerary_updated", checkAdded);
    return () => window.removeEventListener("itinerary_updated", checkAdded);
  }, [placeId]);

  // Hàm xử lý khi bấm nút
  const handleClick = () => {
    const savedList: number[] = JSON.parse(localStorage.getItem('my_list') || '[]');
    const numericId = Number(placeId);

    if (isAdded) {
        //true thì xóa
        const newList = savedList.filter((id: number) => id !== numericId);
        localStorage.setItem('my_list', JSON.stringify(newList));
        setIsAdded(false);
    } else {
        //false thì thêm
        const newList = [...savedList, numericId];
        localStorage.setItem('my_list', JSON.stringify(newList));
        setIsAdded(true);
    }
    
    // Thông báo cho Sidebar cập nhật
    window.dispatchEvent(new Event('itinerary_updated'));
  };

  return (
    <button 
      onClick={handleClick}
      className={`w-full py-3 font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
        isAdded 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
          : 'bg-[#0F4C75] hover:bg-[#3282B8] text-white'
      }`}
    >
      <span>{isAdded ? '✓ Đã thêm vào lịch trình' : '+ Thêm vào lịch trình'}</span>
    </button>
  );
}