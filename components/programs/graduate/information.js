import React from 'react';
import { CourseAndCareer } from '@/components/programs/graduate/biostatistics/course-career';
import { WhatIsBiostatistics } from '@/components/programs/graduate/biostatistics/what-is-biostatistics';

export const GraduateProgramInfo = ({data}) => (
	<div className='md:w-3/4'>
	<WhatIsBiostatistics />
	<CourseAndCareer data={data}/>
	</div>
);
