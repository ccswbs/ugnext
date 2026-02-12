import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const TrInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "tr",
  processNode: (node, props, children) => {
    // Strip all existing attributes and create clean props for tr
    const cleanProps = {};

    const classes = twMerge("border border-grey-light");

    return (
      <tr {...cleanProps} key={nanoid()} className={classes}>
        {children}
      </tr>
    );
  },
};
