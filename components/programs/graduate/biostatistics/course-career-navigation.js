import React from 'react';
import { Navigation } from '@/components/navigation';

export const CourseCareerNavigation = () => {
  const handleClick = (e) => {
    e.preventDefault(); // Prevents the default action of following the link
  };

  return (
    <div className="my-5">
      <Navigation
        aria-label="Course and Career Navigation"
        links={[
          { href: '#courses', label: 'COURSES', onClick: handleClick },
          { href: '#fields-of-study', label: 'FIELDS OF STUDY', onClick: handleClick },
          { href: '#careers', label: 'CAREERS', onClick: handleClick },
          { href: '#partners', label: 'PARTNERS', onClick: handleClick },
        ]}
      />
    </div>
  );
};