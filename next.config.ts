import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for Cloudflare Pages (build output: out/).
  output: "export",
  images: {
    // No image optimizer on a static host. Remote Unsplash/Pexels URLs
    // already carry w=/q= params, so they arrive pre-sized.
    unoptimized: true,
  },
  // Cache-Control headers live in public/_headers (read by Cloudflare Pages);
  // headers() is not supported with output: "export".
};

export default nextConfig;
