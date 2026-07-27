import type { NextConfig } from "next";
import path from "path";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import { fileURLToPath } from "url";

function getNextConfig(): NextConfig {
  const drupalDomains = [
    new URL("https://api.liveugconthub.uoguelph.dev"),
    new URL("https://api.testugconthub.uoguelph.dev"),
    new URL("https://api.devugconthub.uoguelph.dev"),
  ];

  // Add the environment set Drupal base URL to the beginning of the drupal domains array, ensuring no duplicates
  if (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) {
    const noTrailingSlash = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL.replace(/\/+(?=\?|#|$)/g, "");
    const url = new URL(noTrailingSlash);
    const duplicateIndex = drupalDomains.findIndex((domain) => {
      return domain.toString() === url.toString();
    });

    if (duplicateIndex !== -1) {
      drupalDomains.splice(duplicateIndex, 1);
    }

    drupalDomains.unshift(url);
  }

  // Base config
  const config: NextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        ...drupalDomains.map((domain) => {
          return {
            protocol: domain.protocol.replace(":", ""),
            hostname: domain.hostname,
            port: domain.port,
            pathname: "/sites/default/files/**",
          } as RemotePattern;
        }),
        {
          protocol: "https",
          hostname: "cdn.uoguelph.ca",
          port: "",
          pathname: "*",
        },
        {
          protocol: "https",
          hostname: "picsum.photos",
          port: "",
          pathname: "/**",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
          ],
        },
      ];
    },
    async redirects() {
      return [
        {
          source: "/ens-test",
          destination: "/?ens-test=true",
          permanent: true,
        },
        {
          source: "/api/v1/aad-profile",
          destination: "/api/aad-profile",
          permanent: false,
        },
        {
          source: "/sites/default/files/:path*",
          destination: `${drupalDomains[0].toString()}sites/default/files/:path*`,
          permanent: false,
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: "/sitemap-next.xml",
          destination: "/sitemap.xml",
        },
      ];
    },
  };

  // Set number of worker threads used when building pages.
  // Sometimes Drupal struggles to keep up with the load if many requests are made at once,
  // so we can lower the number of threads to reduce the number of requests made in parallel.
  const cpuCount = parseInt(process.env.NEXT_WORKER_CPU_COUNT ?? "");
  if (!isNaN(cpuCount)) {
    config.experimental = {
      cpus: cpuCount,
    };
  }

  if (process.env.NEXT_STATIC_OUTPUT === "true") {
    // Static build
    config.output = "export";
    config.cacheComponents = false;
    config.images ??= {};
    config.images.unoptimized = true;
  } else if (process.env.USE_PANTHEON_CACHE_HANDLERS !== "false") {
    // Normal build
    // Regular ISR and route cache handler
    config.cacheHandler = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "lib",
      "cache",
      "cache-handler.mjs"
    );
    // For cache components
    /*
    config.cacheComponents = true;
    config.cacheHandlers = {
      default: path.resolve(__dirname, "lib", "cache", "use-cache-handler.mjs"),
    };
     */
  }

  return config;
}

export default getNextConfig();
