import { Fragment, useMemo } from "react";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { Link } from "@uoguelph/react-components/link";
import { Contact, ContactTitle, ContactName, ContactPhone, ContactEmail } from "@uoguelph/react-components/contact";
import { List, ListItem } from "@/components/list";
import { Divider } from "@uoguelph/react-components/divider";
import { Typography } from "@uoguelph/react-components/typography";
import { Button } from "@uoguelph/react-components/button";
import { Info } from "@uoguelph/react-components/info";
import Image from "next/image";
import Script from "next/script";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const parser = new Parser();
export const DEFAULT_PROCESSOR = new ProcessNodeDefinitions().processDefaultNode;
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
        <Contact className={node.attribs.class}>
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
      console.log(children);
      return (
        <>
          <div className="mt-4"></div>
          <Info>{children.filter((child) => child?.type !== "br")}</Info>
        </>
      );
    },
  },
  // h1, h2, ... h6 tags
  {
    shouldProcessNode: (node) => headingTags.has(node.tagName),
    processNode: (node, children) => {
      return (
        <Typography className={node.attribs.class} type={node.tagName} as={node.tagName}>
          {children}
        </Typography>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "p",
    processNode: (node, children) => {
      return (
        <Typography className={node.attribs.class} type="body" as="p">
          {children}
        </Typography>
      );
    },
  },
  // Links
  {
    shouldProcessNode: (node) => node.tagName === "a" && typeof node.attribs?.href === "string",
    processNode: (node, children) => {
      // Check if the link is a button by looking for the "btn" class or "btn-*" class
      const isButton = node.attribs.className?.includes("btn");

      if (isButton) {
        const type = node.attribs.className?.match(/btn-(?:outline-)?(\w*)/)?.[1];
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

        const outlined = node.attribs.className?.includes("btn-outline");

        return (
          <Button
            id={node.attribs.id}
            className={node.attribs.class}
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
        <Link id={node.attribs.id} className={node.attribs.class} href={node.attribs?.href ?? ""}>
          {children}
        </Link>
      );
    },
  },
  // Lists
  {
    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
    processNode: (node, children) => {
      node.attribs.className = node.attribs.class;
      delete node.attribs.class;
      delete node?.attribs?.style;

      return (
        <List {...node.attribs} variant={node.tagName === "ol" ? "ordered" : "unordered"}>
          {children
            .filter((child) => child.type === "li")
            .map((child, index) => (
              <ListItem key={index}>{child.props.children}</ListItem>
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
    processNode: (node) => {
      delete node?.attribs?.style;

      return (
        <Image
          src={node.attribs.src}
          alt={node.attribs.alt ?? null}
          loading="lazy"
          className={node.attribs.class}
          width={node.attribs.width}
          height={node.attribs.height}
        />
      );
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
      delete node?.attribs?.style;

      return DEFAULT_PROCESSOR(node, children);
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
      Array.isArray(instructions)
        ? [
            ...instructions,
            {
              shouldProcessNode: () => true,
              processNode: DEFAULT_PROCESSOR,
            },
          ]
        : DEFAULT_INSTRUCTIONS
    );

    if (Array.isArray(parsed)) {
      return parsed.map((child) => {
        if (typeof child === "object") {
          return <Fragment key={nanoid()}>{child}</Fragment>;
        }

        return child;
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
