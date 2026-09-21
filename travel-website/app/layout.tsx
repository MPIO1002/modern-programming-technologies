import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
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
    <html
      lang="vi" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
