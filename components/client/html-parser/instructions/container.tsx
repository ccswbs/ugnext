import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ContainerInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props) => (props.className as string)?.includes("container"),
  processNode: (node, props, children) => {
    return <>{children}</>;
  },
};
