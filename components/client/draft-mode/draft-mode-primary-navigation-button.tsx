"use client";

import { createPortal } from "react-dom";
import { Button } from "@uoguelph/react-components/button";
import { useEffect, useState } from "react";

export function DraftModePrimaryNavigationButton({
  primaryNavigation,
}: {
  primaryNavigation: { id: string; name: string };
}) {
  const [idExists, setIdExists] = useState<boolean>(false);

  useEffect(() => {
    setIdExists(Boolean(document.getElementById("uofg-draft-mode-banner-extra-buttons")));
  }, []);

  return (
    <>
      {idExists &&
        createPortal(
          <Button
            color="yellow"
            className="p-2"
            href={`/api/revalidate?tag=TermPrimaryNavigation-ID-${primaryNavigation.id}`}
            as="a"
          >
            Revalidate All {primaryNavigation.name} Pages
          </Button>,
          // @ts-expect-error We check the element exists in the useEffect, so this will never be null but TypeScript doesn't know that
          document.getElementById("uofg-draft-mode-banner-extra-buttons")
        )}
    </>
  );
}
