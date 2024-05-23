import { useEffect, useRef, useState } from 'react';
import { UnstyledLink } from '@/components/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { twJoin } from 'tailwind-merge';

export const LinkCarousel = ({ links }) => {
	const [activeLink, setActiveLink] = useState(links[0]);
	const previousActiveLink = useRef(null);

	return (
		<div className="relative w-full">
			<div className="absolute left-0 top-0 z-0 h-full w-full md:bg-black">
				{links.map((link) => (
					<Image
						key={link.url}
						className={twJoin(
							'absolute left-0 top-0 hidden h-full object-cover object-left md:block',
							link !== activeLink && link !== previousActiveLink.current && '-z-10',
							link === activeLink && 'z-10',
							link === activeLink && previousActiveLink.current !== null && 'animate-fade',
							link === previousActiveLink.current && 'z-0',
						)}
						src={link.image.url}
						alt={link.image?.alt}
					/>
				))}
			</div>

			<div className="absolute bottom-0 left-0 z-10 hidden w-full px-4 py-4 text-white md:block">
				{activeLink?.image?.caption}
			</div>

			<div className="absolute bottom-0 left-0 z-0 hidden h-1/2 w-full bg-gradient-to-t from-black/60 to-black/0 md:block"></div>

			<div className="relative z-10 ml-auto flex w-full flex-col gap-2 md:w-1/3">
				{links.map((link, index) => (
					<UnstyledLink
						onMouseEnter={() => {
							setActiveLink((previous) => {
								previousActiveLink.current = previous;
								return link;
							});
						}}
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
