import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata } from "next";
import { Grid } from "@uoguelph/react-components/grid";
import { getLocations, getStudentTypes } from "@/data/drupal/undergraduate-admission-requirements";
import AdmissionRequirementsForm from "@/components/client/programs/undergraduate/admission-requirements-form";
import { getUndergraduateMajors } from "@/data/drupal/undergraduate-program";

export const metadata: Metadata = {
  title: "Undergraduate Admission Requirements",
};

export default async function ProgramsUndergraduate() {
  const studentTypes = await getStudentTypes();
  const locations = await getLocations();
  const programs = await getUndergraduateMajors();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
        <Typography type="h1" as="h1" className="block">
          Undergraduate Admission Requirements
        </Typography>

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
          <AdmissionRequirementsForm studentTypes={studentTypes} locations={locations} programs={programs} />

          <div>Sidebar</div>
        </Grid>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
