import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftToBracket, faClipboard } from "@awesome.me/kit-7993323d0c/icons/sharp/solid";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import { parseRequirementPageSlug, getRequirements } from "@/data/drupal/programs/undergraduate/requirements";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import {
  faBars,
  faCalendarDays,
  faFileSignature,
  faMapLocationDot,
} from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { Fragment } from "react";
import { HtmlParser } from "@/components/html-parser";
import { isDraft } from "@/lib/is-draft";
import { Link, UnstyledLink } from "@/components/link";

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
    <Layout title={title ?? "Undergraduate Admission Requirements"}>
      {/* Show the paths to the requirement blocks that make up this page */}
      {draft && Array.isArray(requirements?.paths) && (
        <div className="fixed bottom-4 left-4 bg-uog-color-red text-white p-2 rounded-md flex gap-2 flex-col z-10">
          {requirements?.paths.map((path) => (
            <Link color="none" key={path.url} href={path.url}>
              {path.title}
            </Link>
          ))}
        </div>
      )}
      <Container centered>
        <Section
          primary={
            <>
              <Heading level={1} className="text-4xl">
                {title ?? "Undergraduate Admission Requirements"}
              </Heading>
              <div className="flex flex-col">
                {requirements?.sections?.map((section) => (
                  <>
                    <Heading level={2}>{section.title}</Heading>
                    <HtmlParser html={section.content} />
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
