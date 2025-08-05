"use client";

import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, type DOMNode } from "html-react-parser";
import { useMemo } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import { Divider } from "@uoguelph/react-components/divider";
import Script from "next/script";

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

type ParsedProps = ReturnType<typeof attributesToProps>;

function parseHeading(node: Element, props: ParsedProps, index: number) {
  const level = node.tagName as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const className = typeof props.className === "string" ? props.className : "";

  return (
    <Typography {...props} key={nanoid()} type={level} as={level} className={twMerge(index === 0 && "mt-0", className)}>
      {domToReact(node.children as DOMNode[], options)}
    </Typography>
  );
}

function parseParagraph(node: Element, props: ParsedProps, index: number) {
  return (
    <Typography {...props} key={nanoid()} type="body" as="p">
      {domToReact(node.children as DOMNode[], options)}
    </Typography>
  );
}

function parseScript(node: Element, props: ParsedProps, index: number) {
  if (typeof props.src !== "string" || props.src === "") {
    return <></>;
  }

  if (typeof props.type !== "string") {
    return <></>;
  }

  return <Script src={props.src} type={props.type} strategy="lazyOnload" />;
}

const options: HTMLReactParserOptions = {
  replace: (node, index) => {
    if (!isElement(node)) {
      return;
    }

    const props = attributesToProps(node.attribs);

    // Remove bad props
    delete props.style;
    delete props.key;
    delete props.dangerouslySetInnerHTML;

    // Custom renderers
    switch (node.name) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return parseHeading(node, props, index);
      case "p":
        return parseParagraph(node, props, index);
      case "hr":
        return <Divider key={nanoid()} />;
      case "script":
        return parseScript(node, props, index);
    }

    // Fallback renderer for nodes that are self-closing and as a result cannot have children passed to them
    if (selfClosingTags.has(node.name)) {
      return <node.name key={nanoid()} {...props} />;
    }

    // Fallback renderer for nodes that can have children passed to them
    // @ts-ignore
    return <node.name key={nanoid()}>{domToReact(node.children as DOMNode[], options)}</node.name>;
  },
  trim: true,
};

export function HtmlParser({ html }: { html: string }) {
  const content = useMemo(() => parse(html, options), [html]);

  return <>{content}</>;
}
