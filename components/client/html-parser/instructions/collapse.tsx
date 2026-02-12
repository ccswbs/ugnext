import { HTMLParserInstruction } from "../index";
import React from "react";

export const CollapseInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props) => (props.className as string)?.includes("collapse"),
  processNode: (node, props, children) => {
    return <>{children}</>;
  },
};
