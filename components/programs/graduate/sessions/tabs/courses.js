import React from 'react';
import { List, ListItem } from '@/components/list';
import { Link } from '@/components/link';

export const CourseTab = ({data,activeTab}) => {
  
const leftColumnItems = data.courses.slice(0, 4);
const rightColumnItems = data.courses.slice(4);
  return (
    <div id="courses" className={activeTab === '#courses' ? '' : 'hidden'}>
        <p className='pl-2'>This is just a sample of the course options:</p>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='px-2'>				
                <List>
                {leftColumnItems.map((course, index) => (
                    <ListItem key={index}>
                    {course}
                    </ListItem>
                ))}
                </List>					
            </div>

            <div className='px-2'>
                <List>
                    {rightColumnItems.slice(0, 3).map((course, index) => (
                    <ListItem key={index}>
                    {course}
                    </ListItem>
                ))}
                    {rightColumnItems.length > 3 && (
                    <ListItem>
                        <Link
                            className='text-blue-600 cursor-pointer'
                            href='/programs/graduate'
                        >
                            View All Biostatistics Graduate Courses
                        </Link>
                    </ListItem>
                )}
                </List>
            </div>
        </div>
	</div>        
  );
};