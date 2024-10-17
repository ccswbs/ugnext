import { Layout } from "@/components/layout";
import { Container } from "@/components/container";

export default function ServerError() {
  return (
    <Layout metadata={{ title: "500: Internal Server Error" }}>
      <Container centered>
        <h1>HTTP 500 — Internal Server Error</h1>
      </Container>
    </Layout>
  );
}
