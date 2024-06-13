import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { getAllGraduatePrograms } from '@/lib/get-all-graduate-programs';
import { getGraduateProgram } from '@/lib/get-graduate-program';
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';

export async function getStaticProps(context) {
	// Try to get data of the program the user is requesting.
	const data = await getGraduateProgram(context?.params?.slug);
  // const data = await getGraduateProgram("thesis-based-phd","biostatistics");

	return {
		props: { data },
	};
}

export async function getStaticPaths() {
  let paths = [];

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

	return (
		<Layout title="Graduate Programs">
			{/* <GraduateProgramHero /> */}
			<Container className={twJoin(isFallback && 'hidden')} centered>



        <Heading level={1}> {data?.title} | Master of Science - Course-based (MSc)</Heading>
        <div className="pt-1 grid xl:grid-cols-12 xl:gap-x-10">
            <div className='xl:col-span-9'>
              <GraduateProgramInfo />
            </div>

            <div className='xl:col-span-3'>
              <GraduateProgramSummary />
            </div>
          </div>
			</Container>
		</Layout>
	);
}