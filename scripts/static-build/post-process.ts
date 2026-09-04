import { extname } from "node:path";
import { OUTPUT_DIR, walk, time } from "./common";

const REMOTE_IMAGE_OUTPUT_DIR = "remote-images";

const FILE_EXTENSIONS = new Set([".html", ".css"]);

const IMAGE_URL_REGEX = /https?:\/\/[^"'()\s<>]+?\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?[^"'()\s<>]*)?/gi;

const MAX_FILE_CONCURRENCY = 32;
const MAX_DOWNLOAD_CONCURRENCY = 16;

type RemoteImage = {
  remote: string;
  local: string;
};

class Semaphore {
  private available: number;
  private waiting: (() => void)[] = [];

  constructor(count: number) {
    this.available = count;
  }

  async acquire() {
    if (this.available > 0) {
      this.available--;
      return;
    }

    await new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release() {
    const next = this.waiting.shift();

    if (next) {
      next();
    } else {
      this.available++;
    }
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();

    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

const downloadSemaphore = new Semaphore(MAX_DOWNLOAD_CONCURRENCY);

async function downloadRemoteImage(image: RemoteImage) {
  await downloadSemaphore.run(async () => {
    const response = await fetch(image.remote);

    if (!response.ok) {
      throw new Error(`Failed to download ${image.remote}: ${response.status} ${response.statusText}`);
    }

    const outputPath = `${OUTPUT_DIR}${image.local}`;

    await Bun.write(outputPath, response);
  });
}

async function processRemoteImages() {
  const images = new Map<string, RemoteImage>();

  // Mapping URL -> in-progress download.
  // This both deduplicates downloads and lets them start immediately.
  const downloads = new Map<string, Promise<void>>();

  const fileSemaphore = new Semaphore(MAX_FILE_CONCURRENCY);
  const filePromises: Promise<void>[] = [];

  for await (const file of walk(OUTPUT_DIR)) {
    const extension = extname(file);

    if (!FILE_EXTENSIONS.has(extension)) {
      continue;
    }

    filePromises.push(
      fileSemaphore.run(async () => {
        let contents = await Bun.file(file).text();
        let modified = false;

        for (const match of contents.matchAll(IMAGE_URL_REGEX)) {
          const remote = match[0];

          let image = images.get(remote);

          if (!image) {
            const url = new URL(remote);
            const imageExtension = extname(url.pathname);
            const hash = Bun.hash(remote).toString(16);
            const filename = `${hash}${imageExtension}`;

            image = {
              remote,
              local: `/${REMOTE_IMAGE_OUTPUT_DIR}/${filename}`,
            };

            images.set(remote, image);

            downloads.set(remote, downloadRemoteImage(image));
          }

          contents = contents.replaceAll(remote, image.local);
          modified = true;
        }

        if (modified) {
          await Bun.write(file, contents);
        }
      })
    );
  }

  // File scanning/rewriting and downloads have been occurring
  // concurrently up to this point.
  await Promise.all(filePromises);

  // Wait for any outstanding downloads.
  await Promise.all(downloads.values());

  return Array.from(images.values());
}

await time(
  async () => {
    console.log("Processing remote images... This may take a while...");

    const images = await processRemoteImages();

    console.log(
      `Processed and downloaded ${images.length} remote image(s) to ` + `${OUTPUT_DIR}/${REMOTE_IMAGE_OUTPUT_DIR}.`
    );
  },
  "Starting static build post processing...",
  "Post processing complete."
);
