import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata, ResolvingMetadata } from "next";
import {
  getUndergraduateAdmissionLocationByPath,
  getUndergraduateAdmissionRequirementPageContent,
  getUndergraduateAdmissionStudentTypeByPath,
  UndergraduateAdmissionLocation,
  UndergraduateAdmissionStudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import {
  UNDERGRADUATE_ADMISSION_LOCATIONS_NODE_PATH,
  UNDERGRADUATE_ADMISSION_STUDENT_TYPE_NODE_PATH,
  UNDERGRADUATE_PROGRAMS_NODE_PATH,
} from "@/lib/undergraduate-admission-requirements";
import { notFound } from "next/navigation";
import { getUndergraduateProgramByPath, UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import { Grid } from "@uoguelph/react-components/grid";
import { Link as LinkComponent } from "@uoguelph/react-components/link";
import { faArrowLeftFromBracket } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { AdmissionRequirementsSidebarButton } from "@/components/client/programs/undergraduate/admission-requirements-sidebar-button";
import { HtmlParser } from "@/components/client/html-parser";
import { Alert, AlertMessage, AlertSubtitle } from "@uoguelph/react-components/alert";
import { List, ListItem } from "@uoguelph/react-components/list";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { Fragment } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
};

async function slugToData(slug: string[]) {
  const studentType = await getUndergraduateAdmissionStudentTypeByPath(
    `${UNDERGRADUATE_ADMISSION_STUDENT_TYPE_NODE_PATH}${slug[0]}`
  );

  if (!studentType) {
    notFound();
  }

  const location = await getUndergraduateAdmissionLocationByPath(
    `${UNDERGRADUATE_ADMISSION_LOCATIONS_NODE_PATH}${slug[1]}`
  );

  if (!location) {
    notFound();
  }

  const program = await getUndergraduateProgramByPath(`${UNDERGRADUATE_PROGRAMS_NODE_PATH}${slug[2]}`);

  if (!program) {
    notFound();
  }

  return {
    studentType,
    location,
    program,
  };
}

function getPageTitle(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {
  return `${program.title} Admission Requirements for ${studentType.name} Applicants in ${location.name}`;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const { studentType, location, program } = await slugToData(slug);
  const title = getPageTitle(studentType, location, program);

  return {
    title: title,
  };
}

export default async function ProgramsUndergraduate({ params }: Props) {
  const { slug } = await params;
  const { studentType, location, program } = await slugToData(slug);
  const title = getPageTitle(studentType, location, program);

  const showPaths = await showUnpublishedContent();
  const content = await getUndergraduateAdmissionRequirementPageContent(studentType, location, program);

  return (
    <Layout>
      <Header></Header>

      <LayoutContent className="pb-8">
        {showPaths && (
          <Alert>
            <AlertMessage className="border-t">
              <AlertSubtitle>
                The following Undergraduate Admission Requirements were used to build this page
              </AlertSubtitle>

              <List as="ol">
                {content.paths.map((path) => (
                  <ListItem key={path.url}>
                    <LinkComponent href={path.url}>{path.title}</LinkComponent>
                  </ListItem>
                ))}
              </List>
            </AlertMessage>
          </Alert>
        )}

        <Grid
          template={{
            base: ["minmax(0, 1fr)"],
            md: ["minmax(0, 9fr)", "minmax(0, 3fr)"],
          }}
          gap={{
            x: 10,
            y: 0,
          }}
        >
          <div>
            <Typography type="h2" as="h1" className="block! text-black">
              {title}
            </Typography>

            {content?.sections
              ?.map((section) => {
                if (!section.content) {
                  return null;
                }

                return (
                  <Fragment key={section.title}>
                    <Typography type="h3" as="h2">
                      {section.title}
                    </Typography>

                    <HtmlParser html={section.content} instructions={undefined} />
                  </Fragment>
                );
              })
              .filter((section) => section !== null)}
          </div>

          <div className="flex flex-col gap-4 mt-7.5">
            <AdmissionRequirementsSidebarButton
              url="/programs/undergraduate/requirements"
              title="View Other Requirements"
              icon={faArrowLeftFromBracket}
            />

            {content?.sidebar?.map((button) => (
              <AdmissionRequirementsSidebarButton
                key={button.id}
                color="black"
                url={button.link.url ?? ""}
                title={button.link.title ?? ""}
                icon={button.fontAwesomeIcon ?? ""}
              />
            ))}
          </div>
        </Grid>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
