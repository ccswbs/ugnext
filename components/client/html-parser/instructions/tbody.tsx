import { nanoid } from "nanoid";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const TbodyInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "tbody",
  processNode: (node, props, children) => {
    // Strip all existing attributes and create clean props for tbody
    const cleanProps = {};

    return (
      <tbody {...cleanProps} key={nanoid()}>
        {children}
      </tbody>
    );
  },
};
