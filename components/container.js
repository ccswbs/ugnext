import { twJoin, twMerge } from 'tailwind-merge';

export const Container = ({ as = 'div', centered = false, children, className, ...rest }) => {
	const Tag = as;

	return (
		<Tag {...rest} className={twMerge(twJoin('container px-4 pb-4 pt-2', centered && 'mx-auto'), className)}>
			{children}
		</Tag>
	);
};
