import { Layout } from "@/components/layout";
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { toTitleCase } from "@/lib/string-utils";
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';
import { FundYourEducation } from '@/components/programs/graduate/biostatistics/fund-your-education';

export const GraduateProgramDegreePage = ({ data, isFallback }) => (
		<Layout title="Graduate Programs">
			<GraduateProgramHero />			
			<Container className={twJoin(isFallback && 'hidden', 'md:px-20 max-w-1680 mx-auto')} centered>				
				<Heading level={1}> {data?.program_parent} | {data?.degree_name} - {toTitleCase(data?.program_type)} ({data?.degree_type})</Heading>
				<div className='mx-auto mt-4 md:flex gap-6'>
					<GraduateProgramInfo data={data} />					
					<GraduateProgramSummary data={data} />					
				</div>
				<FundYourEducation />
			</Container>
		</Layout>
);


