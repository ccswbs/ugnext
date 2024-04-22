import Head from 'next/head';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';

export default function Home() {
	const [searchLink, setSearchLink] = useState('https://www.uoguelph.ca/search');

	useEffect(() => {
		setSearchLink('https://www.uoguelph.ca/search/#gsc.tab=0&gsc.q=' + window.location.pathname + '&gsc.sort=');
	}, []);

	return (
		<Layout>
			<div className="container-center">
				<h1 className="text-red">HTTP 404 — File not found</h1>
				<h2>Possible reasons for this error:</h2>
				<ol>
					<li>
						You have clicked on an out-of-date bookmark. Once you find the correct page, please update your bookmark to
						avoid this error in the future.
					</li>

					<li>You have mis-typed the web address into the URL bar. Please check your spelling of the URL.</li>

					<li>
						The search engine has an out-of-date listing for this page -{' '}
						<a href="mailto:ithelp@uoguelph.ca">please let us know!</a>
					</li>

					<li>
						The university has removed this page (either on purpose or by mistake) -{' '}
						<a href="mailto:ithelp@uoguelph.ca">please let us know!</a>
					</li>
				</ol>

				<h2 className="text-dark">Try one of these links instead:</h2>

				<p>
					<a href="https://www.uoguelph.ca/">Go to the University of Guelph Home Page</a>
				</p>

				<p>
					<a href={searchLink}>Search on the University of Guelph</a>
				</p>
			</div>
		</Layout>
	);
}
