import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // MockAPI trả thumbnail từ nhiều tên miền khác nhau (ivivu, wikimedia, imagekit...),
      // nên chỉ chặn theo giao thức thay vì liệt kê từng host.
      // Chỉ cho phép https để tránh Mixed Content và giảm bề mặt tấn công qua http.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
