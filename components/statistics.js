import { twJoin } from 'tailwind-merge';

export const StatisticsGradient = ({ data }) => {
	const divisibleByTwo = data.length % 2 === 0;
	const divisibleByThree = data.length % 3 === 0;
	const divisibleByFour = data.length % 4 === 0;

	const colorClasses = ['bg-black text-white', 'bg-red text-white', 'bg-yellow text-black', 'bg-light-blue text-black'];

	return (
		<dl
			className={twJoin(
				'mx-auto flex flex-col flex-wrap sm:flex-row',
				divisibleByFour && 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
				divisibleByThree && !divisibleByFour && 'grid grid-cols-1 lg:grid-cols-3',
				divisibleByTwo && !divisibleByFour && 'grid grid-cols-1 sm:grid-cols-2',
			)}
		>
			{data.map((statistic, index) => {
				const color = colorClasses[index % colorClasses.length];
				const { represents, value } = statistic;

				return (
					<div
						key={index}
						className={twJoin(
							'relative flex flex-1 flex-col justify-around gap-2 p-6 md:min-h-[200px] lg:min-h-[285px]',
							color,
						)}
					>
						<dt className="hyphens-auto break-words text-center text-xl font-normal leading-tight md:text-3xl">
							{value}
						</dt>
						<dd className="text-normal text-center font-normal md:text-lg">{represents}</dd>
					</div>
				);
			})}
		</dl>
	);
};

export const Statistics = ({ data, variant = 'gradient' }) => {
	switch (variant) {
		case 'solid-colors':
			return <></>;
		case 'left-border':
			return <></>;
		case 'light-blue':
			return <></>;
		default:
			return <StatisticsGradient data={data} />;
	}
};
