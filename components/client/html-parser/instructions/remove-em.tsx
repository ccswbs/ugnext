import React, { Fragment } from "react";
import { nanoid } from "nanoid";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const RemoveEmInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props, children) => {
    if (node.tagName !== "em") {
      return false;
    }

    return React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === "i");
  },
  processNode: (node, props, children) => {
    return <Fragment key={nanoid()}>{children}</Fragment>;
  },
};
