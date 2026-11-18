import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The project screens are large PNG captures; serve them as AVIF where supported.
  images: { formats: ["image/avif", "image/webp"] },
  // Aqsat went live as Elghandour (November 2026); keep the old case study address working.
  async redirects() {
    return [{ source: "/work/aqsat", destination: "/work/elghandour", permanent: true }];
  },
};

export default nextConfig;
