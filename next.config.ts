/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^\/company\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "company-pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 3,
      },
    },
    {
      urlPattern: /^\/icons\/.*\.(png|svg|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "icon-cache",
        expiration: {
          maxEntries: 10,
        },
      },
    },
  ],
  buildExcludes: [
    /app-build-manifest\.json$/,
    /react-loadable-manifest\.json$/,
    /build-manifest\.json$/,
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
