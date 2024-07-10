import React from 'react';
import { Heading } from '@/components/heading';
import { Button } from '@/components/button';

export const ApplyNow = () => {	
	return (
	<div className='text-center mx-auto py-5'>
		<Heading level={3}>Are you ready to Improve Life?</Heading>
		<Button 
			href='#'
			children='Apply Now'
			color='red'
			className='w-400px py-4'
		/>

	</div>
	)
};
