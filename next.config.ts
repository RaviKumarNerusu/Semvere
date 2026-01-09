import type { NextConfig } from "next";

// Loader path from orchids-visual-edits
const loaderPath = require.resolve("orchids-visual-edits/loader.js");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ✅ REQUIRED for Vercel (fixes routes-manifest error)
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [loaderPath],
      },
    },
  },
};

export default nextConfig;
