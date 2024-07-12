import React, { useState } from 'react';
import { Heading } from '@/components/heading';
import { CourseCareerNavigation } from '@/components/programs/graduate/sessions/course-career-navigation';
import { CourseTab } from '@/components/programs/graduate/sessions/tabs/courses';
import { FieldsOfStudy } from '@/components/programs/graduate/sessions/tabs/fields-of-study';
import { CareersTab } from '@/components/programs/graduate/sessions/tabs/careers';
import { PartnersTab } from '@/components/programs/graduate/sessions/tabs/partners';

export const CourseAndCareer = ({data}) => {
	//We will use state management to replace passing state between components.
	const [activeTab, setActiveTab] = useState('#courses'); // Initialize active tab state
	//console.log(activeTab);	
	return (
	<div>
		<Heading className='text-red' level={2}>Biostatistics Courses and Careers</Heading>
		<CourseCareerNavigation activeTab={activeTab} setActiveTab={setActiveTab}/>
		<CourseTab data={data} activeTab={activeTab} />
		<FieldsOfStudy data={data} activeTab={activeTab} />
		<CareersTab data={data} activeTab={activeTab} />
		<PartnersTab data={data} activeTab={activeTab} />
	</div>
	)
};
