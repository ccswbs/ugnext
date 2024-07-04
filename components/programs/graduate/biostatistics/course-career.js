import React from 'react';
import { Heading } from '@/components/heading';
import { Columns } from '@/components/columns';
import { List, ListItem } from '@/components/list';
import { CourseCareerNavigation } from '@/components/programs/graduate/biostatistics/course-career-navigation';

export const CourseAndCareer = ({data}) => {
	const leftColumnItems = data.fields_of_study.slice(0, 4);
  	const rightColumnItems = data.fields_of_study.slice(4);
	
	return (
	<div>
		<Heading className='text-red' level={2}>Biostatistics Courses and Careers</Heading>
		<CourseCareerNavigation />
		<div id="courses">
			<p className='pl-2'>This is just a sample of the course options:</p>
			<Columns cols={2} className='pt-0'>
				<div class='px-2'>				
					<List>
					{leftColumnItems.map((course, index) => (
						<ListItem key={index} className="">
						{course}
						</ListItem>
					))}
					</List>					
				</div>

				<div class='px-2'>
					<List>
						{rightColumnItems.slice(0, 3).map((course, index) => (
						<ListItem key={index} className=''>
						{course}
						</ListItem>
					))}
						{rightColumnItems.length > 3 && (
						<ListItem>
							<a href="/programs/graduate" className='text-blue-600 cursor-pointer'>
								View All Biostatistics Graduate Courses
							</a>
						</ListItem>
					)}
					</List>
				</div>
			</Columns>
		</div>

	</div>
	)
};
