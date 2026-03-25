'use client';

import { nanoid } from "nanoid";
import { List } from "@uoguelph/react-components/list";
import { HTMLParserInstruction } from "@/components/client/html-parser";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";

// Create a proper React component that uses the hook
function ListRenderer({ node, props, children }: any) {
  const context = useContext(SectionContext);
  
  return (
    <List
      {...props}
      key={nanoid()}
      as={node.tagName as "ul" | "ol"}
      columns={context?.column == "secondary" || node.attribs?.class?.includes("columns-1") ? false : true}
      className={"group-first/html-parser:first:pt-0 list-outside pl-4 pt-3 text-lg"}
    >
      {children}
    </List>
  );
}

export const ListInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
  processNode: (node, props, children) => {
    return <ListRenderer node={node} props={props} children={children} />;
  },
};