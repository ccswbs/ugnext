import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { useMemo, useState } from "react";
import { Select } from "@/components/select";
import { Section } from "@/components/section";
import { AdmissionRequirementsSidebar } from "@/components/programs/undergraduate/admission-requirements-sidebar";
import {
  getUndergraduatePrograms,
  getUndergraduateStudentTypes,
  getUndergraduateAdmissionLocations,
  getUndergraduateDegrees,
} from "@/data/yaml/programs/undergraduate";
import { nameAndTagSearch } from "@/lib/use-search";
import { Button } from "@uoguelph/react-components/button";
import { useRouter } from "next/router";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import {
  faBars,
  faFileSignature,
  faMapLocationDot,
  faCalendarDays,
} from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { Typography } from "@uoguelph/react-components/typography";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";

export async function getStaticProps() {
  const degrees = (await getUndergraduateDegrees()).map((degree) => ({ ...degree, types: [degree.type] }));
  const programs = await getUndergraduatePrograms();

  return {
    props: {
      studentTypes: await getUndergraduateStudentTypes(),
      locations: await getUndergraduateAdmissionLocations(),
      programs: [...programs, ...degrees]
        .filter((program) => {
          const allowedTypes = new Set(["major", "bachelor"]);
          return program.types.some((type) => allowedTypes.has(type.id));
        })
        .map((program) => {
          // Remove any data we don't need for the filter
          return {
            id: program.id,
            name: program.name,
            tags: program.tags,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}

export default function UndergraduateAdmissionRequirements({ studentTypes, locations, programs }) {
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
                      <Typography type="h5" as="h2" className="mb-1 mt-0">
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
                      <Typography type="h5" as="h2" className="mb-1 mt-0">
                        I attend/attended high school in
                      </Typography>
                    }
                    options={[
                      ...locations
                        .filter((location) => location.type === "domestic")
                        .map((location) => ({
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
                        <Typography type="h5" as="h2" className="mb-1 mt-0">
                          I study/studied in
                        </Typography>
                      }
                      options={locations
                        .filter((location) => location.type === "international")
                        .map((location) => ({
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
                        <Typography type="h5" as="h2" className="mb-1 mt-0">
                          My curriculum of study is/was
                        </Typography>
                      }
                      options={locations
                        .filter((location) => location.type === "curriculum")
                        .map((location) => ({
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
                      <Typography type="h5" as="h2" className="mb-1 mt-0">
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
                <AdmissionRequirementsSidebar
                  links={[
                    {
                      url: "https://www.uoguelph.ca/admission/undergraduate/apply/",
                      text: "Apply Now!",
                      icon: faGryphonStatue,
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
        </LayoutContent>
      </Layout>
      <Footer></Footer>
    </>
  );
}
