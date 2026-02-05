import { nanoid } from "nanoid";
import Script from "next/script";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ScriptInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "script",
  processNode: (node, props) => {
    return <Script key={nanoid()} src={props.src as string} type={props.type as string} strategy="lazyOnload" />;
  },
};
