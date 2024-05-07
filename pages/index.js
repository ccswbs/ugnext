import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Divider } from '@/components/divider';
export default function Home() {
	return (
		<Layout title="Home">
			<Container centered>
				<Heading level={1}>UG Next Home Page</Heading>

				<Divider />
			</Container>
		</Layout>
	);
}
