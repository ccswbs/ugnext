import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata } from "next";
import { Grid } from "@uoguelph/react-components/grid";
import {
  getGeneralAdmissionRequirementPageContent,
  getUndergraduateAdmissionLocations,
  getUndergraduateAdmissionStudentTypes,
} from "@/data/drupal/undergraduate-admission-requirements";
import AdmissionRequirementsForm from "@/components/client/programs/undergraduate/admission-requirements-form";
import { getUndergraduateMajors } from "@/data/drupal/undergraduate-program";
import { AdmissionRequirementsSidebarButton } from "@/components/client/programs/undergraduate/admission-requirements-sidebar-button";
import { faArrowLeftFromBracket } from "@awesome.me/kit-7993323d0c/icons/classic/solid";

export const metadata: Metadata = {
  title: "Undergraduate Admission Requirements",
};

export default async function ProgramsUndergraduate() {
  const studentTypes = await getUndergraduateAdmissionStudentTypes();
  const locations = await getUndergraduateAdmissionLocations();
  const programs = await getUndergraduateMajors();
  const { sidebar } = await getGeneralAdmissionRequirementPageContent();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
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
            <Typography type="h1" as="h1" className="block">
              Undergraduate Admission Requirements
            </Typography>

            <AdmissionRequirementsForm studentTypes={studentTypes} locations={locations} programs={programs} />
          </div>

          <div className="flex flex-col gap-4 mt-7.5">
            {sidebar?.map((button) => (
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
