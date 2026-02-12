import { nanoid } from "nanoid";
import { Divider } from "@uoguelph/react-components/divider";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const DividerInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "hr",
  processNode: () => <Divider key={nanoid()} />,
};
