"use client";

import { Button } from "@uoguelph/react-components/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "@uoguelph/react-components/toaster";

export function DraftModeBanner() {
  const pathname = usePathname();
  const searchParams = new URLSearchParams(window.location.search);
  const shareableLink = searchParams.get("secret")
    ? `${window.location.origin}/api/draft/?${searchParams.toString()}`
    : null;
  const [revalidating, setRevalidating] = useState(false);

  const revalidatePage = async () => {
    setRevalidating(true);
    const res = await fetch(`/api/revalidate?path=${pathname}`);

    if (res.ok) {
      toast.success("Page rebuilt successfully!");
    } else {
      toast.error("Failed to rebuild page.");
    }

    setRevalidating(false);
  };

  return (
    <div className="sticky left-0 top-0 z-1000 flex h-fit w-full items-center justify-center gap-2 bg-red p-2 text-center text-base font-bold text-white">
      <span className="mr-auto">You are currently in Draft Mode.</span>

      <Button color="yellow" className="p-2" href={`/api/disable-draft?path=${pathname}`} as="a">
        Disable Draft Mode
      </Button>

      <Button color="yellow" className="p-2" onClick={revalidatePage} disabled={revalidating} as="button">
        Rebuild Page
      </Button>

      <div id="uofg-draft-mode-banner-extra-buttons" className="contents"></div>

      {shareableLink && (
        <Button
          color="yellow"
          className="p-2"
          onClick={() => {
            navigator.clipboard.writeText(shareableLink).catch((err) => {
              console.error("Failed to copy text: ", err);
            });
          }}
          as="button"
        >
          Copy Shareable Link
        </Button>
      )}
    </div>
  );
}
