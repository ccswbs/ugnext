import React from 'react';
import { Navigation } from '@/components/navigation';

export const ProgramNavigation = () => (
	<div className="my-5">
	<Navigation
		aria-label=""
		links={[
			{ href: '/programs/undergraduate', label: 'Undergraduate' },
			{ href: '/programs/graduate', label: 'Graduate' },
			{ href: '/programs/certificate-and-diploma', label: 'Certificate and Diploma' },
			{ href: '/programs/continuing-education', label: 'Continuing Education' },
		]}
	/>
	</div>
);
