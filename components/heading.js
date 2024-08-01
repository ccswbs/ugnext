import { clamp } from '@/lib/math-utils';
import { twJoin, twMerge } from 'tailwind-merge';

export const Heading = ({ level, children, className, as, ...rest }) => {
	const headingLevel = clamp(level || 1, 1, 6);
	const Tag = as ?? `h${headingLevel}`;

	return (
		<Tag
			{...rest}
			className={twMerge(
				twJoin(
					'font-condensed font-bold leading-tight',
					headingLevel === 1 && 'mb-7 mt-7 text-5xl text-red',
					headingLevel === 2 && 'mb-3 mt-3 text-4xl',
					headingLevel === 3 && 'mb-3 mt-3 text-3xl',
					headingLevel === 4 && 'mb-3 mt-3 text-2xl',
					(headingLevel === 5 || headingLevel === 6) && 'mb-3 mt-3 text-xl',
				),
				className,
			)}
		>
			{children}
		</Tag>
	);
};
