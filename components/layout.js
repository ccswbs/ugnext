import Header from '@/components/header';
import Footer from '@/components/footer';
import Head from 'next/head';

const Layout = ({ children, menu, title = '', description = '', preview = false }) => {
	return (
		<>
			<Head>
				<title>{`${title} | University of Guelph`}</title>
				<meta name="description" content={description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex flex-1 flex-col text-base">
				{preview && (
					<div className="h-fit w-full bg-red p-2 text-center text-base font-bold text-white">Preview Mode</div>
				)}
				<Header menu={menu} />
				<main className="mb-auto text-base">{children}</main>
				<Footer />
			</div>
		</>
	);
};

export default Layout;
