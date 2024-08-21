import React, { useEffect } from 'react';
import { NavigationTab } from '@/components/programs/graduate/sessions/tabs/navigation-tab';

export const CourseCareerNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="my-5">
      <NavigationTab
        aria-label="Course and Career Navigation"
        links={[
          { href: '#courses', label: 'COURSES' },
          { href: '#fields-of-study', label: 'FIELDS OF STUDY' },
          { href: '#careers', label: 'CAREERS' },
          { href: '#partners', label: 'PARTNERS' },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
