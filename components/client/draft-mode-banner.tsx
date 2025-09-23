"use client";

import { Button } from "@uoguelph/react-components/button";
import { usePathname } from "next/navigation";

export function DraftModeBanner() {
  const pathname = usePathname();
  return (
    <div className="sticky left-0 top-0 z-20 flex h-fit w-full items-center justify-center gap-2 bg-red p-2 text-center text-base font-bold text-white">
      <span>You are currently in Draft Mode.</span>

      <Button color="yellow" className="p-2" href="/api/disable-draft" as="a">
        Disable Draft Mode
      </Button>

      <Button color="yellow" className="p-2" href={`/api/revalidate?path=${pathname}`} as="a">
        Revalidate Page
      </Button>
    </div>
  );
}
