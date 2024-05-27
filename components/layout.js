import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/button';

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
					<div className="sticky left-0 top-0 z-20 flex h-fit w-full items-center justify-center gap-2 bg-red p-2 text-center text-base font-bold text-white">
						<span>You are currently in Preview Mode.</span>

						<Button color="yellow" className="p-2" href="/api/exit-preview">
							Exit Preview Mode
						</Button>
					</div>
				)}
				<Header menu={menu} />
				<main className="mb-auto pb-4 text-base">{children}</main>
				<Footer links={footerLinks} />
			</div>
		</>
	);
};
