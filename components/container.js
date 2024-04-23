import classNames from 'classnames';

const Container = ({ as = 'div', centered = false, children, ...rest }) => {
	const Tag = as;

	return (
		<Tag {...rest} className={classNames('container px-4 pb-4 pt-2', { 'mx-auto': centered }, rest?.className ?? '')}>
			{children}
		</Tag>
	);
};
export default Container;
