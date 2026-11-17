"use client";

import { Button } from "@uoguelph/react-components/button";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@uoguelph/react-components/toaster";

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function DraftModeBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [revalidating, setRevalidating] = useState(false);
  const [shareableLink, setSharableLink] = useState("");

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

  useEffect(() => {
    if (searchParams.get("secret")) {
      setSharableLink(`${window.location.origin}/api/draft/?${searchParams.toString()}`);
    }
  }, [searchParams]);

  const copyShareableLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard! This link will expire after some time.", 5000);
    } catch (err) {
      if (isInIframe()) {
        toast.error(
          "Failed to copy link to clipboard as you are in an iframe. Please click the purple view button to view the page outside of the iframe and try again.",
          20000
        );
      } else {
        toast.error("Failed to copy link to clipboard as your browser does not support clipboard access.", 5000);
      }
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
