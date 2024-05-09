import { useEffect } from 'react';

export const Footer = ({ links }) => (
	<uofg-footer>
		{Array.isArray(links) &&
			links?.map((link) => {
				if (typeof link.href === 'string' && typeof link.text === 'string') {
					return (
						<a key={link.href} href={link.href}>
							{link.text}
						</a>
					);
				}
			})}
	</uofg-footer>
);
