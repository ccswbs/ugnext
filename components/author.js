import { twJoin } from 'tailwind-merge';

export const Author = ({ name, info, variant = 'red' }) => (
	<div
		className={twJoin(
			'flex flex-col gap-2 border-l-4 pl-4',
			variant === 'yellow' && 'border-l-yellow',
			variant === 'red' && 'border-l-red',
		)}
	>
		<span className={twJoin('font-bold')}>{name}</span>
		<span className="italic">{info}</span>
	</div>
);
