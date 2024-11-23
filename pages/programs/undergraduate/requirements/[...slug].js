import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { HtmlParser } from "@/components/html-parser";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { Sidebar } from "@/components/programs/undergraduate/sidebar";
import path from "path";
import { getAdmissionLocations, getDegrees, getPrograms, getStudentTypes } from "@/data/yaml/programs";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");
  const slug = context.params.slug;
  const programs = await getPrograms(directory);
  const degrees = await getDegrees(directory);

  const studentType = (await getStudentTypes(directory)).find((studentType) => studentType.id === slug[0]);

  if (!studentType) {
    return {
      notFound: true,
    };
  }

  const location = (await getAdmissionLocations()).find((location) => location.id === slug[1]);

  if (!location) {
    return {
      notFound: true,
    };
  }

  const program = programs.find((program) => program.id === slug[2]) ?? degrees.find((degree) => degree.id === slug[2]);

  if (!program) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: `${program.name} Admission Requirements for ${studentType.name} in ${location.name}`,
      content: "<div>Requirements information here</div>",
    },
  };
}

export default function UndergraduateAdmissionRequirements({ title, content }) {
  return (
    <Layout title={title || "Undergraduate Admission Requirements"}>
      <Container centered>
        <Section
          primary={
            <>
              <Heading level={1}>{title || "Undergraduate Admission Requirements"}</Heading>

              <div className="flex flex-col [&_p]:py-2 py-6">
                <HtmlParser html={content ?? ""} />
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
