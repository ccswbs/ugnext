import Layout from '@/components/layout';
import Container from '@/components/container';
import Link, { UnstyledLink } from '@/components/link';
import Button from '@/components/button';
import HtmlParser from '@/components/html-parser';
import List from '@/components/list';
import { Tabs, Tab } from '@/components/tabs';
import Heading from '@/components/heading';
import Accordion from '@/components/accordion';

export default function Home() {
	return (
		<Layout title="Home">
			<Container centered>
				<Heading level={1}>UG Next Home Page</Heading>

				<Accordion text="Accordion 1">
					<p>Accordion 1 content</p>
					<p>Accordion 1 content</p>
					<p>Accordion 1 content</p>
				</Accordion>

				<div>tests</div>
			</Container>
		</Layout>
	);
}
