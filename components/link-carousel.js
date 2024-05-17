import { useState } from 'react';
import { UnstyledLink } from '@/components/link';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@awesome.me/kit-7993323d0c/icons/classic/solid';

export const LinkCarousel = ({ links }) => {
	const [activeLink, setActiveLink] = useState(links[0]);

	return (
		<div className="relative w-full">
			<div className="absolute left-0 top-0 z-0 h-full w-full">
				{links.map((link, index) => (
					<Transition
						key={link.url}
						show={link === activeLink}
						enter="transition-opacity duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Image
							className="absolute left-0 top-0 h-full object-cover object-left"
							src={link.image.url}
							alt={link.image?.alt}
						/>
					</Transition>
				))}
			</div>

			<div className="absolute bottom-0 left-0 z-10 w-full px-4 py-4 text-white">{activeLink?.image?.caption}</div>
			<div className="absolute bottom-0 left-0 z-0 h-1/2 w-full bg-gradient-to-t from-black/60 to-black/0"></div>

			<div className="relative z-10 ml-auto flex w-full flex-col gap-2 md:w-1/3">
				{links.map((link, index) => (
					<UnstyledLink
						onMouseEnter={() => setActiveLink(link)}
						key={index}
						href={link.url}
						className="flex flex-1 items-center justify-between bg-black/60 p-7 text-xl text-white backdrop-blur transition-colors hover:bg-yellow hover:text-black focus:bg-yellow focus:text-black focus-visible:outline-none"
					>
						<span>{link.title}</span>

						<FontAwesomeIcon className="h-[1em]" icon={faChevronRight} />
					</UnstyledLink>
				))}
			</div>
		</div>
	);
};
