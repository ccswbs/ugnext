import { useRouter } from "next/router";
import { getPaths, getGraduateProgram } from "@/data/yaml/programs/graduate";
import { GraduateProgramDegreePage } from "@/components/programs/graduate/program-degree";
import { GraduateProgramPage } from "@/components/programs/graduate/program";

export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: true,
    };
  }

  // Get the paths we want to prerender based on programs
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  return {
    paths: await getPaths(),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // Try to get data of the program the user is requesting.
  // Path of the data must match slug
  // (e.g., programs/graduate/biostatistics data matches data/programs/graduate/biostatistics.yml)
  const path = context?.params?.slug.join("/");
  const data = await getGraduateProgram(path);

  return {
    props: { data },
  };
}

export default function Program({ data }) {
  const { isFallback } = useRouter();

  if (data?.program_parent) {
    return <GraduateProgramDegreePage data={data} isFallback={isFallback} />;
  }

  return <GraduateProgramPage data={data} isFallback={isFallback} />;
}
