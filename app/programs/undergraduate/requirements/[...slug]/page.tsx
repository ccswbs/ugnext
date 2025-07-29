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
import { Button } from "@uoguelph/react-components/button";
import Link from "next/link";
import { Link as LinkComponent } from "@uoguelph/react-components/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftFromBracket } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { ButtonWidget } from "@/components/client/widgets/button-section";

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

  const content = await getUndergraduateAdmissionRequirementPageContent(studentType, location, program);
  console.log(content);

  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
        {Array.isArray(content.paths) && content.paths.length > 0 && (
          <div className="fixed bottom-4 right-4 max-w-96 bg-grey-light-bg shadow-2xl p-4 rounded-md flex gap-2 flex-col z-10">
            <span>The following Undergraduate Admission Requirements were used to build this page</span>
            {content.paths.map((path) => (
              <LinkComponent key={path.url} href={path.url}>
                {path.title}
              </LinkComponent>
            ))}
          </div>
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

            {content?.sections?.map((section) => (
              <>
                <Typography type="h3" as="h2">
                  {section.title}
                </Typography>

                {/*section.content?.map((content) => (
                  <WidgetSelector key={content.id} data={content} />
                ))*/}
              </>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-7.5">
            <Button
              className="w-full font-medium flex items-center justify-start! gap-x-1 leading-6 mx-1"
              as={Link}
              href="/programs/undergraduate/requirements"
            >
              <FontAwesomeIcon className="pe-3 text-3xl inline-block align-middle" icon={faArrowLeftFromBracket} />
              <span>View Other Requirements</span>
            </Button>

            {content.sidebar.map((button) => (
              <ButtonWidget key={button.id} data={button} column="secondary" />
            ))}
          </div>
        </Grid>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
