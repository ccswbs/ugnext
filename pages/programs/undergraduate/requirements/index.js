import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { getAdmissionLocations } from "@/data/yaml/programs";
import { useMemo, useState } from "react";
import { Select } from "@/components/select";
import { Section } from "@/components/section";
import { Sidebar } from "@/components/programs/undergraduate/sidebar";
import { getUndergraduatePrograms, getUndergraduateStudentTypes } from "@/data/yaml/programs/undergraduate";
import { nameAndTagSearch } from "@/lib/use-search";
import { Button } from "@/components/button";
import { useRouter } from "next/router";

export async function getStaticProps() {
  return {
    props: {
      studentTypes: await getUndergraduateStudentTypes(),
      locations: await getAdmissionLocations(),
      programs: (await getUndergraduatePrograms())
        .filter((program) => {
          const allowedTypes = new Set(["major", "bachelor"]);
          return program.types.some((type) => allowedTypes.has(type.id));
        })
        .map((program) => {
          // Remove admission requirements data as we don't need it for the search
          delete program.requirements;
          return program;
        }),
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
    <Layout metadata={{ title: "Undergraduate Admission Requirements" }}>
      <Container centered>
        <Section
          primary={
            <>
              <Heading level={1}>Undergraduate Admission Requirements</Heading>

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

                <Select
                  label={
                    <Heading level={5} as="h2" className="mb-1 mt-0">
                      I am interested in studying
                    </Heading>
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
              <Sidebar />
            </div>
          }
        />
      </Container>
    </Layout>
  );
}
