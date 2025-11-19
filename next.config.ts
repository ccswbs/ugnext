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
      {
        source: "/sites/default/files/:path*",
        destination: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string}/sites/default/files/:path*`,
        permanent: false,
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
