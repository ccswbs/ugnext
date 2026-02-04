import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";

const DRUPAL_BASE_URL = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev").replace(
  /\/+(?=\?|#|$)/g,
  ""
);

const nextConfig: NextConfig = {
  output: process.env.NEXT_STATIC_OUTPUT === "true" ? "export" : undefined,
  htmlLimitedBots: /.*/,
  reactStrictMode: true,
  images: {
    unoptimized: process.env.NEXT_STATIC_OUTPUT === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(DRUPAL_BASE_URL).hostname,
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
        destination: `${DRUPAL_BASE_URL}/sites/default/files/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
