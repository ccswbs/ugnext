import { nanoid } from "nanoid";
import Script from "next/script";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ScriptInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "script",
  processNode: (node, props, children) => {
    const id = nanoid();

    if (!props.src && node.children[0]?.type === "text") {
      return (
        <Script id={id} key={id}>
          {node.children[0].data}
        </Script>
      );
    }

    return <Script key={id} src={props.src as string} type={props.type as string} strategy="lazyOnload" />;
  },
};
