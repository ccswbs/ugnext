import NextLink from 'next/link';

const absoluteURLPattern = new RegExp('^(//|[a-z]+:)', 'i');

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
