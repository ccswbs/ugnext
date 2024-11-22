import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { getAdmissionLocations, getDegrees, getPrograms, getStudentTypes } from "@/data/yaml/programs";
import path from "path";
import { useState } from "react";
import { Select } from "@/components/select";
import { ProgramSearchBar } from "@/components/programs/program-search-bar";
import { Section } from "@/components/section";
import { List, ListItem } from "@/components/list";
import { Link, UnstyledLink } from "@/components/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

export async function getStaticProps() {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");
  const programs = await getPrograms(directory);
  const degrees = await getDegrees(directory);

  return {
    props: {
      studentTypes: await getStudentTypes(directory),
      locations: await getAdmissionLocations(),
      programs: [
        ...programs
          // For admission requirements, we only need majors
          .filter((program) => program.types.some((type) => type.id === "major"))
          .map((program) => {
            // Remove admission requirements data as we don't need it for the search
            delete program.requirements;
            return program;
          }),
        ...degrees.map((degree) => {
          // Remove admission requirements data as we don't need it for the search
          delete degree.requirements;
          return { ...degree, types: [degree.type] };
        }),
      ].sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}

export default function UndergraduateAdmissionRequirements({ studentTypes, locations, programs }) {
  const [selectedStudentType, setSelectedStudentType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInternational, setShowInternational] = useState(false);
  const [showCurriculums, setShowCurriculums] = useState(false);
  const [filteredPrograms, setFilteredPrograms] = useState(programs);

  return (
    <Layout metadata={{ title: "Undergraduate Admission Requirements" }}>
      <Container centered>
        <Heading level={1}>Undergraduate Admission Requirements</Heading>

        <Section
          primary={
            <div className="flex flex-col gap-8 w-full pr-4">
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

              {selectedStudentType && selectedLocation && (
                <div className="relative group">
                  <ProgramSearchBar programs={programs} onChange={(programs) => setFilteredPrograms(programs)} />

                  <div className="flex flex-col max-h-32 w-full overflow-y-auto bg-white absolute group-focus-within:opacity-100 group-focus-within:visible opacity-0 invisible transition duration-200 rounded-b-md border border-t-0 border-gray-300 shadow-md group-focus-within:border-blue">
                    {filteredPrograms.map((program) => (
                      <UnstyledLink
                        className="w-full border-b border-gray-300 px-4 py-2 text-gray-900 transition-colors last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        key={program.id}
                        href={`/programs/undergraduate/requirements/${selectedStudentType.id}/${selectedLocation.id}/${program.id}`}
                      >
                        {program.name}
                      </UnstyledLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
          secondary={
            <div className="flex flex-col gap-2 w-full px-4">
              <Heading level={5} as="h2" className="mb-1 mt-0">
                More Information
              </Heading>

              <ul className="w-full">
                <li className="w-full">
                  <Button className="w-full p-2" href="/programs/undergraduate" color="red" outlined>
                    View All Programs
                  </Button>
                </li>
              </ul>
            </div>
          }
        />
      </Container>
    </Layout>
  );
}
