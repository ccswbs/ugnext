import { clamp } from '@/lib/math-utils';
import { twJoin, twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Heading = ({ level, children, className, as, ...rest }) => {
  const headingLevel = clamp(level || 1, 1, 6);
  const Tag = as ?? `h${headingLevel}`;

	return (
		<Tag
			{...rest}
			className={twMerge(
				twJoin(
					'font-bold leading-tight',
					headingLevel === 1 && 'my-7 text-4xl',
					headingLevel === 2 && 'my-3 text-3xl',
					headingLevel === 3 && 'my-3 text-2xl',
					headingLevel === 4 && 'my-3 text-xl',
					(headingLevel === 5 || headingLevel === 6) && 'my-3 text-xl',
				),
				className,
			)}
		>
			{children}
		</Tag>
	);
};

Heading.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * What element to render this button as
   */
  as: PropTypes.string,
};
