import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TỐI ƯU LỘ TRÌNH DU LỊCH - VIETMAP",
  description: "Hệ thống khám phá địa điểm và tối ưu lộ trình du lịch thông minh",
};

export default function RootLayout({ children }: Readonly<{ 
  children: React.ReactNode; 
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${montserrat.variable} antialiased`}>
      <body className={`${montserrat.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange>
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}