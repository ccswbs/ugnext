import React from 'react';
import { useRouter } from 'next/router';
import { twJoin } from 'tailwind-merge';

export const Navigation = ({ fullWidth = true, links, label }) => {
	const { pathname } = useRouter();

	return (
		<nav aria-label={label}>
			<ul className={twJoin('flex gap-1 border-b-4 border-yellow', fullWidth ? 'w-full' : 'w-fit')}>
				{links.map((link, index) => (
					<li className="contents" key={index}>
						<a
							aria-current={pathname === link?.href ? 'page' : undefined}
							className={twJoin(
								'aria-page-current:mb-0 aria-page-current:border-2 aria-page-current:border-yellow aria-page-current:bg-yellow mb-1 rounded-t-sm bg-gray-200 px-4 py-3 text-center text-lg font-bold text-black transition-colors hover:bg-gray-300 focus:bg-grey-300 focus:outline-none',
								fullWidth && 'flex-1',
							)}
							href={link?.href}
						>
							{link?.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};
