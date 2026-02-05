import { nanoid } from "nanoid";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const TheadInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "thead",
  processNode: (node, props, children) => {
    // Strip all existing attributes and create clean props for thead
    const cleanProps = {};

    return (
      <thead {...cleanProps} key={nanoid()}>
        {children}
      </thead>
    );
  },
};
