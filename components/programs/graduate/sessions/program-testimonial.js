import React from 'react';
import {MeetFaculty} from '@/components/meet-faculty';
export const ProgramTestimonial = () => {	
	//test data for testimonial	
	const testimonialData = [
		{
		  img: "https://placehold.co/330x330/png",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr. Gwendolyn Patterson',
		  description: '1st Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		},
		{
		  img: "https://placehold.co/330x330/png",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr. Montgomery Smith',
		  description: '2nd Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		},
		{
		  img: "https://placehold.co/330x330/png",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr. Ryan D',
		  description: '3rd Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		}
    ,
		{
		  img: "https://placehold.co/330x330/png",
		  title: 'Professor, Department of Biostatics',
		  name: 'Dr.A Ho D',
		  description: '4th Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
		}
	  ];

	  const data = {
		// displayType: col or row
		testimonialData:testimonialData,
		setting:{
			slideNum : 4,
			displayType:'col'
		},
		heading: {
			level:3,
			title: 'Meet the Biostatistics Faculty'
		}
	};
	return (
		<div className='ug-testimonial text-center bg-grey-light py-10' >
			<MeetFaculty
				data={data}
			/>
		</div>

	)
};
