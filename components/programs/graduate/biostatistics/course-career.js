import React, { useState } from 'react';
import { Heading } from '@/components/heading';
import { CourseCareerNavigation } from '@/components/programs/graduate/biostatistics/course-career-navigation';
import { CourseTab } from '@/components/programs/graduate/biostatistics/tabs/courses';
import { FieldsOfStudy } from '@/components/programs/graduate/biostatistics/tabs/fields-of-study';
import { SpotlightCards } from '@/components/home/spotlight-cards';

export const CourseAndCareer = ({data}) => {
	const [activeTab, setActiveTab] = useState('#courses'); // Initialize active tab state
	//console.log(activeTab);
	const cards = data.spot_light_cards;
	console.log(cards);
	return (
	<div>
		<Heading className='text-red' level={2}>Biostatistics Courses and Careers</Heading>
		<CourseCareerNavigation setActiveTab={setActiveTab}/>
		<CourseTab data={data} activeTab={activeTab} />
		<FieldsOfStudy data={data} activeTab={activeTab} />
		
	</div>
	)
};
