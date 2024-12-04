import postcss from "postcss";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";
import * as config from "../tailwind.config.cjs";
import styles from "!!raw-loader!../styles/globals.css";

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
  ]).process(styles);

  return result.css;
};
