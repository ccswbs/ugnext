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
import { AdmissionRequirementsSidebar } from "@/components/client/programs/undergraduate/admission-requirements-sidebar";
import { List, ListItem } from "@uoguelph/react-components/list";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import React from "react";
import { Divider } from "@uoguelph/react-components/divider";
import { AdmissionRequirementsSections } from "@/components/client/programs/undergraduate/admission-requirements-sections";

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
        <Grid
          template={{
            base: ["minmax(0, 1fr)"],
            md: ["minmax(0, 9fr)", "minmax(0, 3fr)"],
          }}
          gap={{
            x: 30,
            y: 0,
          }}
        >
          <div>
            <Typography type="h2" as="h1" className="block! text-black">
              {title}
            </Typography>

            <AdmissionRequirementsSections
              sections={content.sections}
              program={program}
              studentType={studentType}
              location={location}
            />
          </div>

          <AdmissionRequirementsSidebar sidebar={content?.sidebar} />
        </Grid>

        {showPaths && (
          <div>
            <Divider />

            <Typography type="h4" as="h2" className="mt-0">
              The following Undergraduate Admission Requirements were used to build this page
            </Typography>

            <List as="ol">
              {content.paths.map((path) => (
                <ListItem key={path.url}>
                  <LinkComponent href={path.url}>{path.title}</LinkComponent>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
