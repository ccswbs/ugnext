import { Blockquote, BlockquoteContent } from "@uoguelph/react-components/blockquote";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const BlockquoteInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "blockquote",
  processNode: (node, props, children) => {
    return (
      <Blockquote>
        <BlockquoteContent className="[&_*]:text-2xl mt-4 [&_*]:inline [&_i]:hidden!">{children}</BlockquoteContent>
      </Blockquote>
    );
  },
};
