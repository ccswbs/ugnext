import React from 'react';
import { Button } from '@/components/button';

/* @Todo: 
- Make index unique
- set up loop for outputing links based on links
*/

export const SubNavigation = ({ links, label }) => {
	return (
		<div className="flex flex-col">
			<span className="mb-3 lg:self-center">
				<strong>{label}</strong>
			</span>
			<ul className="flex flex-row gap-3">
				{links.map((link, index) => (
					<li key={index}>
						<Button color="red" className="lg:h-20" outlined>
							<a href={link?.href}>{link?.label}</a>
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
};

export const ButtonNavigation = ({ fullWidth = true, links, label }) => (
	<div className="mb-10">
		<h2 className="sr-only">{label}</h2>
		<nav>
			<ul className="flex flex-col content-end gap-4 lg:flex-row lg:gap-10">
				<li className="flex lg:self-end">
					<Button color="red" outlined className="lg:h-20">
						Program Home
					</Button>
				</li>

				<li>
					<SubNavigation
						label="Undergraduate"
						links={[
							{ href: '#', label: 'Major' },
							{ href: '#', label: 'Minor' },
						]}
					/>
				</li>
				<li>
					<SubNavigation
						label="Graduate"
						links={[
							{ href: '#', label: 'Masters Course-based' },
							{ href: '#', label: 'Masters Thesis-based' },
							{ href: '#', label: 'Collaborative Specializations' },
						]}
					/>
				</li>
				<li>
					<SubNavigation
						label="Doctoral"
						links={[
							{ href: '#', label: 'Doctoral Degree' },
							{ href: '#', label: 'Postdoctoral Research' },
						]}
					/>
				</li>
			</ul>
		</nav>
	</div>
);
