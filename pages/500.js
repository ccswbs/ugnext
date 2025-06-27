import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { Typography } from "@uoguelph/react-components/typography";
import { Link } from "@uoguelph/react-components/link";
import { Footer } from "@uoguelph/react-components/footer";

export default function ServerError() {
  return (
    <Layout>
      <Meta
        title="500 Internal Server Error | University of Guelph"
        description="We are experiencing technical difficulties. Please try again later."
      />

      <Header></Header>

      <LayoutContent>
        <Typography type="h1" as="h1" className="block!">
          HTTP 500 — Internal Server Error
        </Typography>

        <Typography type="body" as="span" className="block!">
          An error occurred on our end. Please try again later or{" "}
          <Link href="mailto:ithelp@uoguelph.ca">send us an email.</Link>.
        </Typography>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
