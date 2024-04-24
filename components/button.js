import { twMerge } from 'tailwind-merge';
import { UnstyledLink } from '@/components/link';

const Button = ({ as, color = 'none', outlined = false, href, children, className, ...rest }) => {
	const Tag = as ? as : typeof href === 'string' ? UnstyledLink : 'button';

	const base =
		'inline-flex items-center justify-center px-4 py-3 text-base font-medium no-underline shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	const outlinedBase = 'btn border-2 border-transparent bg-transparent';

	const colors = {
		red: 'bg-red text-white hover:bg-red-800 hover:text-white focus:bg-red-800 focus:text-white focus:ring-red',
		yellow:
			'bg-yellow text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black focus:ring-yellow',
		blue: 'bg-blue text-black hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white focus:ring-blue',
		green: '',
		grey: 'bg-grey text-black hover:bg-grey-400 hover:text-black focus:bg-grey-400 focus:text-black focus:ring-grey',
		none: '',
	};

	const outlinedColors = {
		red: 'border-red text-red hover:bg-red hover:text-white focus:bg-red focus:text-white focus:ring-red',
		yellow:
			'border-yellow text-yellow hover:bg-yellow hover:text-black focus:bg-yellow focus:text-black focus:ring-yellow',
		blue: 'border-blue text-blue hover:bg-blue hover:text-black focus:bg-blue focus:text-black focus:ring-blue',
		green: '',
		grey: 'border-grey-300 text-black hover:bg-grey-300 hover:text-black focus:bg-grey focus:text-white focus:ring-grey',
		none: '',
	};

	return (
		<Tag
			{...rest}
			href={href}
			className={twMerge(
				base,
				!outlined && (colors[color] ?? colors['none']),
				outlined && (outlinedColors[color] ?? outlinedColors['none']),
				outlined && outlinedBase,
				className,
			)}
		>
			{children}
		</Tag>
	);
};
export default Button;
