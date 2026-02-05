import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const FigureInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "figure",
  processNode: (node, props, children) => {
    const className = typeof props.className === "string" ? props.className : "";
    const classes = twMerge(
      "my-4",
      (className.includes("align-left") || props["data-align"] === "left") && "float-left mr-4 ml-0",
      (className.includes("align-right") || props["data-align"] === "right") && "float-right ml-4 mr-0",
      props.className as string
    );

    return (
      <figure {...props} key={nanoid()} className={classes}>
        {children}
      </figure>
    );
  },
};
