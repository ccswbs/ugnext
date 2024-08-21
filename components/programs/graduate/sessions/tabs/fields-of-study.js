import React from 'react';
import { List, ListItem } from '@/components/list';

export const FieldsOfStudy = ({ data, activeTab }) => {
  const leftColumnItems = data.fields_of_study.slice(0, 4);
  const rightColumnItems = data.fields_of_study.slice(4);
  return (
    <div id="fields-of-study" className={activeTab === '#fields-of-study' ? '' : 'hidden'}>
      <p className="pl-2">This is just a sample of the fields of study:</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="px-2">
          <List>
            {leftColumnItems.map((course, index) => (
              <ListItem key={index}>{course}</ListItem>
            ))}
          </List>
        </div>

        <div className="px-2">
          <List>
            {rightColumnItems.slice(0, 3).map((course, index) => (
              <ListItem key={index}>{course}</ListItem>
            ))}
            {rightColumnItems.length > 3 && (
              <ListItem>
                <a href="/programs/graduate" className="text-blue-600 cursor-pointer">
                  View All Biostatistics Graduate fields of study
                </a>
              </ListItem>
            )}
          </List>
        </div>
      </div>
    </div>
  );
};
