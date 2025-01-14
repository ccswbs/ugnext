import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket, faClipboard } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import { getUndergraduateRequirements, parseAdmissionRequirementsSlug } from "@/data/yaml/programs/undergraduate";
import { List, ListItem } from "@/components/list";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import {
  faBars,
  faCalendarDays,
  faFileSignature,
  faMapLocationDot,
} from "@awesome.me/kit-7993323d0c/icons/classic/solid";

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
      studentType: studentType,
      location: location,
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

              <AdmissionRequirementsSidebar
                links={[
                  {
                    url: "https://www.uoguelph.ca/admission/undergraduate/apply/",
                    text: "Apply Now!",
                    icon: faGryphonStatue,
                    highlight: true,
                  },
                  {
                    url: program?.url,
                    text: "About This Program",
                    icon: faClipboard,
                    highlight: true,
                  },
                  {
                    url: "/programs/undergraduate",
                    text: "View All Programs",
                    icon: faBars,
                  },
                  {
                    url: "https://www.uoguelph.ca/admission/undergraduate/tours/",
                    text: "Register for a Campus Tour",
                    icon: faMapLocationDot,
                  },
                  {
                    url: "https://www.uoguelph.ca/registrar/forms/spf/",
                    text: "Fill out our Student Profile Form",
                    icon: faFileSignature,
                  },
                  {
                    url: "https://www.uoguelph.ca/admission/undergraduate/apply/deadlines/",
                    text: "Dates & Deadlines",
                    icon: faCalendarDays,
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
