import Head from 'next/head';
import Layout from '@/components/layout';

export default function Home() {
	return (
		<Layout>
			<Head>
				<title>Next.js Starter!</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<p className="description">
				Get started by editing <code>pages/index.js</code>
			</p>
		</Layout>
	);
}
