import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { HtmlParser } from "@/components/html-parser";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { Sidebar } from "@/components/programs/undergraduate/sidebar";
import { getUndergraduateRequirements, slugToUndergraduateRequirements } from "@/data/yaml/programs/undergraduate";
import { List, ListItem } from "@/components/list";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const parsed = await slugToUndergraduateRequirements(context.params.slug);

  if (!parsed) {
    return {
      notFound: true,
    };
  }

  const { title, content } = await getUndergraduateRequirements(parsed.studentType, parsed.location, parsed.program);

  return {
    props: {
      title: title,
      content: content,
    },
  };
}

export default function UndergraduateAdmissionRequirements({ title, content }) {
  console.log(content);

  return (
    <Layout title={title || "Undergraduate Admission Requirements"}>
      <Container centered>
        <Section
          primary={
            <>
              <Heading level={1}>{title || "Undergraduate Admission Requirements"}</Heading>

              <div className="flex flex-col">
                {content?.map((section) => (
                  <div key={section.id}>
                    <Heading level={3} as="h2">
                      {section.title}
                    </Heading>

                    {Array.isArray(section.content) ? (
                      <List>
                        {section.content.map((item, index) => (
                          <ListItem key={index}>{item}</ListItem>
                        ))}
                      </List>
                    ) : (
                      <p>{section.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          }
          secondary={
            <div className="flex flex-col gap-2 w-full px-4 mt-4">
              <Button
                className="flex items-center justify-start gap-4 w-full"
                href="/programs/undergraduate/requirements"
                color="red"
              >
                <FontAwesomeIcon className="text-2xl" icon={faArrowLeftToBracket} />
                <span className="font-bold">View Other Requirements</span>
              </Button>

              <Sidebar />
            </div>
          }
        />
      </Container>
    </Layout>
  );
}
