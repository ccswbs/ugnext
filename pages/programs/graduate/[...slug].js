import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { getAllGraduatePrograms } from '@/lib/get-graduate-programs';
import { getGraduateProgram } from '@/lib/get-graduate-program';
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';

export async function getStaticProps(context) {
	const data = await getGraduateProgram(context?.params?.slug);
 
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
  // { fallback: false } means other routes should 404
  return { 
    paths: results.map((result) => ({
			params: {
				slug: result?.slug.split('/').filter(Boolean),
			}
		})),
    fallback: 'blocking',
  }
}

export default function Program({data}) {
	const { isFallback } = useRouter();

	return (
		<Layout title="Graduate Programs">
			<GraduateProgramHero />
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