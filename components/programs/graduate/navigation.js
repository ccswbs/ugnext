import React from 'react';
import { Navigation } from '@/components/navigation';

export const GraduateProgramNavigation = () => (
	<div className="my-5">
    <Navigation
      aria-label=""
      links={[
        { href: '#', label: 'Undergraduate Programs' },
        { href: '#', label: 'Graduate Programs' },
        { href: '#', label: 'Certificate and Diplomas' },
        { href: '#', label: 'Continuing Education' },
      ]}
    />
	</div>
);
