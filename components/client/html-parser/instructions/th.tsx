import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ThInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "th",
  processNode: (node, props, children) => {
    // Get preserved attributes from the original node
    const cleanProps: { rowspan?: string | number; colspan?: string | number } = {};
    if (node.attribs.rowspan) cleanProps.rowspan = node.attribs.rowspan;
    if (node.attribs.colspan) cleanProps.colspan = node.attribs.colspan;

    const classes = twMerge("border border-grey-light px-4 py-2 text-left font-semibold");

    return (
      <th {...cleanProps} key={nanoid()} className={classes}>
        {children}
      </th>
    );
  },
};
