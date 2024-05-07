import { twJoin, twMerge } from 'tailwind-merge';
import { UnstyledLink } from '@/components/link';

export const Button = ({ as, color = 'none', outlined = false, href, children, className, ...rest }) => {
	const Tag = as ? as : typeof href === 'string' ? UnstyledLink : 'button';

	return (
		<Tag
			{...rest}
			href={href}
			className={twMerge(
				'inline-flex items-center justify-center px-4 py-3 text-base font-medium no-underline shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
				outlined &&
					twJoin(
						color === 'red' &&
							'border-red text-red hover:bg-red hover:text-white focus:bg-red focus:text-white focus:ring-red',
						color === 'yellow' &&
							'border-yellow text-yellow hover:bg-yellow hover:text-black focus:bg-yellow focus:text-black focus:ring-yellow',
						color === 'blue' &&
							'border-blue text-blue hover:bg-blue hover:text-black focus:bg-blue focus:text-black focus:ring-blue',
						color === 'green' &&
							'border-green text-green hover:bg-green hover:text-white focus:bg-green focus:text-white focus:ring-green',
						color === 'grey' &&
							'border-grey-300 text-black hover:bg-grey-300 hover:text-black focus:bg-grey focus:text-white focus:ring-grey',
					),
				!outlined &&
					twJoin(
						color === 'red' &&
							'bg-red text-white hover:bg-red-800 hover:text-white focus:bg-red-800 focus:text-white focus:ring-red',
						color === 'yellow' &&
							'bg-yellow text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black focus:ring-yellow',
						color === 'blue' &&
							'bg-blue text-black hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white focus:ring-blue',
						color === 'green' &&
							'bg-green text-white hover:bg-green-800 hover:text-white focus:bg-green-800 focus:text-white focus:ring-green',
						color === 'grey' &&
							'bg-grey text-black hover:bg-grey-400 hover:text-black focus:bg-grey-400 focus:text-black focus:ring-grey',
					),
				className,
			)}
		>
			{children}
		</Tag>
	);
};
