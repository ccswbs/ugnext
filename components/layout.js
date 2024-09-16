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
import PropTypes from 'prop-types';
import AppArmor from '@/components/app-armor';

const DEFAULT_TITLE = 'University of Guelph - Improve Life';
const FALLBACK_TITLE = 'Loading... | University of Guelph';

const DEFAULT_DESCRIPTION =
	'The University of Guelph, and everyone who studies here, explores here, teaches here and works here is committed to one simple purpose: To Improve Life';

const DEFAULT_SOCIAL_IMAGE = {
	src: 'https://www.uoguelph.ca/img/ug-social-thumb.jpg',
	alt: 'University of Guelph logo',
};

export const Layout = ({ children, className, menu, footerLinks, title = '', description = '', image = null }) => {
	const { isPreview, isFallback } = useRouter();
	const pageTitle = title ? `${title} | University of Guelph` : isFallback ? FALLBACK_TITLE : DEFAULT_TITLE;
	const pageDescription = description || DEFAULT_DESCRIPTION;
	const pageImage = image ?? DEFAULT_SOCIAL_IMAGE;

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

			<Transition show={isFallback}>
				<div className="fixed left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center gap-6 bg-white text-red transition-opacity duration-300 data-[closed]:opacity-0">
					<FontAwesomeIcon className="text-9xl" icon={faGryphonStatue} />

					<div className="flex items-center gap-2">
						<FontAwesomeIcon className="w-[1.5em] animate-spin" icon={faSpinner} />
						<span className="font-condensed text-3xl">Loading</span>
					</div>
				</div>
			</Transition>

			{!isFallback && (
				<>
					<AppArmor />

					<a
						className="sr-only focus:not-sr-only fixed top-0 left-0 z-[1000] !w-fit bg-yellow underline px-0 focus:px-2 transition-[padding]"
						href="#content"
					>
						Skip to main content
					</a>
				</>
			)}

			<div className="flex flex-1 flex-col">
				{isPreview && (
					<div className="sticky left-0 top-0 z-20 flex h-fit w-full items-center justify-center gap-2 bg-red p-2 text-center text-base font-bold text-white">
						<span>You are currently in Preview Mode.</span>

						<Button color="yellow" className="p-2" href="/api/exit-preview">
							Exit Preview Mode
						</Button>
					</div>
				)}

				<Header menu={menu} />
				<main id="content" className={twMerge('flex-1 pb-4', className)}>
					{children}
				</main>
				<Footer links={footerLinks} />
			</div>
		</>
	);
};

const itemType = {
	title: PropTypes.string,
	url: PropTypes.string,
};

itemType.children = PropTypes.arrayOf(PropTypes.shape(itemType));

Layout.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	menu: PropTypes.arrayOf(PropTypes.shape(itemType)),
	footerLinks: PropTypes.arrayOf(
		PropTypes.shape({
			href: PropTypes.string.isRequired,
			text: PropTypes.string.isRequired,
		}),
	),
	title: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.shape({
		src: PropTypes.string,
		alt: PropTypes.string,
	}),
};
