import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { getAllGraduatePrograms } from '@/lib/get-all-graduate-programs';
import { getGraduateProgram } from '@/lib/get-graduate-program';

export async function getStaticProps(context) {
	// Try to get data of the program the user is requesting.
	const data = await getGraduateProgram(context?.params?.program);

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
    paths: results.map((result) => ({
			params: {
				program: result?.program?.split('/').filter(Boolean),
			}
		})),
    // { fallback: false } means other routes should 404
    fallback: false,
  }
}

export default function Program({data}) {
	const { isFallback } = useRouter();

	return (
		<Layout title="Graduate Program">
			<Container className={twJoin(isFallback && 'hidden')} centered>
        <Heading level={1}>{data.title} Program Page</Heading>
			</Container>
		</Layout>
	);
}