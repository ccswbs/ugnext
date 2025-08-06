"use client";

import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, type DOMNode } from "html-react-parser";
import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import Script from "next/script";

type ParserInstruction = {
  shouldParse: (
    node: Element,
    props: ReturnType<typeof attributesToProps>,
    children: ReturnType<typeof domToReact>,
    index: number
  ) => boolean;
  parse: (
    node: Element,
    props: ReturnType<typeof attributesToProps>,
    children: ReturnType<typeof domToReact>,
    index: number
  ) => React.JSX.Element;
};

const selfClosingTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function isElement(domNode: DOMNode): domNode is Element {
  const isTag = ["tag", "script"].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
}

const defaultInstructions: ParserInstruction[] = [
  {
    shouldParse: (node) => {
      switch (node.tagName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return true;
        default:
          return false;
      }
    },
    parse: (node, props, children, index) => {
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
          {children}
        </Typography>
      );
    },
  },
  {
    shouldParse: (node) => node.tagName === "p",
    parse: (node, props, children, index) => (
      <Typography {...props} key={nanoid()} type="body" as="p">
        {children}
      </Typography>
    ),
  },
  {
    shouldParse: (node) => node.tagName === "script",
    parse: (node, props, children, index) => {
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
        delete props.children;

        const children = domToReact(node.children as DOMNode[], options);

        for (const instruction of [...instructions, ...defaultInstructions]) {
          if (instruction.shouldParse(node, props, children, index)) {
            return instruction.parse(node, props, children, index);
          }
        }

        // Fallback renderer for nodes that are self-closing and as a result cannot have children passed to them
        if (selfClosingTags.has(node.tagName)) {
          return <node.name key={nanoid()} {...props} />;
        }

        // Fallback renderer for nodes that can have children passed to them
        return (
          // @ts-ignore
          <node.name key={nanoid()} {...props}>
            {children}
          </node.name>
        );
      },
      trim: true,
    };
  }, [instructions]);

  const content = useMemo(() => parse(html, options), [html, options]);

  return <>{content}</>;
}
