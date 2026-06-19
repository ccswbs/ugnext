"use client";

import { Button } from "@uoguelph/react-components/button";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@uoguelph/react-components/toaster";

export function DraftModeBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [shareableLink, setSharableLink] = useState("");
  const [revalidating, setRevalidating] = useState(false);

  useEffect(() => {
    if (searchParams.get("secret")) {
      setSharableLink(`${window.location.origin}/api/draft/?${searchParams.toString()}`);
    }
  }, []);

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

  const copyShareableLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard! NOTE: This link will expire after some time.");
    } catch (err) {
      toast.error("Failed to copy link to clipboard. Try again later.");
    }
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
        <Button color="yellow" className="p-2" onClick={copyShareableLinkToClipboard} as="button">
          Copy Temporary Link
        </Button>
      )}
    </div>
  );
}
