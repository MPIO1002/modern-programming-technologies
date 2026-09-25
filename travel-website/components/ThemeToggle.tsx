'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl border border-slate-700 dark:border-[#3282B8]/40 bg-slate-200 dark:bg-[#0F4C75]/60 text-slate-800 dark:text-[#BBE1FA] hover:opacity-80 transition cursor-pointer shadow-md"
      aria-label="Chuyển chế độ sáng tối"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}