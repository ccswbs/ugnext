import React from 'react';
import { useRouter } from 'next/router';
import { twJoin } from 'tailwind-merge';

export const NavigationGraduateProgram = ({ fullWidth = true, links, label, activeTab,setActiveTab }) => {
	//const { pathname } = useRouter();
	const handleTabClick = (id, e) => {
    e.preventDefault(); // Prevents the default action of following the link
    setActiveTab(id); // Update active tab state based on clicked tab id
  };
//console.log(activeTab);
	return (
		<nav aria-label={label}>
			<ul
				className={twJoin('flex flex-col gap-1 border-b-4 border-yellow md:flex-row', fullWidth ? 'w-full' : 'w-fit')}
			>
				{links.map((link, index) => (
					<li className="contents" key={index}>
						<a
							aria-current={activeTab == link?.href ? 'page' : undefined}
							className={twJoin(
								'mb-1 flex items-center justify-center rounded-t-sm bg-gray-200 px-4 py-3 text-center text-lg font-bold text-black transition-colors hover:bg-gray-300 focus:bg-grey-300 focus:outline-none aria-page-current:mb-0 aria-page-current:border-2 aria-page-current:border-yellow aria-page-current:bg-yellow',
								fullWidth && 'flex-1',
							)}
							href={link?.href}
							onClick={(e) => handleTabClick(link.href, e)}
						>
							{link?.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};
