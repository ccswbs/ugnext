import React, { useState } from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { Select } from "@/components/select";
import { Card } from "@/components/card";
import { toTitleCase } from "@/lib/string-utils";
import { getGraduatePrograms } from "@/data/yaml/programs";

export async function getStaticProps() {
  return {
    props: {
      programs: await getGraduatePrograms(),
    },
  };
}

export default function ProgramsGraduate({ programs }) {
  const [filter, setFilter] = useState(null);

  return (
    <Layout title="Graduate Programs">
      <Container centered>
        <Heading level={1}>Graduate Programs at the University of Guelph</Heading>

        <ProgramSearch
          programs={programs}
          filterer={filter}
          render={(program) => (
            <Card
              href={program.url}
              key={program.name + program.url}
              title={
                <div className="flex flex-col justify-center text-lg">
                  <span className="font-bold">{program.name}</span>
                  <span className="text-sm text-black/65">
                    {program?.types
                      ?.filter((type) => type !== "collaborative-specialization")
                      ?.map((type) => toTitleCase(type))
                      .join(", ")}
                  </span>
                </div>
              }
              footer={
                program?.types?.includes("collaborative-specialization")
                  ? "Collaborative Specialization"
                  : program?.degrees?.join(", ")
              }
            />
          )}
        >
          <div className="sm:ml-auto sm:w-1/3 md:w-1/4">
            <Select
              label={<span className="text-xl font-bold">Filter by degree type</span>}
              multiple
              options={[
                {
                  value: "masters",
                  label: "Masters",
                  selected: true,
                },
                {
                  value: "doctor",
                  label: "Doctoral/PhD",
                  selected: true,
                },
                {
                  value: "diploma",
                  label: "Graduate Diploma",
                  selected: true,
                },
              ]}
              onChange={(selected) => {
                if (selected.length === 3) {
                  setFilter(null);
                  return;
                }

                const predicates = [];

                for (const option of selected) {
                  switch (option.value) {
                    case "doctor":
                      predicates.push(
                        (program) =>
                          program?.degrees?.includes("PhD") || program.degrees.some((degree) => degree.startsWith("D"))
                      );
                      break;
                    case "masters":
                      predicates.push((program) => program.degrees.some((degree) => degree.startsWith("M")));
                      break;
                    case "diploma":
                      predicates.push((program) => program?.degrees?.includes("Graduate Diploma"));
                      break;
                  }
                }

                setFilter(() => (program) => predicates.reduce((acc, cur) => cur(program) || acc, false));
              }}
            />
          </div>
        </ProgramSearch>
      </Container>
    </Layout>
  );
}
