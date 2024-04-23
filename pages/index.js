import Layout from '@/components/layout';
import Container from '@/components/container';
import Link, { UnstyledLink } from '@/components/link';
import Button from '@/components/button';

export default function Home() {
	return (
		<Layout title="Home">
			<Container centered>
				<h1>UGNext Home Page</h1>

				<Link href="/test" color="blue" className="text-xl">Test Link</Link>

				<Button href="/test" as={UnstyledLink} color="red">Test</Button>
			</Container>
		</Layout>
	);
}
