import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";

export default function AppArmorTest() {
  return (
    <Layout metadata={{ title: "App Armor Alert Test Page" }}>
      <Container centered>
        <Heading level={1}>App Armor Alert Test Page</Heading>
      </Container>
    </Layout>
  );
}
