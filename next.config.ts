import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_STATIC_OUTPUT === "true" ? "export" : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: process.env.NEXT_STATIC_OUTPUT === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string).hostname,
        port: "",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL).hostname,
        port: "",
        pathname: "/system/files/**",
      },
      {
        protocol: "https",
        hostname: "api.liveugconthub.uoguelph.dev",
        port: "",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/ens-test",
        destination: "/?ens-test=true",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/token',
        destination: process.env.NEXT_PUBLIC_UNIWEB_URL + '/api/token.php'
      },
      {
        source: '/api/resource',
        destination: process.env.NEXT_PUBLIC_UNIWEB_URL + '/api/resource'
      },
      {
        source: '/api/profiles/:id',
        destination: `${process.env.NEXT_PUBLIC_UNIWEB_URL}/profiles.php/get/members/profile/:id`
      }
    ];
  }
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
