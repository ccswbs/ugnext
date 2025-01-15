import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket, faClipboard } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import {
  getUndergraduatePrograms,
  getUndergraduateRequirements,
  parseAdmissionRequirementsSlug,
} from "@/data/yaml/programs/undergraduate";
import { List, ListItem } from "@/components/list";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import {
  faBars,
  faCalendarDays,
  faFileSignature,
  faMapLocationDot,
} from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { Fragment } from "react";
import { HtmlParser } from "@/components/html-parser";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { studentType, location, program } = await parseAdmissionRequirementsSlug(context.params.slug);

  console.log(await getUndergraduatePrograms());

  console.log(studentType?.id, location?.id, program?.id, context.params.slug);

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

export default function UndergraduateAdmissionRequirements({ studentType, location, program, requirements }) {
  const title = `${program?.name} Admission Requirements for ${studentType?.name.replace("Student", "Students").replace("Graduate", "Graduates")} in ${location?.name}`;

  const wrappers = {
    list: List,
    text: "p",
  };

  const items = {
    list: ListItem,
    text: Fragment,
  };

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
                  ?.map((requirement, index) => {
                    const Wrapper = wrappers[requirement.type];
                    const Content = items[requirement.type];

                    return (
                      <Fragment key={index}>
                        <Heading level={3} as="h2">
                          {requirement.name}
                        </Heading>

                        <Wrapper>
                          {requirement.content.map((item, index) => (
                            <Content key={index}>
                              <HtmlParser html={item} />
                            </Content>
                          ))}
                        </Wrapper>
                      </Fragment>
                    );
                  })}
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
