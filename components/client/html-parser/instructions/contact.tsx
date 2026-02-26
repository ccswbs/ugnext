import { extractTextFromDOMNode, HTMLParserInstruction, isElement } from "../index";
import React from "react";
import { type DOMNode, Element } from "html-react-parser";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import { nanoid } from "nanoid";

export const ContactInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props) => {
    const className = (props.className as string) ?? "";
    return className.includes("vcard");
  },
  processNode: (node, props) => {
    // Helper function to recursively extract information from DOM nodes
    const extractVcardInfo = (
      domNode: Element
    ): {
      name: string;
      title: string;
      phone: string;
      extension: string;
      email: string;
    } => {
      let name = "",
        title = "",
        phone = "",
        extension = "",
        email = "";

      const processNode = (node: DOMNode) => {
        if (isElement(node)) {
          const className = (node.attribs?.class as string) ?? "";

          // Extract name from .fn class or strong tags
          if (className.includes("fn") || node.tagName === "strong") {
            const nameText = extractTextFromDOMNode(node);
            if (nameText && !name) {
              name = nameText;
            }
          }

          // Extract title from .org class
          if (className.includes("org")) {
            const titleText = extractTextFromDOMNode(node);
            if (titleText && !title) {
              title = titleText;
            }
          }

          // Extract links (phone and email)
          if (node.tagName === "a" && typeof node.attribs?.href === "string") {
            const href = node.attribs.href;

            if (href.startsWith("tel:")) {
              const tokens = href.replace("tel:", "").split(/[;p]/);
              phone = tokens[0];
              extension = tokens[1] || "";
            } else if (href.startsWith("mailto:")) {
              email = href.replace("mailto:", "");
            }
          }

          // Recursively process children
          if (node.children) {
            node.children.forEach((child: any) => processNode(child));
          }
        } else if (
          node?.type === "text" &&
          node.data &&
          node.data.trim().length > 2 &&
          !title &&
          !node.data.includes("@")
        ) {
          // Extract title from direct text content (but not email addresses)
          const trimmedText = node.data.trim();
          if (trimmedText && !name.includes(trimmedText)) {
            title = trimmedText;
          }
        }
      };

      // Process all children of the vcard node
      if (domNode.children) {
        domNode.children.forEach((child) => processNode(child));
      }

      return { name, title, phone, extension, email };
    };

    const { name, title, phone, extension, email } = extractVcardInfo(node);

    return (
      <Contact {...props} key={nanoid()}>
        {name && <ContactName key="name">{name}</ContactName>}
        {title && <ContactTitle key="title">{title}</ContactTitle>}
        {phone && <ContactPhone key="phone" number={phone} extension={extension}></ContactPhone>}
        {email && <ContactEmail key="email" email={email} />}
      </Contact>
    );
  },
};
