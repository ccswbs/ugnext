import React from 'react';
import { Heading } from '@/components/heading';
import { Testimonials } from '@/components/testimonial';

export const ProgramTestimonial = ({data}) => {	
	//test data for testimonial
	const testimonialData = [
		{
		  img: "https://www.tutorialrepublic.com/examples/images/clients/1.jpg",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr. Gwendolyn Patterson',
		  description: '1st Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		},
		{
		  img: "https://www.tutorialrepublic.com/examples/images/clients/2.jpg",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr. Montgomery Smith',
		  description: '2nd Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		},
		{
		  img: "https://www.tutorialrepublic.com/examples/images/clients/3.jpg",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr. Ryan D',
		  description: '3rd Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		}
	  ];
	return (
		<div className='ug-testimonial text-center bg-grey-light py-10' >
			<Heading className='' level={3}>Meet the Biostatistics Faculty</Heading>
			<Testimonials testimonialData={testimonialData} />
		</div>

	)
};
