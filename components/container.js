import { twMerge } from 'tailwind-merge';

const Container = ({ as = 'div', centered = false, children, className, ...rest }) => {
	const Tag = as;

	return (
		<Tag {...rest} className={twMerge('container px-4 pb-4 pt-2', centered && 'mx-auto', className)}>
			{children}
		</Tag>
	);
};
export default Container;
