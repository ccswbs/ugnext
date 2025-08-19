"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Divider } from "@uoguelph/react-components/divider";
import { Button } from "@uoguelph/react-components/button";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import { Link } from "@uoguelph/react-components/link";
import NextLink from "next/link";

function FeaturedNewsArticle({ data, index }) {
  const date = new Date(data.created.time);

  return (
    <div
      key={index}
      className={twMerge(
        "tile overflow-hidden shadow-lg",
        index === 0 ? "row-span-2" : "grid grid-cols-1 lg:grid-cols-2 gap-4"
      )}
    >
      {/* Image Section */}
      <div className="relative">
        <Image
          src={data?.heroImage?.image?.url || defaultImage.src}
          width={data?.heroImage?.image?.width || defaultImage.width}
          height={data?.heroImage?.image?.height || defaultImage.height}
          blurred={data?.heroImage?.image?.blurDataURL || defaultImage.blurDataURL}
          alt={data?.heroImage?.image?.alt || "OVC Front Entrance"}
          className="object-cover md:aspect-[9/4] h-full w-full"
        />
      </div>

      {/* Text Section */}
      <div className="p-4">
        <Typography type={"h5"} as={"h3"} className={twMerge("mt-0 text-lg", index === 0 ? "text-dark" : "")}>
          <Link href={`/ovc/news/node/${data.id}`}>{data?.title}</Link>
        </Typography>
        <Typography type="body">
          {date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </Typography>
      </div>
    </div>
  );
}

export function OVCFeaturedNews({ articles = [] }) {
  return (
    <div className="pb-7">
      <Typography type="h2" as="h2" className="font-condensed">
        Featured OVC News
        <Divider />
      </Typography>
      <div className="m-auto grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-1 lg:grid-cols-2 pb-4">
        {articles.map((article, index) => (
          <FeaturedNewsArticle data={article} index={index} key={index} />
        ))}
      </div>
      <Button as={NextLink} href="/ovc/news/" color="red" className="py-2 px-4 mx-[.25em] text-2xl">
        OVC News Hub
      </Button>
      <Divider />
    </div>
  );
}
