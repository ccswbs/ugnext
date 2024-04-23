import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';

const absoluteURLPattern = new RegExp('^(//|[a-z]+:)', 'i');

export const UnstyledLink = ({ href, children, ...rest }) => {
	const isAbsoluteOrHash = absoluteURLPattern.test(href);

	return isAbsoluteOrHash ? (
		<a {...rest} href={href}>
			{children}
		</a>
	) : (
		<NextLink {...rest} href={href}>
			{children}
		</NextLink>
	);
};

export default function Link({ href, color, children, ...rest }) {
	const base = 'underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	const colors = {
		blue: 'text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:ring-blue',
		red: 'text-red hover:text-red-800 focus:text-red-800 focus:ring-red',
	};

	return (
		<UnstyledLink {...rest} href={href} className={twMerge(base, colors[color] ?? colors['blue'], rest?.className)}>
			{children}
		</UnstyledLink>
	);
}
