import { Statistics } from '@/components/statistics';
import { Link } from '@/components/link';

export const Rankings = () => (
	<Statistics
		variant="solid-colors-no-gap"
		data={[
			{
				represents: (
					<Link
						color="none"
						href="https://sustainabilitymag.com/sustainability/inside-the-worlds-most-sustainable-university"
					>
						QS Sustainability Rankings, 2023
					</Link>
				),
				value: (
					<>
						Top 10% for <strong>Sustainability</strong>
					</>
				),
			},
			{
				represents: (
					<Link
						color="none"
						href="https://education.macleans.ca/feature/canadas-best-comprehensive-universities-rankings-2024/"
					>
						Macleans, 2024
					</Link>
				),
				value: (
					<>
						A <strong>Top Comprehensive University</strong> in Canada
					</>
				),
			},
			{
				represents: (
					<Link color="none" href="https://www.timeshighereducation.com/world-university-rankings/by-subject">
						Times Higher Education, 2023
					</Link>
				),
				value: (
					<>
						<strong>Top 150</strong> in the world for <strong>Life Sciences</strong>
					</>
				),
			},
			{
				represents: (
					<Link color="none" href="https://researchinfosource.com/top-50-research-universities/2023">
						Infosource 2023
					</Link>
				),
				value: (
					<>
						<strong>Top Five in Research</strong> among Comprehensive Universities in Canada
					</>
				),
			},
		]}
	/>
);
