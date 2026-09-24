'use client';

import { useState, useEffect } from 'react';

type Props = {
  placeId: number;
};

export default function AddToItineraryButton({ placeId }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const savedList: number[] = JSON.parse(localStorage.getItem('my_list') || '[]');
    if (savedList.includes(placeId)) {
      setIsAdded(true);
    }
  }, [placeId]);

  // Hàm xử lý khi bấm nút
  const handleClick = () => {
    const savedList: number[] = JSON.parse(localStorage.getItem('my_list') || '[]');

    if (isAdded) {
        //true thì xóa
        const newList = savedList.filter((id: number) => id !== placeId);
        localStorage.setItem('my_list', JSON.stringify(newList));
        setIsAdded(false);
    } else {
        //false thì thêm
        const newList = [...savedList, placeId];
        localStorage.setItem('my_list', JSON.stringify(newList));
        setIsAdded(true);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`w-full py-3 font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
        isAdded 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' // Đã thêm: Màu xanh lá
          : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'    // Chưa thêm: Màu tím chủ đạo
      }`}
    >
      <span>{isAdded ? '✓ Đã thêm vào lịch trình' : '+ Thêm vào lịch trình'}</span>
    </button>
  );
}