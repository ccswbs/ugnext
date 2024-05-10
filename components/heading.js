import { clamp } from '@/lib/math-utils';
import { twJoin, twMerge } from 'tailwind-merge';

export const Heading = ({ level, children, className, ...rest }) => {
	const headingLevel = clamp(level || 1, 1, 6);
	const Tag = `h${headingLevel}`;

	return (
		<Tag
			{...rest}
			className={twMerge(
				twJoin(
					'mb-4 mt-4 font-bold font-condensed leading-tight',
					headingLevel === 1 && 'text-5xl text-red',
					headingLevel === 2 && 'text-4xl',
					headingLevel === 3 && 'text-3xl',
					headingLevel === 4 && 'text-2xl',
					(headingLevel === 5 || headingLevel === 6) && 'text-xl',
				),
				className,
			)}
		>
			{children}
		</Tag>
	);
};
