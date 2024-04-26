import { useEffect } from 'react';
const Footer = ({ links }) => {
	useEffect(() => {
		import('@uoguelph/web-components/uofg-footer');
	}, []);

	return (
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
};

export default Footer;
