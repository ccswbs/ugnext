export const OUTPUT_DIR = "out";

export async function time<T>(fn: () => Promise<T>, startMessage?: string, endMessage?: string): Promise<T> {
  if (startMessage) {
    console.log(startMessage);
  }

  const start = performance.now();

  try {
    return await fn();
  } finally {
    const elapsed = performance.now() - start;

    if (endMessage) {
      console.log(endMessage);
    }

    console.log(`Took ${elapsed.toFixed(2)} ms`);
  }
}

export async function* walk(directory: string): AsyncGenerator<string> {
  const glob = new Bun.Glob("**/*");

  for await (const path of glob.scan({ cwd: directory, onlyFiles: true })) {
    yield `${directory}/${path}`;
  }
}
