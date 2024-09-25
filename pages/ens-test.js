import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";

export default function EnsTest() {
  return (
    <Layout>
      <Container centered>
        <Heading level={1}>App Armor Alert Test Page</Heading>

        <Button
          color="red"
          onClick={() => {
            window.sessionStorage.removeItem("app-armor-alert-use-dismissible-hash");
            location.reload();
          }}
        >
          Clear Storage (Enables alert if it was dismissed)
        </Button>
      </Container>
    </Layout>
  );
}
