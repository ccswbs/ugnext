import React from 'react';
import { Heading } from '@/components/heading';
import { Columns } from '@/components/columns';

export const WhatIsBiostatistics = () => {	
	return (
	<div>
		<Heading className='text-red' level={2}>What is Biostatistics</Heading>
		<p>
			The University of Guelph's Master of Biostatistics program gives you the hands-on science and business skills you need to succeed in a wide range of Biostatistics careers. You’ll gain advanced scientific and technical expertise, combined with business training in the commercialization of biotechnology innovations. Plus, you’ll grow academically and personally by interacting with other graduate students, faculty, the wider research community, and private-sector companies.
		</p>
		<p>
			The program deepens your scientific training and gives you business skills, preparing you for a fulfilling career in Canada or internationally. You’ll be qualified to work in sectors including agribusiness and food industries, plant biotechnology, pharmaceuticals, health management and environmental management and research. The full-spectrum training you receive in this course-based master's program draws on the expertise of two University of Guelph departments:
		</p>
		<Columns cols={3} className='pt-2'>
			<div>
				<Heading level={3} className="text-lg mb-1 mt-1">
					<span class="inline-flex items-center justify-center rounded-full bg-green-500 w-6 h-6 mr-2">
						<i class="text-white fas fa-check text-sm"></i>
					</span> 
					90% of Employment Rate
				</Heading>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
			<div>
				<Heading level={3} className="text-lg mb-1 mt-1">
					<span class="inline-flex items-center justify-center rounded-full bg-green-500 w-6 h-6 mr-2">
						<i class="text-white fas fa-check text-sm"></i>
					</span> 
					State-of-the-art Facilities
				</Heading>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
			<div>
				<Heading level={3} className="text-lg mb-1 mt-1">
					<span class="inline-flex items-center justify-center rounded-full bg-green-500 w-6 h-6 mr-2">
						<i class="text-white fas fa-check text-sm"></i>
					</span> 
					World-class Faculty
				</Heading>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</Columns>

	</div>
	)
};
