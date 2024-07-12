import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NavigationGraduateProgram } from '@/components/programs/graduate/sessions/tabs/navigation-grad-program';

export const CourseCareerNavigation = ({ activeTab,setActiveTab }) => {
  
  return (
    <div className="my-5">
      <NavigationGraduateProgram
        aria-label="Course and Career Navigation"
        links={[
          { href: '#courses', label: 'COURSES' },
          { href: '#fields-of-study', label: 'FIELDS OF STUDY' },
          { href: '#careers', label: 'CAREERS' },
          { href: '#partners', label: 'PARTNERS'  },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
