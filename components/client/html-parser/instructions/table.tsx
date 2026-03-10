import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";
import { resetRowspanTdCounter } from "@/components/client/html-parser/instructions/table-rowspan";

export const TableInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "table",
  processNode: (node, props, children) => {
    // Reset the rowspan counter for each new table
    resetRowspanTdCounter();

    // Strip all existing attributes and create clean props for table
    const cleanProps = {};
    const classes = twMerge("w-full border-collapse border border-grey-light my-4");

    return (
      <div className="overflow-x-auto my-4">
        <table {...cleanProps} key={nanoid()} className={classes}>
          {children}
        </table>
      </div>
    );
  },
};
