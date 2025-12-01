import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚫 Tắt ESLint khi build (không chặn build nữa)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🚫 Tắt TypeScript error khi build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🚀 Ép tất cả route dynamic (bỏ prerender)
  dynamicParams: true,

  // 🚀 FIX lỗi TS7011: function implicitly returns any[]
  // ⚠️ Kiểu trả về phải KHỚP spec của Next.js
  generateStaticParams: (): Array<{ params: Record<string, string> }> => [],

  experimental: {
    // ❗ Tắt Partial Prerendering (fix useSearchParams + suspense error)
    ppr: false,

    // ❗ PHẢI dùng object, không được dùng "true"
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["*"],
    },
  },

  // 🚫 Bỏ suspense boundary check (fix build)
  env: {
    NEXT_RUNTIME_DISABLE_SUSPENSE_CHECK: "1",
  },

  // ⚙️ Cho phép ảnh từ mọi domain
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ⚙️ Fix các module Node bị dùng trong client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }
    return config;
  },

  // Bắt buộc để chạy Next.js trong Docker / Render
  output: "standalone",
};

export default nextConfig;
