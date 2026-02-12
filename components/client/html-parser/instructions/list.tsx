import { nanoid } from "nanoid";
import { List } from "@uoguelph/react-components/list";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ListInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
  processNode: (node, props, children) => {
    return (
      <List
        {...props}
        key={nanoid()}
        as={node.tagName as "ul" | "ol"}
        className={"group-first/html-parser:first:pt-0 list-outside pl-4 pt-3 text-lg"}
      >
        {children}
      </List>
    );
  },
};
