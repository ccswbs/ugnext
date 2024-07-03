import { twJoin } from 'tailwind-merge';

export const Author = ({ name, info, variant = 'light' }) => (
	<div
		className={twJoin(
			'flex flex-col gap-2 border-l-4 pl-4',
			variant === 'light' && 'border-l-yellow text-white',
			variant === 'dark' && 'border-l-red text-black',
		)}
	>
		<span className={twJoin('font-bold')}>{name}</span>
		<span className="italic">{info}</span>
	</div>
);
