import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const Layout = ({ children, menu, footerLinks, title = '', description = '' }) => {
	const { isPreview } = useRouter();

	return (
		<>
			<Head>
				<title>{`${title} | University of Guelph`}</title>
				<meta name="description" content={description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex flex-1 flex-col text-base">
				{isPreview && (
					<div className="h-fit w-full bg-red p-2 text-center text-base font-bold text-white">Preview Mode</div>
				)}
				<Header menu={menu} />
				<main className="mb-auto pb-4 text-base">{children}</main>
				<Footer links={footerLinks} />
			</div>
		</>
	);
};
