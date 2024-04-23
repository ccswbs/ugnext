import NextLink from 'next/link';

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

export default function Link({ href, children, ...rest }) {
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
}
