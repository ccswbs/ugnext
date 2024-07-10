import React from 'react';
import { Heading } from '@/components/heading';
import { Testimonials } from '@/components/testimonial';

export const ProgramTestimonial = ({data}) => {	
	return (
		<div className='ug-testimonial text-center' >
			<Heading className='' level={3}>Meet the Biostatistics Faculty</Heading>
			<Testimonials data={data} />
		</div>

	)
};
