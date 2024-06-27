import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGryphonStatue } from '@awesome.me/kit-7993323d0c/icons/kit/custom';
import { Transition } from '@headlessui/react';
import { faSpinner } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { twMerge } from 'tailwind-merge';

export const Layout = ({ children, className, menu, footerLinks, title = '', description = '', image = null }) => {
	const { isPreview, isFallback } = useRouter();
	const pageTitle = title
		? `${title} | University of Guelph`
		: isFallback
			? 'Loading... | University of Guelph'
			: 'University of Guelph';
	const pageDescription =
		description ||
		'The University of Guelph, and everyone who studies here, explores here, teaches here and works here is committed to one simple purpose: To Improve Life';
	const pageImage = image ?? {
		src: 'https://www.uoguelph.ca/img/ug-social-thumb.jpg',
		alt: 'University of Guelph logo',
	};

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={pageDescription} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={pageImage.src} />
				<meta property="og:image:alt" content={pageImage.alt} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:creator" content="@uofg" />
				<meta name="twitter:description" content={pageDescription} />
				<meta name="twitter:title" content={pageTitle} />
				<meta name="twitter:image" content={pageImage.src} />
				<meta name="twitter:image:alt" content={pageImage.alt} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Transition
				show={isFallback}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-150"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center gap-6 bg-white text-red">
					<FontAwesomeIcon className="text-9xl" icon={faGryphonStatue} />

					<div className="flex items-center gap-2">
						<FontAwesomeIcon className="w-[1.5em] animate-spin" icon={faSpinner} />
						<span className="font-condensed text-3xl">Loading</span>
					</div>
				</div>
			</Transition>

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
				<main className={twMerge('flex-1 pb-4 text-base', className)}>{children}</main>
				<Footer links={footerLinks} />
			</div>
		</>
	);
};
