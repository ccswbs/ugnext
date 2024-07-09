import { Layout } from "@/components/layout";
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { toTitleCase } from "@/lib/string-utils";
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';
import { CollaborativeSpecializations } from '@/components/programs/graduate/sessions/collaborative-specializations';
import { Testimonial } from '@/components/programs/graduate/sessions/testimonial';
import { HowToApply } from '@/components/programs/graduate/sessions/how-to-apply';
import { FundYourEducation } from '@/components/programs/graduate/sessions/fund-your-education';


export const GraduateProgramDegreePage = ({ data, isFallback }) => (
		<Layout title="Graduate Programs">			
			<GraduateProgramHero />					
			<Container className={twJoin(isFallback && 'hidden', 'md:px-20 max-w-1680 mx-auto')} centered>				
				{/* add test breadcrumbs, will replace breadcrumbs code here once merge with basic page branch*/}
				<div>
					<p>
						Academics &gt; Graduate &gt; Biostatistics &gt; Master's Degree(Thesis-Based)
					</p>
				</div>
				<Heading level={1}> {data?.program_parent} | {data?.degree_name} - {toTitleCase(data?.program_type)} ({data?.degree_type})</Heading>
				<div className='mx-auto mt-4 md:flex gap-8'>
					<GraduateProgramInfo data={data} />					
					<GraduateProgramSummary data={data} />					
				</div>
				<Testimonial data={data}/>
				<CollaborativeSpecializations data={data}/>
				<HowToApply />
				<FundYourEducation />
				
			</Container>
		</Layout>
);


