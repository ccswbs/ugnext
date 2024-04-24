import { twJoin, twMerge } from 'tailwind-merge';

const Container = ({ as = 'div', centered = false, children, className, ...rest }) => {
	const Tag = as;
	const classes = twJoin('container px-4 pb-4 pt-2', centered && 'mx-auto');

	return (
		<Tag {...rest} className={twMerge(classes, className)}>
			{children}
		</Tag>
	);
};
export default Container;
