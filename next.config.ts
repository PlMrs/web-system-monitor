import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  allowedDevOrigins: ["paulassemonitor.duckdns.org"],
};

export default nextConfig;
