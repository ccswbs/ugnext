import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket, faClipboard } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { Sidebar } from "@/components/programs/undergraduate/sidebar";
import { getUndergraduateRequirements, parseAdmissionRequirementsSlug } from "@/data/yaml/programs/undergraduate";
import { List, ListItem } from "@/components/list";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { studentType, location, program } = await parseAdmissionRequirementsSlug(context.params.slug);

  if (!studentType || !location || !program) {
    return {
      notFound: true,
    };
  }

  const requirements = await getUndergraduateRequirements(studentType, location, program);

  return {
    props: {
      studentType: { id: studentType.id, name: studentType.name },
      location: { id: location.id, name: location.name },
      program: { id: program.id, name: program.name, url: program.url },
      requirements: requirements,
    },
  };
}

const RequirementsSectionContent = ({ type, content }) => {
  switch (type) {
    case "list":
      return (
        <List>
          {content.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      );
    default:
      return (
        <>
          {content.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </>
      );
  }
};

const RequirementsSection = ({ title, type, content }) => (
  <>
    <Heading level={3} as="h2">
      {title}
    </Heading>

    <RequirementsSectionContent type={type} content={content} />
  </>
);

export default function UndergraduateAdmissionRequirements({ studentType, location, program, requirements }) {
  const title = `${program?.name} Admission Requirements for ${studentType?.name.replace("Student", "Students").replace("Graduate", "Graduates")} in ${location?.name}`;

  return (
    <Layout title={title ?? "Undergraduate Admission Requirements"}>
      <Container centered>
        <Section
          primary={
            <>
              <Heading level={1}>{title ?? "Undergraduate Admission Requirements"}</Heading>
              <div className="flex flex-col">
                {requirements
                  ?.filter((requirement) => requirement.content.length > 0)
                  ?.map((requirement, index) => (
                    <RequirementsSection key={index} {...requirement} />
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

              <Sidebar
                links={[
                  {
                    url: program?.url,
                    text: "About This Program",
                    icon: faClipboard,
                    highlight: true,
                  },
                ]}
              />
            </div>
          }
        />
      </Container>
    </Layout>
  );
}
