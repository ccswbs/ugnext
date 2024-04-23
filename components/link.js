import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';


export const UnstyledLink = ({ href, children, ...rest }) => {
	const pattern = new RegExp('^(//|[a-z]+:)', 'i');

	const isExternal = /^(\/\/|[a-z]+:)/.test(href);

	return isExternal ? (
		<a {...rest} href={href}>
			{children}
		</a>
	) : (
		<NextLink {...rest} href={href}>
			{children}
		</NextLink>
	);
};

const Link = ({ href, color, children, className, ...rest }) => {
	const base = 'underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	const colors = {
		blue: 'text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:ring-blue',
		red: 'text-red hover:text-red-800 focus:text-red-800 focus:ring-red',
		yellow: 'text-yellow hover:text-yellow-600 focus:text-yellow-600 focus:ring-yellow',
		green: '',
		grey: 'text-grey hover:text-grey-600 focus:text-grey-600 focus:ring-grey focus:ring-grey',
	};

	return (
		<UnstyledLink {...rest} href={href} className={twMerge(base, colors[color] ?? colors['blue'], className)}>
			{children}
		</UnstyledLink>
	);
}

export default Link;