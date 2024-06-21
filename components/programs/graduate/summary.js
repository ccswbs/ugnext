import React from 'react';
import { Heading } from '@/components/heading';
import { List, ListItem } from '@/components/list';

export const GraduateProgramSummary = ({ data }) => {
  if (!data) {
    return <div>No data to see here :(</div>;
  }

  return (<>
    {/* <Heading level={2}>Program Summary</Heading> */}
    <div className="mx-auto p-5 bg-gray-900">      
      <dl className="!leading-loose">
        <dt className="text-yellow-400 font-bold">Program type</dt>
        <dd className="text-white">{data.program_type}</dd>
        <dt className="text-yellow-400 font-bold">Degree</dt>
        <dd className="text-white leading-relaxed">{data.degree_type} - {data.degree_name}</dd>
        <dt className="text-yellow-400 font-bold">Delivery</dt>
        <dd className="text-white">{data.delivery_method}</dd>        
        <dt className="text-yellow-400 font-bold">Duration</dt>
        <dd className="text-white">
          {data.program_length}
          {data.part_time_available && (
            <>
              <br />
              part-time is available
            </>
          )}
        </dd>        
        <dt className="text-yellow-400 font-bold">Admission Average</dt>
        <dd className="text-white">{data.admission_average}</dd>
      </dl>
      <Heading level={3} className="text-xl text-yellow-400 mt-4 mb-2">Intake Terms &amp; Deadlines</Heading>
      {data.intake_term_domestic && <>
      <Heading level={4} className="font-normal text-lg text-gray-400 mt-4 mb-2">Domestic</Heading>
        <List>
          {data.intake_term_domestic.map(term => (
            <ListItem key={term.name} className="text-white">
              {term.deadline} ({term.name})
            </ListItem>
          ))}
        </List>
      </>}      
      {data.intake_term_international && <>
      <Heading level={4} className="font-normal text-lg text-gray-400 mt-4 mb-2">International</Heading>
      <ul>
        {data.intake_term_international.map(term => (
        <li key={term.name} className="text-white">
          {term.deadline} ({term.name})
        </li>
        ))}
      </ul>
      </>}
    </div>
  </>);
};

