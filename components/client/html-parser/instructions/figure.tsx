import { nanoid } from "nanoid";
import { extractTextFromDOMNode, HTMLParserInstruction } from "@/components/client/html-parser";
import { Figure, FigureCaption, FigureImage } from "@uoguelph/react-components/figure";
import { DOMNode } from "html-react-parser";

export const FigureInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "figure",
  processNode: (node, props, children) => {
    const id = nanoid();
    const className = typeof props.className === "string" ? props.className : "";

    const imgNode: DOMNode = node.children.find((child) => child.type === "tag" && child.name === "img");

    if (!imgNode) {
      return (
        <figure {...props} key={id}>
          {children}
        </figure>
      );
    }

    let alignment: "left" | "right" = "left";

    if (className.includes("align-right") || props["data-align"] === "right") {
      alignment = "right";
    }

    const caption: DOMNode = node.children.find((child) => child.type === "tag" && child.name === "figcaption");

    return (
      <Figure align={alignment} {...props} key={id}>
        <FigureImage
          key={`${id}-figure-image`}
          src={imgNode.attribs.src}
          alt={imgNode.attribs.alt}
          width={imgNode.attribs.width}
          height={imgNode.attribs.height}
        />

        {caption && <FigureCaption key={`${id}-figure-caption`}>{extractTextFromDOMNode(caption)}</FigureCaption>}
      </Figure>
    );
  },
};
