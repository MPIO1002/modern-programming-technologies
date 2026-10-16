'use client';

import { useState, useEffect } from 'react';

type Props = {
  placeId: number | string;
  variant?: 'default' | 'card';
  className?: string;
};

export default function AddToItineraryButton({
  placeId,
  variant = 'default',
  className,
}: Props) {
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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedList: number[] = JSON.parse(localStorage.getItem('my_list') || '[]');
    const numericId = Number(placeId);

    if (isAdded) {
      // true thì xóa
      const newList = savedList.filter((id: number) => id !== numericId);
      localStorage.setItem('my_list', JSON.stringify(newList));
      setIsAdded(false);
    } else {
      // false thì thêm
      const newList = [...savedList, numericId];
      localStorage.setItem('my_list', JSON.stringify(newList));
      setIsAdded(true);
    }

    // Thông báo cho Sidebar cập nhật
    window.dispatchEvent(new Event('itinerary_updated'));
  };

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          `w-full text-xs font-bold px-3 py-2.5 rounded-xl transition-colors text-center border shadow-sm ${isAdded
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
            : 'bg-[#0F4C75] text-white border-transparent hover:bg-[#3282B8]'
          }`
        }
      >
        <span>{isAdded ? 'Đã thêm vào lộ trình' : 'Thêm vào lộ trình'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        `w-full text-xs py-3 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${isAdded
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'bg-[#0F4C75] hover:bg-[#3282B8] text-white'
        }`
      }
    >
      <span>{isAdded ? 'Đã thêm vào lịch trình' : 'Thêm vào lịch trình'}</span>
    </button>
  );
}