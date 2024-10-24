import postcss from "postcss";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";
import { config } from "../tailwind.config.cjs";

export const tailwind = async (content) => {
  const result = await postcss([
    tailwindcss({
      ...config,
      corePlugins: {
        preflight: false,
      },
      content: [{ raw: content }],
    }),
    ...(process.env.NODE_ENV === "production" ? [cssnano()] : []),
  ]).process("@tailwind base; @tailwind components; @tailwind utilities");

  return result.css;
};
