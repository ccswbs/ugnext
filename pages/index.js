import Layout from '@/components/layout';
import Container from '@/components/container';
import Link, { UnstyledLink } from '@/components/link';
import Button from '@/components/button';
import HtmlParser from '@/components/html-parser';
import List from '@/components/list';

export default function Home() {
	return (
		<Layout title="Home">
			<Container centered>
				<h1>UGNext Home Page</h1>

				<Link href="/test" color="blue" className="text-xl">Test Link</Link>

				<Button href="/test" as={UnstyledLink} color="red">Test</Button>

				<HtmlParser html="<h3>testing</h3>" />

				<List variant="unordered">
					<span>test</span>
					<>testingsdf</>
					<li>testindagsdg</li>
				</List>
			</Container>
		</Layout>
	);
}
