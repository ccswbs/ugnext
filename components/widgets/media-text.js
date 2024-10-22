import { twJoin } from "tailwind-merge";
import { extractVideoID, computeLayoutMediaText, buttonStyle } from "@/lib/ug-utils";
import Image from "next/image";
import { Heading } from "@/components/heading";
import { EmbeddedVideo } from "@/components/embedded-video";
import { HtmlParser } from "@/components/html-parser";
import { ButtonSection } from "@/components/widgets/button-section";
import ConditionalWrap from "conditional-wrap";

export const MediaText = ({ data }) => {
  console.log(data);

  return <div></div>;
};
