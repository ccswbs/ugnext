import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { HtmlParser } from "@/components/html-parser";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  return {
    props: {
      title: "Test",
      content: "<div>test</div>",
    },
  };
}

export default function UndergraduateAdmissionRequirements({ title, content }) {
  return (
    <Layout title={title || "Undergraduate Admission Requirements"}>
      <Container centered>
        <Heading level={1}>{title || "Undergraduate Admission Requirements"}</Heading>

        <Button className="flex gap-2 w-fit" color="red" href="/programs/undergraduate/requirements/">
          <FontAwesomeIcon icon={faArrowLeftToBracket} />
          <span>View Other Requirements</span>
        </Button>

        <div className="flex flex-col [&_p]:py-2 py-6">
          <HtmlParser html={content ?? ""} />
        </div>
      </Container>
    </Layout>
  );
}
