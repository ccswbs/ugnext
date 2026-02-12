import { nanoid } from "nanoid";
import { ListItem } from "@uoguelph/react-components/list";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ListItemInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "li",
  processNode: (node, props, children) => {
    return (
      <ListItem {...props} key={nanoid()}>
        {children}
      </ListItem>
    );
  },
};
