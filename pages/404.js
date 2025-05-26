import Head from "next/head";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { useEffect, useState } from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { Link } from "@uoguelph/react-components/link";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";

export default function NotFound() {
  const [searchLink, setSearchLink] = useState("https://www.uoguelph.ca/search");

  useEffect(() => {
    setSearchLink("https://www.uoguelph.ca/search/#gsc.tab=0&gsc.q=" + window.location.pathname);
  }, []);

  return (
    <>
      <Head>
        <title>HTTP 404 — File not found</title>
      </Head>

      <Header></Header>

      <Layout>
        <LayoutContent>
          <Typography type="h1" as="h1" className="block!">
            HTTP 404 — File not found
          </Typography>

          <Typography type="h2" as="h2" className="block!">
            Possible reasons for this error:
          </Typography>

          <List as="ol">
            <ListItem>
              You have clicked on an out-of-date bookmark. Once you find the correct page, please update your bookmark
              to avoid this error in the future.
            </ListItem>

            <ListItem>
              You have mis-typed the web address into the URL bar. Please check your spelling of the URL.
            </ListItem>

            <ListItem>
              The search engine has an out-of-date listing for this page -{" "}
              <Link href="mailto:ithelp@uoguelph.ca">please let us know!</Link>
            </ListItem>

            <ListItem>
              The university has removed this page (either on purpose or by mistake) -{" "}
              <Link href="mailto:ithelp@uoguelph.ca">please let us know!</Link>
            </ListItem>
          </List>

          <Typography type="h2" as="h2" className="block!">
            Try one of these links instead:
          </Typography>

          <List as="ul">
            <ListItem>
              <Link href="https://www.uoguelph.ca/">Go to the University of Guelph Home Page</Link>
            </ListItem>
            <ListItem>
              <Link href={searchLink}>Search on the University of Guelph</Link>
            </ListItem>
          </List>
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
