import { createUseCacheHandler } from "@pantheon-systems/nextjs-cache-handler/use-cache";

const UseCacheHandler = createUseCacheHandler({
  type: "auto", // Auto-detect: GCS if CACHE_BUCKET exists, else file-based
});

export default new UseCacheHandler();
