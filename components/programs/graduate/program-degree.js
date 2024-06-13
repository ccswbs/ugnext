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
        <div className="pt-1 grid xl:grid-cols-12 xl:gap-x-10">
            <div className='xl:col-span-9'>
              <GraduateProgramInfo />
            </div>

            <div className='xl:col-span-3'>
              <GraduateProgramSummary data={data} />
            </div>
          </div>
			</Container>
		</Layout>
);


