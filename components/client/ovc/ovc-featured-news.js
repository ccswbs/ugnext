"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Divider } from "@uoguelph/react-components/divider";
import { Button } from "@uoguelph/react-components/button";
import { UnstyledLink } from "@/components/client/unstyled-link";

export function OVCFeaturedNews() {
  return (
    <div className="pb-7">
      <Typography type="h2" as="h2" className="font-condensed">
        Featured OVC News
        <Divider />
      </Typography>
      <div className="pt-4">
        <Button as={UnstyledLink} href="/ovc/news/" color="red" className="py-2 px-4 mx-[.25em] text-2xl">
          OVC News Hub
        </Button>
        <Divider />
      </div>
    </div>
  );
}
