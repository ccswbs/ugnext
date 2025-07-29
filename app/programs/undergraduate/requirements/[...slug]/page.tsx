import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata, ResolvingMetadata } from "next";
import {
  getLocationByPath,
  getStudentTypeByPath,
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

type Props = {
  params: Promise<{ slug: string[] }>;
};

async function slugToData(slug: string[]) {
  const studentType = await getStudentTypeByPath(`${UNDERGRADUATE_ADMISSION_STUDENT_TYPE_NODE_PATH}${slug[0]}`);

  if (!studentType) {
    notFound();
  }

  const location = await getLocationByPath(`${UNDERGRADUATE_ADMISSION_LOCATIONS_NODE_PATH}${slug[1]}`);

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

export function getPageTitle(
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

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h2" as="h1" className="block! text-black">
            {title}
          </Typography>
        </Container>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
