import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <--- INDISPENSABLE
  images: { unoptimized: true },
};

export default nextConfig;
