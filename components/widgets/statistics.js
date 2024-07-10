import { Statistics as StatisticsComponent } from '@/components/statistics';

export const Statistics = ({ data }) => (
	<StatisticsComponent
		data={data?.content.map((statistic) => {
			return { ...statistic, represents: statistic.represents.processed, value: statistic.value };
		})}
		variant={data?.style?.name?.toLowerCase().replace(/\s/g, '-')}
	/>
);
