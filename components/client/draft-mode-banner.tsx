"use client";

import { Button } from "@uoguelph/react-components/button";
import { usePathname } from "next/navigation";

export function DraftModeBanner() {
  const pathname = usePathname();
  const searchParams = new URLSearchParams(window.location.search);
  const shareableLink = `${window.location.origin}${pathname}?${searchParams.toString()}`;

  return (
    <div className="sticky left-0 top-0 z-1000 flex h-fit w-full items-center justify-center gap-2 bg-red p-2 text-center text-base font-bold text-white">
      <span>You are currently in Draft Mode.</span>

      <Button color="yellow" className="p-2" href="/api/disable-draft" as="a">
        Disable Draft Mode
      </Button>

      <Button color="yellow" className="p-2" href={`/api/revalidate?path=${pathname}`} as="a">
        Revalidate Page
      </Button>

      <Button color="yellow" className="p-2" href={shareableLink} as="a">
        Share Page
      </Button>
    </div>
  );
}
