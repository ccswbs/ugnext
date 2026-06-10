"use client";

import { createPortal } from "react-dom";
import { Button } from "@uoguelph/react-components/button";
import { useEffect, useState } from "react";
import { getCacheTag } from "@/data/drupal/linked-revalidation";

export function DraftModeSiteButton({
  primaryNavigation,
}: {
  primaryNavigation: { __typename: string; id: string; name: string };
}) {
  const [containerExists, setContainerExists] = useState<boolean>(false);

  useEffect(() => {
    setContainerExists(Boolean(document.getElementById("uofg-draft-mode-banner-extra-buttons")));
  }, []);

  return (
    <>
      {containerExists &&
        createPortal(
          <Button color="yellow" className="p-2" href={`/api/revalidate?tags=${getCacheTag(primaryNavigation)}`} as="a">
            Rebuild Site
          </Button>,
          // @ts-expect-error We check the element exists in the useEffect, so this will never be null but TypeScript doesn't know that
          document.getElementById("uofg-draft-mode-banner-extra-buttons")
        )}
    </>
  );
}
