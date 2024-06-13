import { useRouter } from 'next/router';
import { getAllGraduatePrograms } from '@/lib/get-all-graduate-programs';
import { getGraduateProgram } from '@/lib/get-graduate-program';
import { GraduateProgramDegreePage } from '@/components/programs/graduate/program-degree';
import { GraduateProgramPage } from '@/components/programs/graduate/program';

export async function getStaticProps(context) {
  // Try to get data of the program the user is requesting.
  // Path of the data must match slug (e.g., biostatistics.yml must live under data/programs/graduate)
  const path = context?.params?.slug.join('/');
	const data = await getGraduateProgram(path);

	return {
		props: { data },
	};
}

export async function getStaticPaths() {

  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: true,
    }
  }

  const results = await getAllGraduatePrograms();

  // Get the paths we want to prerender based on programs
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  return { 
    paths: results?.map((result) => ({
			params: {
				slug: result?.slug.split('/').filter(Boolean),
			}
		})),
    // { fallback: false } means other routes should 404
    fallback: false,
  }
}

export default function Program({data}) {
	const { isFallback } = useRouter();

  if(data?.program_parent){
    return (
      <GraduateProgramDegreePage data={data} isFallback={isFallback} />
    );
  }

  return (
		<GraduateProgramPage data={data} isFallback={isFallback} />
	);
}