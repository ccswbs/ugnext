import PropTypes from 'prop-types';

const flatten = (node) => {
	if (Array.isArray(node?.children) && node?.children.length > 0) {
		return [{ title: node?.title, url: node?.url }, ...node.children.map((child) => flatten(child))];
	}

	return { title: node?.title, url: node?.url };
};

export const Header = ({ menu }) => {
	const navigation = menu
		?.map((item) => flatten(item))
		?.map((item) => {
			if (Array.isArray(item)) {
				return {
					title: item[0].title,
					children: item[0].url ? item : item.slice(1),
				};
			}

			return item;
		});

	return (
		<uofg-header>
			{navigation?.map((item) => {
				if (Array.isArray(item.children) && item.children.length > 0) {
					return (
						<ul key={item.title} data-title={item.title}>
							{item.children.map((link) => (
								<li key={link.url}>
									<a href={link?.url}>{link?.title}</a>
								</li>
							))}
						</ul>
					);
				}

				if (typeof item.url === 'string' && typeof item.title === 'string') {
					return (
						<a key={item.url} href={item.url}>
							{item.title}
						</a>
					);
				}

				return null;
			})}
		</uofg-header>
	);
};

const itemType = {
	title: PropTypes.string,
	url: PropTypes.string,
};

itemType.children = PropTypes.arrayOf(PropTypes.shape(itemType));

Header.propTypes = {
	menu: PropTypes.arrayOf(PropTypes.shape(itemType)),
};
