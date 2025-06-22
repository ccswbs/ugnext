import Link from "next/link";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function NotFound() {
  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
        <Typography type="h1" as="h1" className="block!">
          HTTP 404 — File not found sdfsdf
        </Typography>

        <Typography type="h2" as="h2" className="block!">
          Possible reasons for this error:
        </Typography>

        <List as="ol">
          <ListItem>
            You have clicked on an out-of-date bookmark. Once you find the correct page, please update your bookmark to
            avoid this error in the future.
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
            <Link href="https://www.uoguelph.ca/search">Search on the University of Guelph</Link>
          </ListItem>
        </List>
      </LayoutContent>
      <Footer></Footer>
    </Layout>
  );
}
