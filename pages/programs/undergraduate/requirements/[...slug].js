import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { Meta } from "@/components/meta";
import { Typography } from "@uoguelph/react-components/typography";
import { Button } from "@uoguelph/react-components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket, faClipboard } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import { getUndergraduateRequirements, parseAdmissionRequirementsSlug } from "@/data/yaml/programs/undergraduate";
import { List, ListItem } from "@uoguelph/react-components/list";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import {
  faBars,
  faCalendarDays,
  faFileSignature,
  faMapLocationDot,
} from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { Fragment } from "react";
import { HtmlParser } from "@/components/html-parser";
import { UnstyledLink } from "@/components/unstyled-link";

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
    <>
      <Meta title={title ?? "Undergraduate Admission Requirements"} />
      <Header></Header>

      <Layout>
        <LayoutContent>
          <Section
            primary={
              <>
                <Typography as={"h1"} type={"h1"}>
                  {title ?? "Undergraduate Admission Requirements"}
                </Typography>

                <div className="flex flex-col">
                  {requirements
                    ?.filter((requirement) => requirement.content.length > 0)
                    ?.map((requirement, index) => {
                      const Wrapper = wrappers[requirement.type];
                      const Content = items[requirement.type];

                      return (
                        <Fragment key={index}>
                          <Typography as={"h2"} type={"h3"}>
                            {requirement.name}
                          </Typography>

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
                  as={UnstyledLink}
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
                      url: program?.url ?? "",
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
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
