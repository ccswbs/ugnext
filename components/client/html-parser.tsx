"use client";

import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, type DOMNode } from "html-react-parser";
import React, { Fragment, useMemo } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import Script from "next/script";
import { Info } from "@uoguelph/react-components/info";
import { Button, type ButtonProps } from "@uoguelph/react-components/button";
import { Link } from "@uoguelph/react-components/link";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Divider } from "@uoguelph/react-components/divider";
import Image from "next/image";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import NextLink from "next/link";

type ParserInstruction = {
  shouldProcessNode: (
    node: Element,
    props: ReturnType<typeof attributesToProps>,
    children: ReturnType<typeof domToReact>,
    index: number
  ) => boolean;
  processNode: (
    node: Element,
    props: ReturnType<typeof attributesToProps>,
    children: ReturnType<typeof domToReact>,
    index: number,
    childParser: (children: DOMNode[]) => ReturnType<typeof domToReact>
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
  // vcard
  {
    shouldProcessNode: (node, props) => {
      const className = (props.className as string) ?? "";
      return className.includes("vcard");
    },
    processNode: (node, props, children) => {
      const childArray = React.Children.toArray(children);
      let name = "",
        title = "",
        phone = "",
        extension = "",
        email = "";

      for (const child of childArray) {
        const isElement = React.isValidElement(child);

        if (isElement && child.type === "strong") {
          name = (child as React.JSX.Element)?.props.children;
        }

        if (typeof child === "string" && child.length > 2 && !title) {
          title = child;
        }

        const href = (child as React.JSX.Element).props?.href;

        if (isElement && typeof href === "string") {
          if (href.startsWith("tel:")) {
            const tokens = href.replace("tel:", "").split("p");

            phone = (child as React.JSX.Element)?.props.children;
            extension = tokens[1];
          } else if (href.startsWith("mailto:")) {
            email = href.replace("mailto:", "");
          }
        }
      }

      return (
        <Contact {...props} key={nanoid()}>
          <ContactName key="name">{name}</ContactName>
          <ContactTitle key="title">{title}</ContactTitle>
          <ContactPhone key="phone" number={phone} extension={extension}></ContactPhone>
          <ContactEmail key="email" email={email} />
        </Contact>
      );
    },
  },
  // Author
  {
    shouldProcessNode: (node, props) => (props.className as string)?.includes("author"),
    processNode: (node, props, children) => {
      return (
        <Fragment key={nanoid()}>
          <div className="mt-4"></div>
          <Info>
            {React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type !== "br")}
          </Info>
        </Fragment>
      );
    },
  },
  // Links
  {
    shouldProcessNode: (node, props) => node.tagName === "a" && typeof props.href === "string",
    processNode: (node, props, children) => {
      if (props.href === "") {
        return <></>;
      }

      const href = props.href as string;

      // Check if the link is a button by looking for the "btn" class or "btn-*" class
      const className = (props.className as string) ?? "";
      const isButton = className.includes("btn");

      if (isButton) {
        const outlined = className.includes("btn-outline");
        let color: ButtonProps["color"];
        const classes = twMerge("mr-2", className);

        switch (className.match(/btn-(?:outline-)?(\w*)/)?.[1]) {
          case "primary":
            color = "red";
            break;
          case "secondary":
            color = "black";
            break;
          case "info":
            color = "blue";
            break;
          case "success":
            color = "green";
            break;
          case "warning":
            color = "yellow";
            break;
          case "danger":
            color = "red";
            break;
          case "light":
            color = "yellow";
            break;
          case "dark":
            color = "black";
            break;
        }

        return (
          <Button
            {...props}
            key={nanoid()}
            className={classes}
            color={color ?? "red"}
            outlined={outlined}
            href={href}
            as={NextLink}
          >
            {children}
          </Button>
        );
      }

      return (
        <Link {...props} key={nanoid()} href={href} as={NextLink}>
          {children}
        </Link>
      );
    },
  },
  // Font Awesome Icons
  {
    shouldProcessNode: (node, props) => {
      if (node.tagName !== "i") {
        return false;
      }

      const className = (props.className as string) ?? "";

      // Match against Font Awesome classes like fas or fa-solid
      return /\b(fa[srlbdt]?|fa-[a-z0-9-]+)\b/g.test(className);
    },
    processNode: (node, props, children) => {
      // Font Awesome's library adds aria-hidden automatically on the client side, but this causes a hydration error because React doesn't see that aria-hidden on the server side rendered code. So adding it here should fix that error
      return (
        <i {...props} key={nanoid()} aria-hidden="true">
          {children}
        </i>
      );
    },
  },
  // Remove <em> around <i>
  {
    shouldProcessNode: (node, props, children) => {
      if (node.tagName !== "em") {
        return false;
      }

      return React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === "i");
    },
    processNode: (node, props, children, index) => {
      return <Fragment key={nanoid()}>{children}</Fragment>;
    },
  },
  // Headings
  {
    shouldProcessNode: (node) => {
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
    processNode: (node, props, children, index) => {
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
          {React.Children.map(children, (child) => {
            // Remove strong tags from headings
            if (typeof child !== "string" && child.type === "strong") {
              return child.props.children;
            }

            return child;
          })}
        </Typography>
      );
    },
  },
  // Paragraphs
  {
    shouldProcessNode: (node) => node.tagName === "p",
    processNode: (node, props, children, index) => {
      const className = typeof props.className === "string" ? props.className : "";

      const hasInvalidChildren = React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) {
          return false;
        }

        switch (child.type) {
          case "figure":
            return true;
          default:
            return false;
        }
      });

      if (hasInvalidChildren) {
        return <Fragment key={nanoid()}>{children}</Fragment>;
      }

      return (
        <Typography {...props} key={nanoid()} type="body" as="p" className={twMerge(index === 0 && "mt-0", className)}>
          {children}
        </Typography>
      );
    },
  },
  // Lists
  {
    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
    processNode: (node, props, children, index) => {
      return (
        <List {...props} key={nanoid()} as={node.tagName as "ul" | "ol"}>
          {children}
        </List>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "li",
    processNode: (node, props, children, index) => {
      return (
        <ListItem {...props} key={nanoid()}>
          {children}
        </ListItem>
      );
    },
  },
  // Divider
  {
    shouldProcessNode: (node) => node.tagName === "hr",
    processNode: (node) => <Divider key={nanoid()} />,
  },
  // Figure
  {
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
  },
  // Images
  {
    shouldProcessNode: (node) => node.tagName === "img",
    processNode: (node, props) => {
      const className = typeof props.className === "string" ? props.className : "";
      const classes = twMerge(
        "my-4",
        (className.includes("align-left") || props["data-align"] === "left") && "float-left mr-4 ml-0",
        (className.includes("align-right") || props["data-align"] === "right") && "float-right ml-4 mr-0",
        props.className as string
      );

      const src = (props.src as string).startsWith("/sites/default/files")
        ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${props.src}`
        : (props.src as string);

      return (
        <figure className="my-4" key={nanoid()}>
          <Image {...props} src={src} loading="lazy" alt={(props.alt as string) ?? ""} className={classes} />

          {props["data-caption"] && (
            <figcaption className="text-sm text-body-copy-on-light mt-2">{props["data-caption"]}</figcaption>
          )}
        </figure>
      );
    },
  },
  // Scripts
  {
    shouldProcessNode: (node) => node.tagName === "script",
    processNode: (node, props, children, index) => {
      return <Script key={nanoid()} src={props.src as string} type={props.type as string} strategy="lazyOnload" />;
    },
  },
];

export function HtmlParser({ html, instructions = [] }: { html: string; instructions?: ParserInstruction[] }) {
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
          if (instruction.shouldProcessNode(node, props, children, index)) {
            return instruction.processNode(node, props, children, index, (children) =>
              domToReact(children as DOMNode[], options)
            );
          }
        }

        // Fallback renderer for nodes that are self-closing and as a result cannot have children passed to them
        if (selfClosingTags.has(node.tagName)) {
          return <node.name {...props} key={nanoid()} />;
        }

        // Fallback renderer for nodes that can have children passed to them
        return (
          // @ts-ignore
          <node.name {...props} key={nanoid()}>
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
