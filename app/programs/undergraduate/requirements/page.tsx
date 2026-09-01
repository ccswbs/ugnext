import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata } from "next";
import { Grid } from "@uoguelph/react-components/grid";
import {
  getGeneralAdmissionRequirementPageContent,
  getUndergraduateAdmissionLocations as getUndergraduateAdmissionLocationsDrupal,
  getUndergraduateAdmissionStudentTypes,
} from "@/data/drupal/undergraduate-admission-requirements";
import { getUndergraduateAdmissionLocations as getUndergraduateAdmissionLocationYaml } from "@/data/yaml/programs/undergraduate";
import UndergraduateAdmissionRequirementsForm from "@/components/client/programs/undergraduate/undergraduate-admission-requirements-form";
import { getUndergraduateMajors } from "@/data/drupal/undergraduate-program";
import { UndergraduateAdmissionRequirementsSidebar } from "@/components/client/programs/undergraduate/undergraduate-admission-requirements-sidebar";
import { slugify } from "@/lib/string-utils";

async function getUndergraduateAdmissionLocations() {
  const locationsDrupal = await getUndergraduateAdmissionLocationsDrupal();
  const locationsYaml = await getUndergraduateAdmissionLocationYaml();
  const locations = [...locationsDrupal];

  const drupalSlugs = new Set(locationsDrupal.map((location) => slugify(location.name)));

  for (const locationYaml of locationsYaml) {
    if (!drupalSlugs.has(slugify(locationYaml.name))) {
      locations.push(locationYaml);
    }
  }

  return locations;
}

export const metadata: Metadata = {
  title: "Undergraduate Admission Requirements",
};

export default async function ProgramsUndergraduateRequirements() {
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

            <UndergraduateAdmissionRequirementsForm
              studentTypes={studentTypes}
              locations={locations}
              programs={programs}
              isDomesticOnly // Remove when international admission requirements are ready.
            />
          </div>

          <UndergraduateAdmissionRequirementsSidebar sidebar={sidebar} />
        </Grid>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
