import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket, faClipboard } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import { parseRequirementPageSlug, getRequirements } from "@/data/drupal/programs/undergraduate/requirements";
import { Fragment } from "react";
import { isDraft } from "@/lib/is-draft";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { UnstyledLink } from "@/components/unstyled-link";
import { Typography } from "@uoguelph/react-components/typography";
import { Button } from "@uoguelph/react-components/button";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const draft = isDraft(context);
  const { studentType, location, program } = await parseRequirementPageSlug(context.params.slug);

  if (!studentType || !location || !program) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      draft: draft,
      studentType: studentType,
      location: location,
      program: program,
      requirements: await getRequirements(studentType, location, program, draft),
    },
  };
}

export default function UndergraduateAdmissionRequirements({ draft, studentType, location, program, requirements }) {
  const title = `${program?.name} Admission Requirements for ${studentType?.replace("Student", "Students").replace("Graduate", "Graduates")} in ${location}`;

  return (
    <>
      <Meta title="Undergraduate Admission Requirements" />
      <Header></Header>
      <Layout>
        <LayoutContent className="pb-10!">
          <Section
            primary={
              <>
                <Typography as="h1" type="h1">
                  {title ?? "Undergraduate Admission Requirements"}
                </Typography>
                <div className="flex flex-col">
                  {requirements?.sections?.map((section) => (
                    <>
                      <Typography as="h2" type="h3">
                        {section.title}
                      </Typography>

                      {section.content?.map((content) => (
                        <WidgetSelector key={content.id} data={content} />
                      ))}
                    </>
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
                  as={UnstyledLink}
                >
                  <FontAwesomeIcon className="text-2xl" icon={faArrowLeftToBracket} />
                  <span className="font-bold">View Other Requirements</span>
                </Button>

                <AdmissionRequirementsSidebar data={requirements?.sidebar} />
              </div>
            }
          />
        </LayoutContent>
      </Layout>
      <Footer></Footer>
    </>
  );
}
