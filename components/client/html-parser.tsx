"use client";

import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, type DOMNode } from "html-react-parser";
import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import Script from "next/script";

type ParserNodeProps = ReturnType<typeof attributesToProps>;
type ParserInstruction = {
  shouldParse: (node: Element, props: ParserNodeProps, index: number) => boolean;
  parse: (node: Element, props: ParserNodeProps, index: number, options: HTMLReactParserOptions) => React.JSX.Element;
};

function isElement(domNode: DOMNode): domNode is Element {
  const isTag = ["tag", "script"].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
}

const defaultInstructions: ParserInstruction[] = [
  {
    shouldParse: (node) =>
      node.tagName === "h1" ||
      node.tagName === "h2" ||
      node.tagName === "h3" ||
      node.tagName === "h4" ||
      node.tagName === "h5" ||
      node.tagName === "h6",
    parse: (node, props, index, options) => {
      const level = node.tagName as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const className = typeof props.className === "string" ? props.className : "";

      return (
        <Typography
          {...props}
          key={nanoid()}
          type={level}
          as={level}
          className={twMerge(index === 0 && "mt-0", className)}
        >
          {domToReact(node.children as DOMNode[], options)}
        </Typography>
      );
    },
  },
  {
    shouldParse: (node) => node.tagName === "p",
    parse: (node, props, index, options) => (
      <Typography {...props} key={nanoid()} type="body" as="p">
        {domToReact(node.children as DOMNode[], options)}
      </Typography>
    ),
  },
  {
    shouldParse: (node) => node.tagName === "script",
    parse: (node, props, index, options) => {
      if (typeof props.src !== "string" || props.src === "") {
        return <></>;
      }

      if (typeof props.type !== "string") {
        return <></>;
      }

      return <Script src={props.src} type={props.type} strategy="lazyOnload" />;
    },
  },
];

export function HtmlParser({ html, instructions = [] }: { html: string; instructions: ParserInstruction[] }) {
  const options: HTMLReactParserOptions = useMemo(() => {
    return {
      replace: (node, index) => {
        if (!isElement(node)) {
          return;
        }

        const props = attributesToProps(node.attribs);

        // Remove bad props
        delete props.style;
        delete props.key;
        delete props.dangerouslySetInnerHTML;

        for (const instruction of [...instructions, ...defaultInstructions]) {
          if (instruction.shouldParse(node, props, index)) return instruction.parse(node, props, index, options);
        }
      },
      trim: true,
    };
  }, [instructions]);

  const content = useMemo(() => parse(html, options), [html, options]);

  return <>{content}</>;
}
