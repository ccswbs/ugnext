import React from 'react';
import { Heading } from '@/components/heading';
import { SpotlightCards } from '@/components/home/spotlight-cards';

export const CollaborativeSpecializations = ({data}) => {	
	const cards = data.spot_light_cards;
	console.log(cards);
	return (
	<div>
		<Heading className='text-red' level={2}>Collaborative Specializations</Heading>
		<p>
		While enrolled in the Biostatistics program, take one of the following collaborative specializations, earning you valuable multidisciplinary experience.
		</p>
		{/* <SpotlightCards cards={cards} />*/}

	</div>
	)
};
