"use client";

import React from "react";
import { cloneElement, Fragment, isValidElement, useMemo } from "react";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { Link } from "@uoguelph/react-components/link";
import { Contact, ContactTitle, ContactName, ContactPhone, ContactEmail } from "@uoguelph/react-components/contact";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Divider } from "@uoguelph/react-components/divider";
import { Typography } from "@uoguelph/react-components/typography";
import { Button } from "@uoguelph/react-components/button";
import { Info } from "@uoguelph/react-components/info";
import Image from "next/image";
import Script from "next/script";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

const getImageUrl = (src) => {
  if (src.startsWith("/sites/default/files")) {
    return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${src}`;
  }
  return src;
};

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const parser = new Parser();
export const DEFAULT_PROCESSOR = new ProcessNodeDefinitions().processDefaultNode;
export const CATCHALL_INSTRUCTION = {
  shouldProcessNode: () => true,
  processNode: DEFAULT_PROCESSOR,
};

export const DEFAULT_INSTRUCTIONS = [
  // vcard
  {
    shouldProcessNode: (node) => node.attribs?.class?.includes("vcard"),
    processNode: (node, children) => {
      const name = node.children[0].children[0].data;
      const title = node?.children[2]?.data;
      const phone = node?.children?.find((child) => child.attribs?.href?.includes("tel:"));
      const number = phone?.children?.[0]?.data;
      const extension = phone?.next?.data?.replaceAll(/[^0-9]/g, "");
      const email = node?.children?.find((child) => child.attribs?.href?.includes("mailto:"))?.children[0]?.data;

      return (
        <Contact key={nanoid()} className={node.attribs.class}>
          <ContactName>{name}</ContactName>
          <ContactTitle>{title}</ContactTitle>
          <ContactPhone number={number} extension={extension}></ContactPhone>
          <ContactEmail email={email} />
        </Contact>
      );
    },
  },
  // Author
  {
    shouldProcessNode: (node) => node.attribs?.class?.includes("author"),
    processNode: (node, children) => {
      return (
        <Fragment key={nanoid()}>
          <div className="mt-4"></div>
          <Info>{children.filter((child) => child?.type !== "br")}</Info>
        </Fragment>
      );
    },
  },
  // h1, h2, ... h6 tags
  {
    shouldProcessNode: (node, index) => headingTags.has(node.tagName),
    processNode: (node, children, index) => {
      // Remove <strong> tags inside heading tags
      const clean = children.map((child) => {
        if (child && child.type === "strong" && child.props && child.props.children) {
          // Unwrap <strong> by returning its children
          return child.props.children;
        }
        return child;
      });

      // Add "mt-0" if this heading is the first child
      const className = twMerge(
        node.attribs.class,
        index === 0 ? "!mt-0" : ""
      );

      return (
        <Typography key={nanoid()} className={className} type={node.tagName} as={node.tagName}>
          {clean}
        </Typography>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "p",
    processNode: (node, children) => {
      return (
        <Typography key={nanoid()} className={node.attribs.class} type="body" as="p">
          {children}
        </Typography>
      );
    },
  },
  // Remove <em> around <i>
  {
    shouldProcessNode: (node) =>
      node.name === "em" &&
      node.children?.length === 1 &&
      node.children[0].name === "i" &&
      node.children[0].attribs?.class?.includes("fa-"),
    processNode: (node, children, index) => {
      return React.cloneElement(children[0], { key: index });
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "br",
    processNode: (node) => <></>,
  },
  // Links and Buttons
  {
    shouldProcessNode: (node) => node.tagName === "a" && typeof node.attribs?.href === "string",
    processNode: (node, children) => {
      // Check if the link is a button by looking for the "btn" class or "btn-*" class
      const isButton = node.attribs.class?.includes("btn");

      if (isButton) {
        const type = node.attribs.class?.match(/btn-(?:outline-)?(\w*)/)?.[1];
        const map = {
          primary: "red",
          secondary: "black",
          info: "blue",
          success: "green",
          warning: "yellow",
          danger: "red",
          light: "yellow",
          dark: "black",
        };

        const outlined = node.attribs.class?.includes("btn-outline");

        return (
          <Button
            key={nanoid()}
            id={node.attribs.id}
            href={node.attribs?.href ?? ""}
            color={map[type] ?? "red"}
            outlined={outlined}
            as="a"
          >
            {children}
          </Button>
        );
      }

      return (
        <Link key={nanoid()} id={node.attribs.id} href={node.attribs?.href ?? ""}>
          {children}
        </Link>
      );
    },
  },
  // Lists
  {
    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
    processNode: (node, children) => {
      return (
        <List key={nanoid()} className={node.attribs.class} as={node.tagName}>
          {children
            .filter((child) => child.type === "li")
            .map((child, index) => (
              <ListItem key={index}>
                <Typography key={nanoid()} type="body">{child.props.children}</Typography>
              </ListItem>
            ))}
        </List>
      );
    },
  },
  // Divider
  {
    shouldProcessNode: (node) => node.tagName === "hr",
    processNode: (node) => <Divider />,
  },
  // Images
  {
    shouldProcessNode: (node) =>
      node.tagName === "img" && node.attribs.src && node.attribs.width && node.attribs.height,
    processNode: (node, _, index) => {
      // Convert Bootstrap alignment classes to Tailwind equivalents
      let imageClass = node.attribs.class || "";
      imageClass = imageClass
        .replace("align-left", "float-left mr-4") // Convert `align-left` to `float-left` with margin
        .replace("align-right", "float-right ml-4"); // Convert `align-right` to `float-right` with margin
      // Handle `data-align` attributes

      // Remove the `class` attribute and any inline styles
      delete node?.attribs?.class;

      // Check for caption (data-caption or figcaption)
      const caption = node.attribs["data-caption"] ? (
        <figcaption className="text-sm text-gray-600 mt-2">{node.attribs["data-caption"]}</figcaption>
      ) : null;

      // Prepend the base URL to relative paths to prevent broken image links on Netlify
      const src = getImageUrl(node.attribs.src);

      // If caption exists, wrap in <figure>, otherwise return just the <Image>
      if (caption) {
        return (
          <figure className="my-4">
            <Image
              src={src}
              alt={node.attribs.alt ?? null}
              loading="lazy"
              className={imageClass} // Use the updated className
              width={node.attribs.width}
              height={node.attribs.height}
            />
            {caption}
          </figure>
        );
      }
      // Return just the <Image> if no caption exists
      return (
        <Image
          key={index}
          src={src}
          alt={node.attribs.alt ?? null}
          loading="lazy"
          className={imageClass} // Use the updated className
          width={node.attribs.width}
          height={node.attribs.height}
        />
      );
    },
  },
  // Figure
  {
    shouldProcessNode: (node) => node.tagName === "figure",
    processNode: (node, children) => {
      // Extract alignment classes from the `class` attribute or `data-align`
      let figureClass = "my-4"; // Default margin for figures
      if (node.attribs?.class?.includes("align-left") || node.attribs["data-align"] === "left") {
        figureClass = "float-left mr-4";
      } else if (node.attribs?.class?.includes("align-right") || node.attribs["data-align"] === "right") {
        figureClass = "float-right ml-4";
      }

      // Remove inline styles
      delete node?.attribs?.style;

      // Return the <figure> element with processed children
      return <figure className={figureClass}>{children}</figure>;
    },
  },
  // Scripts
  {
    shouldProcessNode: (node) => node.tagName === "script",
    processNode: (node) => <Script src={node.attribs.src} type={node.attribs.type} strategy="lazyOnload" />,
  },
  // Fallback
  {
    shouldProcessNode: () => true,
    processNode: (node, children) => {
      // Remove inline styles because Next.js doesn't like when they're present
      node.attribs ??= {};
      delete node.attribs?.style;
      node.attribs.key = nanoid();

      return DEFAULT_PROCESSOR(
        node,
        children.map((child, index) => {
          return isValidElement(child) ? cloneElement(child, { key: index }) : child;
        })
      );
    },
  },
];

/**
 * Parses an HTML string into React nodes.
 */
export const HtmlParser = ({ html, instructions }) => {
  const parsed = useMemo(() => {
    const parsed = parser.parseWithInstructions(
      html,
      () => true,
      Array.isArray(instructions) ? [...instructions, CATCHALL_INSTRUCTION] : DEFAULT_INSTRUCTIONS
    );

    if (Array.isArray(parsed)) {
      return parsed.map((child) => {
        return isValidElement(child) ? cloneElement(child, { key: nanoid() }) : child;
      });
    }

    return parsed;
  }, [html, instructions]);

  return <>{parsed}</>;
};

HtmlParser.propTypes = {
  html: PropTypes.string.isRequired,
  /**
   * Custom parsing instructions
   */
  instructions: PropTypes.arrayOf(
    PropTypes.shape({
      shouldProcessNode: PropTypes.func.isRequired,
      processNode: PropTypes.func.isRequired,
    })
  ),
};
