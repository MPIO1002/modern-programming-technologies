import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'vov2.vov.vn',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'ik.imagekit.io',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'upload.wikimedia.org',
      // },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
