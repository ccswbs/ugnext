"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Button } from "@uoguelph/react-components/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
        <Typography type="h1" as="h1" className="block!">
          Something went wrong.
        </Typography>

        <Button onClick={() => reset()}>Try again</Button>
      </LayoutContent>
      <Footer></Footer>
    </Layout>
  );
}
