import { twJoin, twMerge } from 'tailwind-merge';
import { UnstyledLink } from '@/components/link';
import PropTypes from 'prop-types';

/**
 * A basic button which can be used as a link or a normal button.
 */
export const Button = ({
	as,
	color = 'none',
	outlined = false,
	href,
	children,
	className,
	disabled = false,
	type = 'button',
	...rest
}) => {
	const Tag = as ? as : typeof href === 'string' ? UnstyledLink : 'button';

	return (
		<Tag
			{...rest}
			href={href}
			type={href ? undefined : type}
			className={twMerge(
				'inline-flex items-center justify-center px-4 py-3 text-base font-medium no-underline shadow-sm transition-colors focus:outline-none',
				!disabled && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2',
				outlined &&
					!disabled &&
					twJoin(
						'border-2',
						color === 'red' &&
							'border-red text-red hover:bg-red hover:text-white focus:bg-red focus:text-white focus:ring-red',
						color === 'yellow' &&
							'border-yellow text-yellow hover:bg-yellow hover:text-black focus:bg-yellow focus:text-black focus:ring-yellow',
						color === 'blue' &&
							'border-blue text-blue hover:bg-blue hover:text-white focus:bg-blue focus:text-white focus:ring-blue',
						color === 'green' &&
							'border-green text-green hover:bg-green hover:text-white focus:bg-green focus:text-white focus:ring-green',
						color === 'grey' &&
							'border-grey-300 text-black hover:bg-grey-300 hover:text-black focus:bg-grey focus:text-white focus:ring-grey',
					),
				!outlined &&
					!disabled &&
					twJoin(
						color === 'red' &&
							'bg-red text-white hover:bg-red-800 hover:text-white focus:bg-red-800 focus:text-white focus:ring-red',
						color === 'yellow' &&
							'bg-yellow text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black focus:ring-yellow',
						color === 'blue' &&
							'bg-blue text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:ring-blue',
						color === 'green' &&
							'bg-green text-white hover:bg-green-800 hover:text-white focus:bg-green-800 focus:text-white focus:ring-green',
						color === 'grey' &&
							'bg-grey text-black hover:bg-grey-400 hover:text-black focus:bg-grey-400 focus:text-black focus:ring-grey',
					),
				disabled &&
					twJoin(
						'cursor-not-allowed border-gray-300 text-gray-400',
						outlined && 'border border-gray-300',
						!outlined && 'bg-gray-300',
					),
				className,
			)}
		>
			{children}
		</Tag>
	);
};

Button.propTypes = {
	/**
	 * What element to render this button as
	 */
	as: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	/**
	 * What background color to use
	 */
	color: PropTypes.oneOf(['red', 'yellow', 'blue', 'green', 'grey', 'none']),
	/**
	 * What style of button to use
	 */
	outlined: PropTypes.bool,
	/**
	 * The url of the page this button will navigate to.
	 */
	href: PropTypes.string,
	/**
	 *
	 */
	disabled: PropTypes.bool,
	children: PropTypes.node,
	/**
	 * Add custom styles using tailwind
	 */
	className: PropTypes.string,
	/**
	 * The type of this button when present within a HTML form
	 */
	type: PropTypes.oneOf(['button', 'submit']),
};
