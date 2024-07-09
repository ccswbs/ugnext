import React from 'react';
import { CourseAndCareer } from '@/components/programs/graduate/sessions/course-career';
import { WhatIs} from '@/components/programs/graduate/sessions/what-is';

export const GraduateProgramInfo = ({data}) => (
	<div className='md:w-3/4'>
	<WhatIs />
	<CourseAndCareer data={data}/>
	</div>
);
