/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STATIC_OUTPUT === "true" ? "export" : undefined,
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.gql|.graphql$/,
        use: {
          loader: "webpack-graphql-loader",
          options: {
            removeUnusedFragments: true,
            output: "string",
            validate: false,
            minify: true,
          },
        },
      },
      {
        test: /\.ya?ml$/,
        use: "yaml-loader",
      }
    );
    return config;
  },
  images: {
    unoptimized: process.env.NEXT_STATIC_OUTPUT === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL).hostname,
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
