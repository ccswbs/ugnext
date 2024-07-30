import { twJoin, twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Container = ({ as = 'div', centered = false, children, className, ...rest }) => {
	const Tag = as;

	return (
		<Tag
			{...rest}
			className={twMerge(twJoin('container max-w-max-content px-4 pb-4 pt-2', centered && 'mx-auto'), className)}
		>
			{children}
		</Tag>
	);
};

Container.propTypes = {
	as: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	centered: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string,
};
