import Layout from '@/components/layout';
import Container from '@/components/container';
import Link from '@/components/link';

export default function Home() {
	return (
		<Layout title="Home">
			<Container centered>
				<h1>UGNext Home Page</h1>

				<Link href="/test" color="blue" className="text-xl">Test Link</Link>
			</Container>
		</Layout>
	);
}
