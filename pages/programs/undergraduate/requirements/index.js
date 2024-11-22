import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { getAdmissionLocations, getDegrees, getPrograms, getStudentTypes } from "@/data/yaml/programs";
import path from "path";
import { useEffect, useState } from "react";
import { Select } from "@/components/select";
import { Button } from "@/components/button";

export async function getStaticProps() {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

  return {
    props: {
      studentTypes: await getStudentTypes(directory),
      locations: await getAdmissionLocations(),
      programs: (await getPrograms(directory)).map((program) => {
        // Remove any data we don't need
        delete program.requirements;
        delete program.types;
        delete program.url;
        delete program.acronym;

        return program;
      }),
      degrees: (await getDegrees(directory)).map((degree) => {
        // Remove any data we don't need
        delete degree.requirements;
        delete degree.type;
        delete degree.url;
        delete degree.acronym;

        return degree;
      }),
    },
  };
}

export default function UndergraduateAdmissionRequirements({ studentTypes, locations, programs, degrees }) {
  const [selectedStudentType, setSelectedStudentType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showInternational, setShowInternational] = useState(false);
  const [showCurriculums, setShowCurriculums] = useState(false);
  const isComplete = selectedStudentType && selectedLocation && selectedProgram;

  useEffect(() => {
    console.log(selectedStudentType, selectedLocation, selectedProgram);
  }, [selectedStudentType, selectedLocation, selectedProgram]);

  return (
    <Layout metadata={{ title: "Undergraduate Admission Requirements" }}>
      <Container centered>
        <Heading level={1}>Undergraduate Admission Requirements</Heading>

        <form className="flex flex-col gap-8 w-full md:w-2/3">
          <Select
            label={
              <Heading level={5} as="h2" className="mb-1 mt-0">
                I am a
              </Heading>
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
              <Heading level={5} as="h2" className="mb-1 mt-0">
                I attend/attended high school in
              </Heading>
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
                <Heading level={5} as="h2" className="mb-1 mt-0">
                  I study/studied in
                </Heading>
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
                <Heading level={5} as="h2" className="mb-1 mt-0">
                  My curriculum of study is/was
                </Heading>
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

          <Button className="w-full sm:w-fit" color="red" type="submit" disabled={!isComplete} outlined={!isComplete}>
            View Requirements
          </Button>
        </form>
      </Container>
    </Layout>
  );
}
