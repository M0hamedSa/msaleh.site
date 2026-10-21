import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The project screens are large PNG captures; serve them as AVIF where supported.
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
