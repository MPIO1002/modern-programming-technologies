import dynamic from "next/dynamic";
import type { Location, RouteInfo } from "@/types/vietmap";

interface Props {
  waypoints: (Location | null)[];
  routeInfo: RouteInfo | null;
}

const VietmapLeaflet = dynamic(() => import("./VietmapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#3282B8", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-medium">Đang tải bản đồ…</p>
      </div>
    </div>
  ),
});

export default function MapWrapper(props: Props) {
  return <VietmapLeaflet {...props} />;
}
