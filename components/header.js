import { useEffect } from 'react';

const Header = ({ menu }) => {
	useEffect(() => {
		import('@uoguelph/web-components/uofg-header');
	}, []);

	return (
		<uofg-header>
			{menu?.map((item) => {
				if (typeof item.title === 'string' && Array.isArray(item.links)) {
					return (
						<ul key={item.title} data-title={item.title}>
							{item.links.map((link) => (
								<li key={link.href}>
									<a href={link?.href}>{link?.text}</a>
								</li>
							))}
						</ul>
					);
				}

				if (typeof item.href === 'string' && typeof item.text === 'string') {
					return (
						<a key={item.href} href={item.href}>
							{item.text}
						</a>
					);
				}

				return null;
			})}
		</uofg-header>
	);
};

export default Header;
