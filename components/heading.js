import { clamp } from '@/lib/math-utils';
import { twMerge } from 'tailwind-merge';

const Heading = ({ level, children, className, ...rest }) => {
	const headingLevel = clamp(level || 1, 1, 6);
	const Tag = `h${headingLevel}`;
	const base = 'mb-4 mt-4 font-bold leading-tight';
	const levels = {
		1: 'text-5xl text-red',
		2: 'text-4xl',
		3: 'text-2xl',
		4: 'text-xl',
		5: 'text-lg',
		6: 'text-lg',
	};

	return (
		<Tag {...rest} className={twMerge(base, levels[headingLevel], className)}>
			{children}
		</Tag>
	);
};

export default Heading;