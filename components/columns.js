import { twJoin, twMerge } from 'tailwind-merge';

export const Columns = ({ as = 'div', cols, centered, className, ...rest }) => {
	const Tag = as;

	return (
		<Tag
        {...rest}
			className={twMerge(twJoin(`columns grid grid-cols-1 gap-4 md:grid-cols-${cols}`, centered && 'mx-auto'), className)}
		>			
		</Tag>
	);
};
