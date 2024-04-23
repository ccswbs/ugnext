import Head from 'next/head';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import Container from '@/components/container';
import Heading from '@/components/heading';
import Link from '@/components/link';

export default function Home() {
	const [searchLink, setSearchLink] = useState('https://www.uoguelph.ca/search');

	useEffect(() => {
		setSearchLink('https://www.uoguelph.ca/search/#gsc.tab=0&gsc.q=' + window.location.pathname + '&gsc.sort=');
	}, []);

	return (
		<Layout title="404: Not Found">
			<Container centered>
				<Heading level={1}>HTTP 404 — File not found</Heading>
				<Heading level={2}>Possible reasons for this error:</Heading>

				<ol>
					<li>
						You have clicked on an out-of-date bookmark. Once you find the correct page, please update your bookmark to
						avoid this error in the future.
					</li>

					<li>You have mis-typed the web address into the URL bar. Please check your spelling of the URL.</li>

					<li>
						The search engine has an out-of-date listing for this page -{' '}
						<Link href="mailto:ithelp@uoguelph.ca">please let us know!</Link>
					</li>

					<li>
						The university has removed this page (either on purpose or by mistake) -{' '}
						<Link href="mailto:ithelp@uoguelph.ca">please let us know!</Link>
					</li>
				</ol>

				<Heading level={2}>Try one of these links instead:</Heading>

				<p>
					<Link href="https://www.uoguelph.ca/">Go to the University of Guelph Home Page</Link>
				</p>

				<p>
					<Link href={searchLink}>Search on the University of Guelph</Link>
				</p>
			</Container>
		</Layout>
	);
}
