import Header from '@/components/header';
import Footer from '@/components/footer';
import Head from 'next/head';

export default function Layout({ children, menu, title = '', description = '', preview = false }) {
	return (
		<>
			<Head>
				<title>{`${title} | University of Guelph`}</title>
				<meta name="description" content={description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex flex-1 flex-col">
				<Header menu={menu} />
				<main className="container-center mb-auto text-base">{children}</main>
				<Footer />
			</div>
		</>
	);
}
