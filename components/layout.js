import '@uoguelph/web-components/stylesheet';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Head from 'next/head';

export const Layout = ({ children, menu, footerLinks, title = '', description = '', preview = false }) => (
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
			<main className="mb-auto pb-4 text-base">{children}</main>
			<Footer links={footerLinks} />
		</div>
	</>
);
