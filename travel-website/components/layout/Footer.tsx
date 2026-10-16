export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-[#3282B8]/30 bg-slate-50 dark:bg-[#1B262C] py-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Vietmap Travel. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
