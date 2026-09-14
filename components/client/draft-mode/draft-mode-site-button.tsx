"use client";

import { createPortal } from "react-dom";
import { Button } from "@uoguelph/react-components/button";
import { useEffect, useState } from "react";
import { getCacheTag } from "@/data/drupal/linked-revalidation";
import { toast } from "@uoguelph/react-components/toaster";

export function DraftModeSiteButton({
  primaryNavigation,
}: {
  primaryNavigation: { __typename: string; id: string; name: string };
}) {
  const [containerExists, setContainerExists] = useState<boolean>(false);
  const [revalidating, setRevalidating] = useState(false);
  const tag = getCacheTag(primaryNavigation);

  const revalidatePage = async () => {
    setRevalidating(true);
    const res = await fetch(`/api/revalidate?tags=${tag}`);

    if (res.ok) {
      toast.success(`Rebuilt all ${primaryNavigation.name} pages successfully!`);
    } else {
      toast.error("Failed to rebuild pages.");
    }

    setRevalidating(false);
  };

  useEffect(() => {
    setContainerExists(Boolean(document.getElementById("uofg-draft-mode-banner-extra-buttons")));
  }, []);

  return (
    <>
      {containerExists &&
        createPortal(
          <Button color="yellow" className="p-2" onClick={revalidatePage} disabled={revalidating} as="button">
            Rebuild All {primaryNavigation.name} Pages
          </Button>,
          // @ts-expect-error We check the element exists in the useEffect, so this will never be null but TypeScript doesn't know that
          document.getElementById("uofg-draft-mode-banner-extra-buttons")
        )}
    </>
  );
}
