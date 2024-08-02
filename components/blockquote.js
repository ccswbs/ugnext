import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@awesome.me/kit-7993323d0c/icons/sharp/solid';
import { twJoin, twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Blockquote = ({ className, children, color = 'yellow' }) => {
	const markClasses = twJoin(
		'mr-[0.2em] inline-block h-[1em]',
		color === 'yellow' && 'text-yellow',
		color === 'red' && 'text-red',
	);

	return (
		<blockquote
			className={twMerge(
				'block w-full text-center text-3xl font-thin italic sm:text-4xl lg:text-3xl xl:text-4xl',
				className,
			)}
		>
			<FontAwesomeIcon icon={faQuoteLeft} className={markClasses} />
			<span>{children}</span>
			<FontAwesomeIcon icon={faQuoteRight} className={markClasses} />
		</blockquote>
	);
};

Blockquote.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	color: PropTypes.oneOf(['yellow', 'red']),
};