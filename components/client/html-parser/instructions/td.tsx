import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";
import { nextRowspanTdIsEven } from "@/components/client/html-parser/instructions/table-rowspan";

export const TdInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "td",
  processNode: (node, props, children) => {
    // Get preserved attributes from the original node
    const cleanProps: { rowspan?: string | number; colspan?: string | number } = {};
    if (node.attribs.rowspan) cleanProps.rowspan = node.attribs.rowspan;
    if (node.attribs.colspan) cleanProps.colspan = node.attribs.colspan;

    let backgroundClass = "";

    // Handle alternating colors for td elements with rowspan
    if (node.attribs.rowspan) {
      // Use independent counter for rowspan cells
      const isEvenRowspanCell = nextRowspanTdIsEven();
      backgroundClass = isEvenRowspanCell ? "bg-grey-light-bg" : "bg-white";
    } else {
      // For regular td elements, find the parent tr and use its index
      let parentTr = node.parent;
      while (parentTr && parentTr.type === "tag" && parentTr.name !== "tr") {
        parentTr = parentTr.parent;
      }

      let rowIndex = 0;
      if (parentTr && parentTr.parent) {
        const siblings = parentTr.parent.children.filter((child: any) => child.type === "tag" && child.name === "tr");
        rowIndex = siblings.indexOf(parentTr);
      }

      const isEvenRow = rowIndex % 2 === 0;
      backgroundClass = isEvenRow ? "bg-grey-light-bg" : "bg-white";
    }

    const classes = twMerge("border border-grey-light px-4 py-2", backgroundClass);

    return (
      <td {...cleanProps} key={nanoid()} className={classes}>
        {children}
      </td>
    );
  },
};
