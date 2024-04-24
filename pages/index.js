import Layout from '@/components/layout';
import Container from '@/components/container';
import Link, { UnstyledLink } from '@/components/link';
import Button from '@/components/button';
import HtmlParser from '@/components/html-parser';
import List from '@/components/list';
import { Tabs, Tab } from '@/components/tabs';

export default function Home() {
	return (
		<Layout title="Home">
			<Container centered>
				<h1>UGNext Home Page</h1>

				<Tabs>
					<Tab title="Tab 1">
						<Button href="/test" color="red">
							Test
						</Button>

						<div>testing</div>
					</Tab>
					<Tab title="Tab 2">Tab 2 Content</Tab>
					<Tab title="Tab 3">Tab 3 Content</Tab>
				</Tabs>

				<Link href="/test" color="blue" className="text-xl">
					Test Link
				</Link>

				<Button href="/test" color="red">
					Test
				</Button>

				<i className="fa-solid fa-chevron-right"></i>

				<HtmlParser html="<h3>testing</h3>" />

				<List variant="unordered">
					<span>test</span>
					testingsdf
					<li>
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg{' '}
					</li>
				</List>

				<List variant="ordered">
					<span>test</span>
					testingsdf
					<li>
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg testindagsdg
						testindagsdg testindagsdg{' '}
					</li>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
					<span>test</span>
				</List>
			</Container>
		</Layout>
	);
}
