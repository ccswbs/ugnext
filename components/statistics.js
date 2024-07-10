import { twJoin } from 'tailwind-merge';

export const Statistics = ({ data, variant = 'gradient-of-solid-colours' }) => {
	const divisibleByTwo = data.length % 2 === 0;
	const divisibleByThree = data.length % 3 === 0;
	const divisibleByFour = data.length % 4 === 0;

	const colors = [
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-black text-white',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-black',
		),
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-red text-white',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-red',
		),
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-yellow text-black',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-yellow',
		),
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-light-blue text-black',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-light-blue',
		),
	];

	return (
		<dl
			className={twJoin(
				'mx-auto my-4 flex flex-col flex-wrap sm:flex-row',
				divisibleByFour && 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
				divisibleByThree && !divisibleByFour && 'grid grid-cols-1 lg:grid-cols-3',
				divisibleByTwo && !divisibleByFour && 'grid grid-cols-1 sm:grid-cols-2',
				variant !== 'gradient-of-solid-colours' && 'gap-4',
			)}
		>
			{data.map((statistic, index) => {
				const color = colors[index % colors.length];
				const { represents, value } = statistic;

				return (
					<div key={index} className={twJoin('relative flex flex-1 flex-col justify-around gap-2 p-6 ', color)}>
						<dt className="hyphens-auto break-words text-center text-xl font-bold leading-tight md:text-3xl">
							{value}
						</dt>
						<dd className="text-normal text-center font-normal md:text-lg">{represents}</dd>
					</div>
				);
			})}
		</dl>
	);
};
