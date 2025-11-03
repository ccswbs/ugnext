import path from "path";
import { cp } from "fs/promises";

const cwd = process.cwd();
const from = path.resolve(cwd, "node_modules", "@uoguelph", "web-components", "dist", "uofg-web-components");
const to = path.resolve(cwd, "public", "@uoguelph", "web-components");

console.log(`Copying web components library to Next public folder`);

try {
  await cp(from, to, { recursive: true, force: true });
} catch (error) {
  console.error("Failed to copy web components library to public folder:", error);
  process.exit(1);
}
