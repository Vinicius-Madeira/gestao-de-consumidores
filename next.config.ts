/* eslint-disable @typescript-eslint/no-require-imports */
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/company/fallback",
  },
  buildExcludes: [/app-build-manifest\.json/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@tabler/icons-react"],
  },
};

module.exports = withPWA(nextConfig);
