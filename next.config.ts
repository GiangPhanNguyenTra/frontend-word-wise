import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "static.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
