import { Layout } from "@/components/layout";
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { toTitleCase } from "@/lib/string-utils";
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';

export const GraduateProgramDegreePage = ({ data, isFallback }) => (
		<Layout title="Graduate Programs">
			<GraduateProgramHero />
			<Container className={twJoin(isFallback && 'hidden')} centered>
                <Heading level={1}> {data?.program_parent} | {data?.degree_name} - {toTitleCase(data?.program_type)} ({data?.degree_type})</Heading>
                <GraduateProgramInfo />
                <GraduateProgramSummary data={data} />
			</Container>
		</Layout>
);


