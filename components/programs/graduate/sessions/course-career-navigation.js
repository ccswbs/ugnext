import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navigation } from '@/components/navigation';

export const CourseCareerNavigation = ({ setActiveTab }) => {
  /*const handleTabClick = (id, e) => {
    //e.preventDefault(); // Prevents the default action of following the link
    //setActiveTab(id); // Update active tab state based on clicked tab id
    //console.log('clicked'); // Log statement to verify if function is called

    //it does not work because Navigation component, have to replace it with custome code
  };*/

  return (
    <div className="my-5">
      <Navigation
        aria-label="Course and Career Navigation"
        links={[
          { href: '#courses', label: 'COURSES' },
          { href: '#fields-of-study', label: 'FIELDS OF STUDY' },
          { href: '#careers', label: 'CAREERS' },
          { href: '#partners', label: 'PARTNERS'  },
        ]}
      />
    </div>
  );
};
