import { useMemo, useState } from "react";
import { Select } from "@/components/select";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import { nameAndTagSearch } from "@/lib/use-search";
import { Button } from "@uoguelph/react-components/button";
import { useRouter } from "next/router";
import {
  getLocations,
  getPrograms,
  getStudentTypes,
  getDefaultSidebar,
} from "@/data/drupal/programs/undergraduate/requirements";
import { isDraft } from "@/lib/is-draft";
import { Typography } from "@uoguelph/react-components/typography";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";

export async function getStaticProps(context) {
  const draft = isDraft(context);

  return {
    props: {
      draft: draft,
      studentTypes: await getStudentTypes(),
      locations: await getLocations(),
      programs: (await getPrograms(draft)).sort((a, b) => a.name.localeCompare(b.name)),
      sidebar: await getDefaultSidebar(),
    },
  };
}

export default function UndergraduateAdmissionRequirements({ studentTypes, locations, programs, sidebar }) {
  const [selectedStudentType, setSelectedStudentType] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInternational, setShowInternational] = useState(false);
  const [showCurriculums, setShowCurriculums] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const searchPrograms = useMemo(() => {
    return nameAndTagSearch(programs);
  }, [programs]);

  const router = useRouter();

  return (
    <>
      <Meta title="Undergraduate Admission Requirements" />
      <Header></Header>
      <Layout>
        <LayoutContent>
          <Section
            primary={
              <>
                <Typography as="h1" type="h1">
                  Undergraduate Admission Requirements
                </Typography>

                <form
                  className="flex flex-col gap-8 w-full pr-4"
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (selectedStudentType && selectedLocation && selectedProgram) {
                      router
                        .push(
                          `/programs/undergraduate/requirements/${selectedStudentType.id}/${selectedLocation.id}/${selectedProgram.id}`
                        )
                        .catch((err) => console.error(err));
                    }
                  }}
                >
                  <Select
                    label={
                      <Typography type="h5" as="h2" className="mb-1!">
                        I am a
                      </Typography>
                    }
                    options={studentTypes.map((type) => ({
                      label: type.name,
                      value: type,
                      key: type.id,
                    }))}
                    onChange={(selection) => {
                      setSelectedStudentType(selection?.value);
                    }}
                  />

                  <Select
                    label={
                      <Typography type="h5" as="h2" className="mb-1! mt-0!">
                        I attend/attended high school in
                      </Typography>
                    }
                    options={[
                      ...locations.domestic.map((location) => ({
                        label: location.name,
                        value: location,
                        key: location.id,
                      })),
                      {
                        label: "Outside of Canada",
                        value: "international",
                        key: "international",
                      },
                      {
                        label: "Another Curriculum of Study",
                        value: "curriculum",
                        key: "curriculum",
                      },
                    ]}
                    onChange={(selection) => {
                      switch (selection?.value) {
                        case "international":
                          setShowInternational(true);
                          setShowCurriculums(false);
                          setSelectedLocation(null);
                          break;
                        case "curriculum":
                          setShowInternational(false);
                          setShowCurriculums(true);
                          setSelectedLocation(null);
                          break;
                        default:
                          setShowInternational(false);
                          setShowCurriculums(false);
                          setSelectedLocation(selection?.value);
                      }
                    }}
                  />

                  {showInternational && (
                    <Select
                      autocomplete
                      label={
                        <Typography type="h5" as="h2" className="mb-1! mt-0!">
                          I study/studied in
                        </Typography>
                      }
                      options={locations.international.map((location) => ({
                        label: location.name,
                        value: location,
                        key: location.id,
                      }))}
                      onChange={(selection) => {
                        setSelectedLocation(selection?.value);
                      }}
                    />
                  )}

                  {showCurriculums && (
                    <Select
                      label={
                        <Typography type="h5" as="h2" className="mb-1! mt-0!">
                          My curriculum of study is/was
                        </Typography>
                      }
                      options={locations.curriculum.map((location) => ({
                        label: location.name,
                        value: location,
                        key: location.id,
                      }))}
                      onChange={(selection) => {
                        setSelectedLocation(selection?.value);
                      }}
                    />
                  )}

                  <Select
                    label={
                      <Typography type="h5" as="h2" className="mb-1! mt-0!">
                        I am interested in studying
                      </Typography>
                    }
                    options={programs.map((program) => ({
                      label: program.name,
                      value: program,
                      key: program.id,
                    }))}
                    onChange={(selection) => {
                      setSelectedProgram(selection?.value);
                    }}
                    autocomplete={(input, options) => {
                      if (!input) {
                        return options;
                      }

                      const filteredPrograms = searchPrograms(input);

                      return options.filter((option) => {
                        return filteredPrograms.some((program) => program.id === option.key);
                      });
                    }}
                  />

                  {selectedStudentType && selectedLocation && selectedProgram && (
                    <Button type="submit" color="red" className="w-fit">
                      View Requirements
                    </Button>
                  )}
                </form>
              </>
            }
            secondary={
              <div className="flex flex-col gap-2 w-full px-4">
                {Array.isArray(sidebar) && sidebar.length > 0 && <AdmissionRequirementsSidebar data={sidebar} />}
              </div>
            }
          />
        </LayoutContent>
      </Layout>
      <Footer></Footer>
    </>
  );
}
