export const Header = ({ menu }) => (
	<uofg-header>
		{menu?.map((item) => {
			if (typeof item.title === 'string' && Array.isArray(item.links) && item.links.length > 0) {
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
