import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SidebarItinerary from "@/components/layout/SidebarItinerary";

export default function TouristLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      <SidebarItinerary />
    </div>
  );
}
